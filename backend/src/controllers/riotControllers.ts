import { Request, Response } from 'express';
import * as riotService from '../services/riotService';
import { getPlayerSummary } from '../services/playerSummaryService';

/**
 * routes
 */
// Get a PUUID by summoner name and tag
export async function getPUUIDHandler(req: Request, res: Response) {
    try {
        const { summonerName, tagLine } = req.params;
        console.log(`Fetching PUUID for ${summonerName}#${tagLine}`);

        const puuid = await riotService.getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.json(puuid);
    }
    catch (error: any) {
        const statusCode = error.statusCode;

        if (statusCode) {
            if (statusCode === 400) {
                res.status(400).json({ error: 'Bad Request' });
            }
            else if (statusCode === 401) {
                res.status(401).json({ error: 'Unauthorized: Invalid API key' });
            }
            else if (statusCode === 403) {
                res.status(403).json({ error: 'Forbidden: Access denied' });
            }
            else if (statusCode === 404) {
                res.status(404).json({ error: 'Summoner not found' });
            }
            else if (statusCode === 429) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            }
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Get recent matches by PUUID
export async function getRecentMatchesHandler(req: Request, res: Response) {
    try {
        const { puuid } = req.params;
        console.log(`Fetching recent matches for PUUID: ${puuid}`);

        const matches = await riotService.getRecentMatchesByPUUID(puuid);
        res.json(matches);
    }
    catch (error: any) {
        const statusCode = error.statusCode;

        if (statusCode) {
            if (statusCode === 400) {
                res.status(400).json({ error: 'Bad Request' });
            }
            else if (statusCode === 401) {
                res.status(401).json({ error: 'Unauthorized: Invalid API key' });
            }
            else if (statusCode === 403) {
                res.status(403).json({ error: 'Forbidden: Access denied' });
            }
            else if (statusCode === 404) {
                res.status(404).json({ error: 'Data not found' });
            }
            else if (statusCode === 429) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            }
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Get a player summary by PUUID and match ID
export async function getPlayerSummaryHandler(req: Request, res: Response) {
    try {
        const { puuid, matchID } = req.params;
        console.log(`Fetching player summary for PUUID: ${puuid} in Match ID: ${matchID}`);

        const data = await getPlayerSummary(puuid, matchID);
        res.json(data);
    }
    catch (error: any) {
        const statusCode = error.statusCode;

        if (statusCode) {
            if (statusCode === 400) {
                res.status(400).json({ error: 'Bad Request' });
            }
            else if (statusCode === 401) {
                res.status(401).json({ error: 'Unauthorized: Invalid API key' });
            }
            else if (statusCode === 403) {
                res.status(403).json({ error: 'Forbidden: Access denied' });
            }
            else if (statusCode === 404) {
                res.status(404).json({ error: 'Data not found' });
            }
            else if (statusCode === 429) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            }
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
