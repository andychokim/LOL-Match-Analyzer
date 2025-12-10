import { Request, Response } from 'express';
import * as riotService from '../services/riotService';
import { getPlayerSummary } from '../services/playerSummaryService';


// playerSummary model for post operation
import { playerSummaryModel } from '../models/playerSummaryModel';

// define APIError interface for error handling
export interface APIError extends Error {
    status: number;
    statusText: string;
}

// controllers
/**
 * Get a PUUID by summoner name and tag
 * @param req params: summonerName, tagLine
 * @param res json formatted puuid for successful request, status code and error message for failed request
 */
export async function getPUUIDController(req: Request, res: Response) {
    try {
        const { summonerName, tagLine } = req.params;
        console.log(`Fetching PUUID for ${summonerName}#${tagLine}`);

        const puuid = await riotService.getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.status(200).json(puuid);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: message } );
    }
};

/**
 * Get recent matches by PUUID
 * @param req params: puuid
 * @param res json formatted array of match IDs for successful request, status code and error message for failed request
 */
export async function getRecentMatchesController(req: Request, res: Response) {
    try {
        const { puuid } = req.params;
        console.log(`Fetching recent matches for PUUID: ${puuid}`);

        const matches = await riotService.getRecentMatchesByPUUID(puuid);
        res.status(200).json(matches);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: message } );
    }
};

/**
 * Get a player summary by PUUID and match ID
 * @param req params: puuid, matchID
 * @param res json formatted player summary for successful request, status code and error message for failed request
 */
export async function getPlayerSummaryController(req: Request, res: Response) {
    try {
        const { puuid, matchID } = req.params;
        console.log(`Fetching player summary for PUUID: ${puuid} in Match ID: ${matchID}`);

        const data = await getPlayerSummary(puuid, matchID);
        res.status(200).json(data);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        res.status(statusCode).json({ error: message } );
    }
};

/**
 * Post a player summary to the database
 * @param req params: puuid, matchID
 * @param res success message for successful request, status code and error message for failed request
 */
export async function postPlayerSummaryController(req: Request, res: Response) {

    const { puuid, matchid, analysis } = req.body;

    // check for any missing parameters
    const missingParams = [];
    if (!puuid) {
        missingParams.push('puuid');
    }
    if (!matchid) {
        missingParams.push('matchid');
    }
    if (!analysis) {
        missingParams.push('analysis');
    }
    if (!analysis.stats) {
        missingParams.push('analysis.stats');
    }
    if (!analysis.timeline) {
        missingParams.push('analysis.timeline');
    }
    if (missingParams.length > 0) {
        return res.status(400).json({ error: `Missing parameters: ${missingParams.join(', ')}` });
    }

    // save the player summary to the database
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
