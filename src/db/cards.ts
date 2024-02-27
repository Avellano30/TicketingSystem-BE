import mongoose, { Document } from "mongoose";

export interface BeepTransaction {
    fare: number | null;
    tapIn: {
        station: string;
        date: string;
    } | null;
    tapOut: {
        station: string;
        date: string;
    } | null;
    distance: number | null;
}

export interface BeepCard extends Document {
    cardId: number;
    balance: number;
    transactions: BeepTransaction[];
    deviceID: string;
}

const COLLECTION_NAME = 'cards';

const CardSchema = new mongoose.Schema({
    cardId: { type: Number, required: true, unique: true },
    balance: { type: Number, required: true },
    transactions: [
        {
            fare: { type: Number, default: null },
            tapIn: {
                station: { type: String, default: null },
                date: { type: String, default: null },
            },
            tapOut: {
                station: { type: String, default: null },
                date: { type: String, default: null },
            },
            distance: { type: Number, default: null },
        }

    ],
    deviceID:{ type: String, default: null }
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

export const getCardByDeviceId = async (deviceID: string): Promise<BeepCard[] | null> => {
    return CardModel.find({ deviceID: deviceID });
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

export const updateTransaction = async (cardId: string, transactionId: string, updatedTransactionData: Partial<BeepTransaction>): Promise<BeepCard | null> => {
    const query = { cardId: cardId, 'transactions._id': transactionId };
    const update = {
        $set: {
            'transactions.$[elem].fare': updatedTransactionData.fare,
            'transactions.$[elem].tapOut': updatedTransactionData.tapOut,
            'transactions.$[elem].distance': updatedTransactionData.distance
        }
    };
    const arrayFilters = [{ 'elem._id': new mongoose.Types.ObjectId(transactionId) }];
    const options = { arrayFilters: arrayFilters, new: true };

    return CardModel.findOneAndUpdate(query, update, options);
};
