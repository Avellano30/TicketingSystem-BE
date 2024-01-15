import { Request, Response } from 'express';
import { getStations, getStationByName, createStation, deleteStationById, updateStationById } from '../db/stations';


export const getAllStations = async (req: Request, res: Response): Promise<void> => {
    try {
        const stations = await getStations();
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getStation = async (req: Request, res: Response): Promise<void> => {
    try {
        const stationName = req.params.name;
        const station = await getStationByName(stationName);
        
        if (station) {
            res.json(station);
        } else {
            res.status(404).send('Station not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const createNewStation = async (req: Request, res: Response): Promise<void> => {
    try {
        const newStation = await createStation(req.body);
        res.json(newStation);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteStation = async (req: Request, res: Response): Promise<void> => {
    try {
        const stationId = req.params.stationId;
        const deletedStation = await deleteStationById(stationId);

        if (deletedStation) {
            res.json(deletedStation);
        } else {
            res.status(404).send('Station not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateStation = async (req: Request, res: Response): Promise<void> => {
    try {
        const stationId = req.params.stationId;
        const updatedStation = await updateStationById(stationId, req.body);

        if (updatedStation) {
            res.json(updatedStation);
        } else {
            res.status(404).send('Station not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
