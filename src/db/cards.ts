import mongoose from "mongoose";

const COLLECTION_NAME = 'cards';

const CardSchema = new mongoose.Schema({
    cardId: { type: Number, required: true },
    balance: { type: String, required: true },
}, { collection: COLLECTION_NAME });

export const CardModel = mongoose.model("Card", CardSchema, COLLECTION_NAME);

export const getCards = () => CardModel.find();
export const getCardById = (cardId: string) => CardModel.findById(cardId);
export const createCard = (values: Record<string, any>) => new CardModel(values).save().then((user) => user.toObject());
export const deleteCardById = (cardId: string) => CardModel.findOneAndDelete({ _id: cardId});
export const updateCardById = (cardId: string, values: Record<string, any>) => CardModel.findByIdAndUpdate(cardId, values);