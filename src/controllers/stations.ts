import { Request, Response } from 'express';
import { getStations, getStationByName, createStation, deleteStationById, updateStationById, getStationById, StationModel } from '../db/stations';


export const getAllStations = async (req: Request, res: Response): Promise<void> => {
    try {
        const stations = await getStations();
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getStationWithName = async (req: Request, res: Response): Promise<void> => {
    try {
        const stationName = req.params.stationName;
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

export const getStationWithId = async (req: Request, res: Response): Promise<void> => {
    try {
        const stationId = req.params.stationId;
        const station = await getStationById(stationId).populate('connectedTo');
        
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

        const existingStation = await StationModel.findById(stationId);

        if (!existingStation) {
            res.status(404).send('Station not found');
            return;
        }
        
        const removedConnections = existingStation.connectedTo;
        if (removedConnections.length > 0) {
            // Update connectedTo in other stations where the connections are removed
            await StationModel.updateMany(
                { name: { $in: removedConnections } },
                { $pull: { connectedTo: existingStation.name } }
            );
        }
        
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
        const values = req.body;

        const existingStation = await StationModel.findById(stationId);

        if (!existingStation) {
            res.status(404).send('Station not found');
            return;
        }
        
        const newName = values.name;
        if (newName && newName !== existingStation.name) {
            // Update connectedTo in other stations where this station is connected
            await StationModel.updateMany(
                { connectedTo: existingStation.name },
                { $set: { "connectedTo.$": newName } }
            );
        }

        // Handle adding new connections
        const newConnections = values.connectedTo;
        if (newConnections && Array.isArray(newConnections)) {
            const uniqueNewConnections = newConnections.filter(conn => !existingStation.connectedTo.includes(conn));
            existingStation.connectedTo.push(...uniqueNewConnections);

            // Update connectedTo in other stations where the new connections are present
            await StationModel.updateMany(
                { name: { $in: uniqueNewConnections } },
                { $addToSet: { connectedTo: existingStation.name } }
            );
        }

        // Handle removing connections
        const removedConnections = existingStation.connectedTo.filter(conn => !values.connectedTo.includes(conn));
        if (removedConnections.length > 0) {
            existingStation.connectedTo = existingStation.connectedTo.filter(conn => !removedConnections.includes(conn));

            // Update connectedTo in other stations where the connections are removed
            await StationModel.updateMany(
                { name: { $in: removedConnections } },
                { $pull: { connectedTo: existingStation.name } }
            );
        }

        // Update the station
        const updatedStation = await StationModel.findByIdAndUpdate(stationId, values, { new: true });

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
