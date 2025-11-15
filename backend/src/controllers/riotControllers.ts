import {Request, Response, NextFunction} from 'express';
import * as riotService from '../services/riotService';
import { getPlayerSummary } from '../services/playerSummaryService';

/**
 * routes
 */

// Get a PUUID by summoner name and tag
export async function getPUUIDHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { summonerName, tagLine } = req.params;
        console.log(`Fetching PUUID for ${summonerName}#${tagLine}`);

        const puuid = await riotService.getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.json(puuid);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch PUUID' });
    }
};

// Get recent matches by PUUID
export async function getRecentMatchesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { puuid } = req.params;
        console.log(`Fetching recent matches for PUUID: ${puuid}`);

        const matches = await riotService.getRecentMatchesByPUUID(puuid);
        res.json(matches);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch recent matches' });
    }
};

// Get a match details by match ID
export async function getMatchDetailsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { matchID } = req.params;
        console.log(`Fetching match details for Match ID: ${matchID}`);

        const data = await riotService.getMatchDetailsByMatchID(matchID);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch match details' });
    }
};

// Get a match timeline by match ID
export async function getMatchTimelineHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { matchID } = req.params;
        console.log(`Fetching match timeline for Match ID: ${matchID}`);

        const data = await riotService.getMatchTimelineByMatchID(matchID);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch match timeline' });
    }
};

// Get a player summary by PUUID and match ID
export async function getPlayerSummaryHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { puuid, matchID } = req.params;
        console.log(`Fetching player summary for PUUID: ${puuid} in Match ID: ${matchID}`);

        const data = await getPlayerSummary(puuid, matchID);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch player summary' });
    }
};
