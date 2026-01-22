import { Request, Response } from 'express';
import { getPUUIDBySummonerNameAndTag, getRecentMatchesByPUUID } from '../services/riotService';
import { getGroqChatCompletion } from '../services/groqAnalysisService';
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
        const data = await getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.status(200).json(data);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError?.status || 500;
        const message = apiError?.statusText || 'Internal Server Error';

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
        const matches = await getRecentMatchesByPUUID(puuid);
        return res.status(200).json(matches);
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError?.status || 500;
        const message = apiError?.statusText || 'Internal Server Error';

        return res.status(statusCode).json({ error: `${statusCode}: ${message}` });
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

    // // condition 1: check for any missing parameters
    // const missingParams = [];
    // if (!puuid) missingParams.push('puuid');
    // if (!matchid) missingParams.push('matchid');
    // if (missingParams.length > 0) return res.status(400).json({ error: `Missing parameters: ${missingParams.join(', ')}` });

    try {
        // condition 1: if data found in database, return it
        console.log(`Fetching player analysis for PUUID: ${puuid} and MatchID: ${matchid}`);
        const data = await playerSummaryModel.findOne({ puuid:puuid, matchid:matchid });
        
        if (data) {
            console.log('Previous data found - returning saved data');
            return res.status(200).json(data.analysis);
        }

        // if no data found in database, fetch from Riot API and save to database
        console.log('No previous data found - generating new analysis');
        try {
            const analysisData = await getGroqChatCompletion(process.env.GROQ_MESSAGE, puuid, matchid);
            const analysis = analysisData.choices[0]?.message?.content || '';
            if (analysis !== '') {
                const result = await playerSummaryModel.create({ puuid, matchid, analysis });

                console.log('Player analysis generated and saved successfully');
                return res.status(200).json(result.analysis);
            }
            else {
                console.log('Analysis generation returned empty content');

                return res.status(500).json({ error: '500: Analysis generation returned empty content' } );
            }
        }
        catch (error: unknown) {
            const apiError = error as APIError;
            const statusCode = apiError?.status || 500;
            const message = apiError?.statusText || 'Internal Server Error';
            
            return res.status(statusCode).json({ error: `${statusCode}: ${message}` } );
        }
    }
    catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError?.status || 500;
        const message = apiError?.statusText || 'Internal Server Error';

        return res.status(statusCode).json({ error: `${statusCode}: ${message}` } );
    }
};
