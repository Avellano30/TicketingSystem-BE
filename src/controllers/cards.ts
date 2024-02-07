import express from 'express';
import {
    createCard, deleteCardById, getCardById, getCards,
    addTransactionToCard, BeepTransaction, updateTransaction
} from '../db/cards';

export const getAllCards = async (req: express.Request, res: express.Response) => {
    try {
        const cards = await getCards();
        return res.status(200).json(cards);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const createNewCard = async (req: express.Request, res: express.Response) => {
    try {
        const { cardId, balance } = req.body;

        if (!cardId || !balance) {
            return res.sendStatus(400);
        }

        const existingCard = await getCardById(cardId);

        if (existingCard) {
            return res.sendStatus(400);
        }

        const card = await createCard({
            cardId,
            balance,
        });

        res.status(200).json(card);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const getCardTransaction = async (req: express.Request, res: express.Response) => {
    try {
        const { cardId } = req.params;

        const card = await getCardById(cardId);

        if (card === null) {
            return res.status(404); // Card not found
        }

        return res.status(200).json({
            transactions: card.transactions
        });
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const getCardBalance = async (req: express.Request, res: express.Response) => {
    try {
        const { cardId } = req.params;

        const card = await getCardById(cardId);

        if (card === null) {
            return res.sendStatus(404); // Card not found
        }

        return res.status(200).json({ balance: card.balance });
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const updateCardBalance = async (req: express.Request, res: express.Response) => {
    try {
        const { cardId } = req.params;
        const { balance: addBalance } = req.body;

        // Ensure addBalance is a valid number and not negative
        const parsedBalance = Number(addBalance);
        if (!addBalance || isNaN(parsedBalance) || parsedBalance < 0) {
            return res.sendStatus(400);
        }

        const card = await getCardById(cardId);

        if (!card) {
            return res.sendStatus(404);
        }

        // Ensure 'balance' and 'additionalBalance' are valid numbers
        const currentBalance = card.balance || 0; // Assuming initial balance is 0 if undefined

        // Calculate new balance by adding additional balance to the current balance
        const newBalance = currentBalance + Number(addBalance);

        // Update card's balance with the new balance
        card.balance = newBalance;
        await card.save();

        return res.status(200).json(card);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const deleteCard = async (req: express.Request, res: express.Response) => {
    try {
        const { cardId } = req.params;

        const deletedCard = await deleteCardById(cardId);

        if (!deletedCard) {
            return res.sendStatus(404);
        }

        return res.json(deletedCard);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const addTransaction = async (req: express.Request, res: express.Response): Promise<void> => {
    const { cardId } = req.params;

    try {
        // Extract 'transaction' from the request body
        const { transaction } = req.body as { transaction: BeepTransaction };
        
        // Check if 'transaction' is missing
        if (!transaction) {
            res.status(400).json({ error: 'Transaction data is missing' });
            return;
        }

        const updatedCard = await addTransactionToCard(cardId, transaction);

        if (updatedCard) {
            res.status(200).json(updatedCard);
        } else {
            res.status(404).json({ error: 'Card not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateLastTransaction = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { cardId, transactionId  } = req.params;
        const { fare, tapOut, distance }: Partial<BeepTransaction> = req.body;

        if (!cardId || !transactionId  || (fare === undefined && tapOut === undefined && distance === undefined)) {
            res.status(400).json({ error: 'Invalid request parameters or missing data' });
            return;
        }

        const updatedTransactionData: Partial<BeepTransaction> = {
            fare,
            tapOut,
            distance
        };

        const updatedCard = await updateTransaction(cardId, transactionId , updatedTransactionData);

        if (!updatedCard) {
            res.status(404).json({ error: 'Card not found or transaction not updated' });
            return;
        }

        const card = await getCardById(cardId);

        if (!card) {
            res.sendStatus(404);
            return;
        }

        const currentBalance = card.balance || 0;
        
        const newBalance = currentBalance - (fare || 0);

        card.balance = newBalance;
        await card.save();

        res.status(200).json(updatedCard);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};