import mongoose from "mongoose";

const COLLECTION_NAME = 'adminAccounts';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: true },
    },
}, { collection: COLLECTION_NAME });

export const UserModel = mongoose.model("User", UserSchema, COLLECTION_NAME);

export const getUsers = () => UserModel.find();
export const getUserdByEmail = (email: string) => UserModel.findOne({email});
export const getUserdByUsername = (username: string) => UserModel.findOne({username});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (userId: string) => UserModel.findById(userId);

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (userId: string) => UserModel.findOneAndDelete({ _id: userId});
export const updateUserById = (userId: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(userId, values);