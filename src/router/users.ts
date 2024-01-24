import express from 'express';

import { getAllUsers, deleteUser, updateUser, getUserData } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:userId', isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:userId', isAuthenticated, isOwner, updateUser);

    // Not Admin
    router.get('/users/:userId', getUserData);
}