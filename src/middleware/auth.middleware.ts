import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token.service';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token' });
        return;
    }

    try {
        const payload = verifyToken(token);
        (req as any).driverId = payload.driverId;
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

