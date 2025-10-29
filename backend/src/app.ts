import express, { Request, Response } from 'express';
import cors from 'cors';
import riotRoutes from './routes/riotRoutes';

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next) => {
    console.log(req.path, req.method);
    next();
});

// riotRoutes
app.use('/api/riot', riotRoutes);


export default app;
