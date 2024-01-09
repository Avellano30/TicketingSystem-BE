import mongoose, { Document } from "mongoose";

interface ICard extends Document {
    cardId: number;
    balance: number;
}

const COLLECTION_NAME = 'cards';

const CardSchema = new mongoose.Schema({
    cardId: { type: Number, required: true },
    balance: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

export const CardModel = mongoose.model<ICard>("Card", CardSchema, COLLECTION_NAME);

export const createCard = (cardData: Partial<ICard>) => new CardModel(cardData).save().then((card) => card.toObject());
export const getCards = () => CardModel.find();
export const getCardById = (cardId: string) => CardModel.findOne({ cardId: cardId });
export const deleteCardById = (cardId: string) => CardModel.findOneAndDelete({ cardId: cardId });
export const updateCardById = (cardId: string, values: Partial<ICard>) => CardModel.findOneAndUpdate({ cardId: cardId }, values);
