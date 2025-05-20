import { Request, Response } from 'express';
import { mockDrivers } from '../utils/mockDrivers';
import { generateToken } from '../services/token.service';

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;
    const driver = mockDrivers.find(d => d.username === username && d.password === password);

    if (!driver) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    const token = generateToken(driver.id);
    res.json({ token, driver });
}

