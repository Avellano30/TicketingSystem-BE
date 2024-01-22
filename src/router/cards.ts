import express from 'express';

import { isAuthenticated } from '../middlewares';
import { createNewCard, deleteCard, getAllCards, getCardBalance, updateCardBalance, addTransactionToCardController } from '../controllers/cards';

export default (router: express.Router) => {
    router.post('/card/create', isAuthenticated, createNewCard);
    router.get('/cards', isAuthenticated, getAllCards);
    router.get('/cards/:cardId/balance', isAuthenticated, getCardBalance);
    router.patch('/cards/:cardId', isAuthenticated, updateCardBalance);
    router.delete('/cards/:cardId', isAuthenticated, deleteCard);
    router.post('/cards/:cardId/transactions', addTransactionToCardController);
}