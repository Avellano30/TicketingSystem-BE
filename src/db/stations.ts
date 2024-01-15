import mongoose from "mongoose";

const COLLECTION_NAME = 'stations';

const StationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    coordinates: { type: [Number], required: true },
    connectedTo: { type: [String], required: true },
}, { collection: COLLECTION_NAME });

export const StationModel = mongoose.model("Station", StationSchema, COLLECTION_NAME);

export const getStations = () => StationModel.find();
export const getStationByName = (name: string) => StationModel.findOne({ name });
export const createStation = (values: Record<string, any>) => new StationModel(values).save().then((station) => station.toObject());
export const deleteStationById = (stationId: string) => StationModel.findOneAndDelete({ _id: stationId });
export const updateStationById = async (stationId: string, values: Record<string, any>) => {
    return StationModel.findByIdAndUpdate(stationId, values, { new: true });
};


// export const deleteUserById = (userId: string) => UserModel.findOneAndDelete({ _id: userId});