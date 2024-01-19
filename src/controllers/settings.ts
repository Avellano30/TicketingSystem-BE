import { Request, Response } from "express";
import { getSettings, getSettingById, updateSettingById } from "../db/settings";

export const getAllSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const stations = await getSettings();
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const settingId = req.params.settingId;
        const setting = await getSettingById(settingId);
        
        if (setting) {
            res.json(setting);
        } else {
            res.status(404).send('Setting not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const settingId = req.params.settingId;
        const updatedSetting = await updateSettingById(settingId, req.body);

        if (updatedSetting) {
            res.json(updatedSetting);
        } else {
            res.status(404).send('Setting not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};