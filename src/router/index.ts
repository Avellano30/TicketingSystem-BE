import express from 'express';

import authentication from './authentication';
import users from './users';
import cards from './cards';
import stations from './stations';
import settings from './settings';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    cards(router);
    stations(router);
    settings(router);
    
    return router;
}