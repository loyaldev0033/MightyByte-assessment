import { Request, Response } from 'express';
import { updateDriverLocation } from '../services/diver.service';

export const updateLocation = (req: Request, res: Response): void => {
    const { lat, long } = req.body;
    const driverId = (req as any).driverId;

    if (!lat || !long) {
        res.status(400).json({ error: 'Missing coordinates' });
        return;
    }

    updateDriverLocation(driverId, lat, long);
    res.status(200).json({ success: true });
};
