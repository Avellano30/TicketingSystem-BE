import express from 'express';

import { getAllSettings, getSetting, updateSetting,  } from '../controllers/settings';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.get('/setting', isAuthenticated, getAllSettings);
    router.patch('/setting/:settingId', isAuthenticated, updateSetting);
}