import express from 'express';

import { getAllStations, createNewStation, updateStation, deleteStation } from '../controllers/stations';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.get('/stations', isAuthenticated, getAllStations);
    router.post('/stations/create', isAuthenticated, createNewStation);
    router.delete('/stations/:stationId', isAuthenticated, deleteStation);
    router.patch('/stations/:stationId', isAuthenticated, updateStation);
}