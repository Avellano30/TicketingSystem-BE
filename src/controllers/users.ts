import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.sendStatus(err);
    }
};

export const getUserData = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;
        const users = await getUserById(userId);
        
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.sendStatus(err);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;
        
        const deleteUser = await deleteUserById(userId);

        return res.json(deleteUser);
    } catch (err) {
         console.error(err);
         return res.sendStatus(err);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;
        const { username } = req.body;

        if(!username) {
            return res.sendStatus(401);
        }
        const user = await getUserById(userId);

        user.username = username;
        await user.save();

        return res.status(200).json(user).end();
    } catch (err) {
         console.error(err);
         return res.sendStatus(err);
    }
};