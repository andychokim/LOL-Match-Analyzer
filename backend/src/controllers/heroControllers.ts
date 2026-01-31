import { Request, Response, NextFunction } from 'express';

// Get hero page
export async function getHeroPageHandler(_req: Request, res: Response, _next: NextFunction): Promise<Response | void> {
    try {
        return res.json('Welcome to the LOL Match Analyzer API Hero Page!');
    }
    catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to load hero page' });
    }
};