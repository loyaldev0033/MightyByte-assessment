import jwt from 'jsonwebtoken';

const SECRET = 'supersecret';
const EXPIRES_IN = '5m';

export const generateToken = (driverId: string) => {
  return jwt.sign({ driverId }, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): { driverId: string } => {
  return jwt.verify(token, SECRET) as any;
};
