import express from 'express';

import { isAuthenticated } from '../middlewares';
import { createNewCard, deleteCard, getAllCards, updateCardBalance } from '../controllers/cards';

export default (router: express.Router) => {
    router.post('/card/create', createNewCard);
    router.get('/cards', getAllCards);
    router.patch('/cards/:cardId', isAuthenticated, updateCardBalance);
    router.delete('/cards/:cardId', deleteCard);
}