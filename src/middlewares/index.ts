import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { get, merge} from 'lodash';

import { getUserById, getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { userId } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(400);
        }

        if (currentUserId.toString() != userId) {
            return res.sendStatus(400);
        }
        
        next();
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.headers['authorization'];

        const secretKey = process.env.SECRET_KEY;

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json('Unauthorized user');
        }

        const sessionToken = token.split(' ')[1];

        try {
            const decoded = jwt.verify(sessionToken, secretKey) as JwtPayload;
            console.log(decoded);

            // Check if the token has expired
            const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
            if (decoded.exp && decoded.exp < currentTimestamp) {
                return res.status(401).json('Token has expired');
            }

            // Fetch user information based on the decoded userId
            const existingUser = await getUserById(decoded.userId);

            if (!existingUser) {
                return res.status(403).json('Invalid session token');
            }

            merge(req, { identity: existingUser }); // Attach user information to the request object

            return next(); // Move to the next middleware in the chain
        } catch (error) {
            return res.status(400).json('Token not valid');
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
};