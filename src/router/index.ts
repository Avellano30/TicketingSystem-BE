import express from 'express';

import authentication from './authentication';
import users from './users';
import cards from './cards';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    cards(router);

    return router;
}