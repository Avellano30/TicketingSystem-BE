import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { createUser, getUserdByEmail, getUserdByUsername } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserdByUsername(username).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash) {
            return res.sendStatus(403);
        }

        // Generate a JWT session token
        const sessionToken = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        user.authentication.sessionToken = sessionToken;

        await user.save();

        // res.cookie('TICKETING-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json({ token: sessionToken, user }).end();
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password, username } = req.body;
        
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserdByUsername(username);
        const existingEmail = await getUserdByEmail(email);

        if (existingUser || existingEmail) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: { 
                salt,
                password: authentication(salt, password),
            },
        });

        res.status(200).json(user).end();
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}