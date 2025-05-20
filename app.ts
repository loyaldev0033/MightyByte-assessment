import express from 'express';
import cors from 'cors';
import { login } from './src/controllers/auth.controller';
import { updateLocation } from './src/controllers/diver.controller';
import { authenticate } from './src/middleware/auth.middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', login);
app.post('/driver/update', authenticate, updateLocation);

export default app;
