import { Request, Response } from 'express';
import * as riotService from '../services/riotService';
import { getPlayerSummary } from '../services/playerSummaryService';
import { playerSummaryModel } from '../models/playerSummaryModel'; // playerSummary model for post operation
import { APIError } from '../errors/APIError';

// controllers
/**
 * Get a PUUID by summoner name and tag
 * @param req params: summonerName, tagLine
 * @param res json formatted puuid for successful request, status code and error message for failed request
 */
export async function getPUUIDController(req: Request, res: Response) {
    const { summonerName, tagLine } = req.params;
    console.log(`Fetching PUUID for ${summonerName}#${tagLine}`);

    try {

        const puuid = await riotService.getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.status(200).json(puuid);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: `${statusCode}: ${message}` });
    }
};

/**
 * Get recent matches by PUUID
 * @param req params: puuid
 * @param res json formatted array of match IDs for successful request, status code and error message for failed request
 */
export async function getRecentMatchesController(req: Request, res: Response) {
    const { puuid } = req.params;
    console.log(`Fetching recent matches for PUUID: ${puuid}`);
    
    try {
        const matches = await riotService.getRecentMatchesByPUUID(puuid);
        res.status(200).json(matches);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: `${statusCode}: ${message}` });
    }
};

/**
 * Get a player summary by PUUID and match ID
 * Fetches the player summary from the database if it exists, otherwise fetches it from the Riot API and saves it to the database.
 * @param req params: puuid, matchid
 * @param res json formatted player summary for successful request, status code and error message for failed request
 */
export async function getPlayerSummaryController(req: Request, res: Response) {
    const { puuid, matchid } = req.params;
    console.log(`Fetching player summary for PUUID: ${puuid} and MatchID: ${matchid}`);

    try {
        const data = await playerSummaryModel.findOne({ puuid:puuid, matchid:matchid });

        if (!data) {
            console.log(`No previous data found - generating new data with PUUID: ${puuid} and MatchID: ${matchid}`);

            try {
                const data = await getPlayerSummary(puuid, matchid);

                if (!data) throw new Error('404: Player summary not found') as APIError;
                else res.status(200).json(data);
            }
            catch (error: unknown) {
                const apiError = error as APIError;
                const statusCode = apiError.status || 500;
                const message = apiError.statusText || 'Internal Server Error';

                res.status(statusCode).json({ error: `${statusCode}: ${message}` } );
            }
        }
        else {
            console.log(`Previous data found - returning saved data for PUUID: ${puuid} and MatchID: ${matchid}`);
            res.status(200).json(data.analysis);
        }
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: `${statusCode}: ${message}` } );
    }
};

/**
 * Post a player summary to the database
 * @param req params: puuid, matchid
 * @param res success message for successful request, status code and error message for failed request
 */
export async function postPlayerSummaryController(req: Request, res: Response) {
    const { puuid, matchid, analysis } = req.body;
    console.log(`Posting player summary for PUUID: ${puuid} and MatchID: ${matchid}`);

    // condition 1: check for any missing parameters
    const missingParams = [];
    if (!puuid) missingParams.push('puuid');
    if (!matchid) missingParams.push('matchid');
    if (!analysis) missingParams.push('analysis');
    else {
        if (!analysis.stats) missingParams.push('analysis.stats');
        if (!analysis.timeline) missingParams.push('analysis.timeline');
    }
    if (missingParams.length > 0) return res.status(400).json({ error: `Missing parameters: ${missingParams.join(', ')}` });

    // condition 2: check if the player summary already exists
    try {
        const existingSummary = await playerSummaryModel.findOne({ puuid: puuid, matchid: matchid });

        if (existingSummary) {
            console.log(`Player summary already exists for PUUID: ${puuid} and MatchID: ${matchid}`);

            return res.status(409).json({ error: 'Player summary already exists' });
        }
    }
    catch (error: unknown) {
        console.error(`Error checking for existing player summary: ${error}`);

        return res.status(500).json({ error: 'Internal server error' });
    }

    // once conditions all met, save the player summary to the database
    try {
        const result = await playerSummaryModel.create({ puuid, matchid, analysis });
        console.log(`Player summary saved successfully: ${result}`);

        return res.status(200).json(result);
    }
    catch (error: unknown) {
        console.error(`Error saving player summary: ${error}`);

        return res.status(500).json({ error: 'Internal server error' });
    }
};
