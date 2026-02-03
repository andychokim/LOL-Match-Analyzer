import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import heroRoutes from './routes/heroRoutes.js';
import riotRoutes from './routes/riotRoutes.js';

// express app
const app = express();

app.use(cors());
app.use(express.json());

// middlewares
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(req.path, req.method);
    next();
});

// heroRoutes
app.use('/', heroRoutes);

// riotRoutes
app.use('/api/riot', riotRoutes);


export default app;
