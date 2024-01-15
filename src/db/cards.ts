import mongoose, { Document } from "mongoose";

interface BeepTransaction {
    fare: number;
    date: string;
}

interface BeepCard extends Document {
    cardId: number;
    balance: number;
    transactions: BeepTransaction[];
}

const COLLECTION_NAME = 'cards';

const CardSchema = new mongoose.Schema({
    cardId: { type: Number, required: true, unique: true },
    balance: { type: Number, required: true },
    transactions: [
        {
            fare: { type: Number, required: true },
            date: { type: String, required: true },
        }
    ]
}, { collection: COLLECTION_NAME });

export const CardModel = mongoose.model<BeepCard>("Card", CardSchema, COLLECTION_NAME);

export const createCard = async (cardData: Partial<BeepCard>): Promise<BeepCard> => {
    const card = await new CardModel(cardData).save();
    return card.toObject();
};

export const getCards = async (): Promise<BeepCard[]> => {
    return CardModel.find();
};

export const getCardById = async (cardId: string): Promise<BeepCard | null> => {
    return CardModel.findOne({ cardId: cardId });
};

export const deleteCardById = async (cardId: string): Promise<BeepCard | null> => {
    return CardModel.findOneAndDelete({ cardId: cardId });
};

export const updateCardById = async (cardId: string, values: Partial<BeepCard>): Promise<BeepCard | null> => {
    return CardModel.findOneAndUpdate({ cardId: cardId }, values, { new: true });
};

export const addTransactionToCard = async (cardId: string, transaction: BeepTransaction): Promise<BeepCard | null> => {
    return CardModel.findOneAndUpdate(
        { cardId: cardId },
        { $push: { transactions: transaction } },
        { new: true }
    );
};