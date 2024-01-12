import mongoose, { Document } from "mongoose";

interface ITransaction {
    fare: number;
    date: string;
}

interface ICard extends Document {
    cardId: number;
    balance: number;
    transactions: ITransaction[];
}

const COLLECTION_NAME = 'cards';

const CardSchema = new mongoose.Schema({
    cardId: { type: Number, required: true },
    balance: { type: Number, required: true },
    transactions: [
        {
            fare: { type: Number, required: true },
            date: { type: String, required: true },
        }
    ]
}, { collection: COLLECTION_NAME });

export const CardModel = mongoose.model<ICard>("Card", CardSchema, COLLECTION_NAME);

export const createCard = async (cardData: Partial<ICard>): Promise<ICard> => {
    const card = await new CardModel(cardData).save();
    return card.toObject();
};

export const getCards = async (): Promise<ICard[]> => {
    return CardModel.find();
};

export const getCardById = async (cardId: string): Promise<ICard | null> => {
    return CardModel.findOne({ cardId: cardId });
};

export const deleteCardById = async (cardId: string): Promise<ICard | null> => {
    return CardModel.findOneAndDelete({ cardId: cardId });
};

export const updateCardById = async (cardId: string, values: Partial<ICard>): Promise<ICard | null> => {
    return CardModel.findOneAndUpdate({ cardId: cardId }, values, { new: true });
};

export const addTransactionToCard = async (cardId: string, transaction: ITransaction): Promise<ICard | null> => {
    return CardModel.findOneAndUpdate(
        { cardId: cardId },
        { $push: { transactions: transaction } },
        { new: true }
    );
};