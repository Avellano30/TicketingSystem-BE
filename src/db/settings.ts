import mongoose from "mongoose";

const COLLECTION_NAME = 'settings';

const SettingSchema = new mongoose.Schema({
    min_fare: { type: Number, required: true },
    max_fare: { type: Number, required: true },
    fare_per_km: { type: Number, required: true },
    initial_load: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

export const SettingModel = mongoose.model("Setting", SettingSchema, COLLECTION_NAME);

export const getSettings = () => SettingModel.find();
export const getSettingById = (settingId: string) => SettingModel.findOne({ _id: settingId});
export const updateSettingById = async (settingId: string, values: Record<string, any>) => {
    return SettingModel.findByIdAndUpdate(settingId, values, { new: true });
};