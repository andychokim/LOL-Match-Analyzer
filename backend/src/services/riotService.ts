/**
 * Riot API Client for League of Legends
 * This module provides functions to interact with the Riot Games API to fetch player PUUIDs, recent matches, and match details.
 * It uses the fetch API to make HTTP requests and requires an API key and region configuration.
 * Author: Andrew C. Kim
 * Date: 2025-08-15
 * Version: 1.0.0
 */

import { HEADERS, REGION } from '../config';
import { APIError } from '../errors/APIError';

/**
 * Custom error class for Riot API errors.
 */
// export class RiotAPIError extends Error {
//     statusCode: number;
//     message: string;

//     constructor(statusCode: number, message: string) {
//         super(message);
//         this.name = 'RiotAPIError';
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

/**
 * helper function for sending requests
 * @param url 
 * @returns a JSON response
 */
async function sendRequest(url: string): Promise<any> {
    try {
        const response = await fetch(url, { headers: HEADERS as any });

        // throw the error so the catch block will handle it
        if (!response.ok) throw new APIError(response.status, response.statusText);
        
        console.log(`Riot API Response - Status: ${response.status}, Message: ${response.statusText}`);
        return await response.json();
    } catch (error: unknown) {
        const apiError = error as APIError;
        const statusCode = apiError.status || 500;
        const message = apiError.statusText || 'Internal Server Error';

        console.error(`Riot API Error - Status: ${statusCode}, Message: ${message}`);
        throw new APIError(statusCode, message);
    }
}

/**
 * Fetches the PUUID (Player Unique ID) for a given game name and tag line.
 *
 * @param gameName - The player's in-game name (ex: GNR nomsy).
 * @param tagLine - The player's tag line (ex: stuck).
 * @returns The PUUID of the player.
 */
export async function getPUUIDBySummonerNameAndTag(gameName: string, tagLine: string): Promise<string> {
    const url = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    console.log(`Fetching PUUID for ${gameName}#${tagLine} from ${url}`);

    return await sendRequest(url);
}

/**
 * Fetches recent match IDs for a given PUUID.
 *
 * @param puuid - The PUUID of the player.
 * @param count - The number of recent matches to fetch (default is 5).
 * @returns A list of recent match IDs.
 */
export async function getRecentMatchesByPUUID(puuid: string, count: number = 5): Promise<string[]> {
    const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
    console.log(`Fetching recent matches for PUUID ${puuid} from ${url}`);

    return await sendRequest(url);
}

/**
 * Fetches detailed information about a specific match using its match ID.
 *
 * @param match_id - The ID of the match to fetch details for.
 * @returns A dictionary containing match details.
 */
export async function getMatchDetailsByMatchID(match_id: string): Promise<Record<string, any>> {
    const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${match_id}`;
    console.log(`Fetching match details for match ID ${match_id} from ${url}`);

    return await sendRequest(url);
}

/**
 * Fetches the timeline information about a specific match using its match ID.
 *
 * @param match_id - The ID of the match to fetch timeline for.
 * @returns A dictionary containing match timeline.
 */
export async function getMatchTimelineByMatchID(match_id: string): Promise<Record<string, any>> {
    const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${match_id}/timeline`;
    console.log(`Fetching match timeline for match ID ${match_id} from ${url}`);

    return await sendRequest(url);
}
