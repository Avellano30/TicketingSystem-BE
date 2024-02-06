import express from 'express';

import { isAuthenticated } from '../middlewares';
import { createNewCard, deleteCard, getAllCards, getCardTransaction, getCardBalance, updateCardBalance, addTransaction, updateLastTransaction } from '../controllers/cards';

export default (router: express.Router) => {
    router.post('/card/create', isAuthenticated, createNewCard);
    router.get('/cards', isAuthenticated, getAllCards);
    router.patch('/cards/:cardId', isAuthenticated, updateCardBalance);
    router.delete('/cards/:cardId', isAuthenticated, deleteCard);

    // Not admin
    router.get('/cards/:cardId/balance', getCardBalance);
    router.get('/cards/:cardId/cardTransac', getCardTransaction);
    router.post('/cards/:cardId/transactions', addTransaction);
    router.patch('/cards/:cardId/transactions/:transactionId', updateLastTransaction);
}