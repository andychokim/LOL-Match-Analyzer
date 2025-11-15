import {Request, Response, NextFunction} from 'express';

// Get hero page
export async function getHeroPageHandler(req: Request, res: Response, next: NextFunction) {
    try {
        res.json('Welcome to the LOL Match Analyzer API Hero Page!');
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to load hero page' });
    }
};