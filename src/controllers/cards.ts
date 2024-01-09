import express from 'express';
import { createCard, deleteCardById, getCardById, getCards } from '../db/cards';

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
