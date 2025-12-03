/**
 * Riot API Client for League of Legends
 * This module provides functions to interact with the Riot Games API to fetch player PUUIDs, recent matches, and match details.
 * It uses the fetch API to make HTTP requests and requires an API key and region configuration.
 * Author: Andrew C. Kim
 * Date: 2025-08-15
 * Version: 1.1
 */

import { HEADERS, REGION } from '../config';

/**
 * Custom error class for Riot API errors.
 */
class RiotAPIError extends Error {
    status_code?: number;
    response_text?: string;

    constructor(message: string, status_code?: number, response_text?: string) {
        super(message);
        this.name = 'RiotAPIError';
        this.status_code = status_code;
        this.response_text = response_text;
    }
}

/**
 * helper function for sending requests
 * @param url 
 * @returns a JSON response
 */
async function send_request(url: string): Promise<any> {
    try {
        const response = await fetch(url, { headers: HEADERS as any });

        if (!response.ok) {
            const responseText = await response.text();
            throw new RiotAPIError(
                `API request failed: ${response.status} - ${responseText}`,
                response.status,
                responseText,
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof RiotAPIError) {
            console.error(`API request with HTTP status code ${error.status_code}`);
            throw error;
        }

        console.error(`Network error occurred while accessing ${url}: ${error}`);
        throw new RiotAPIError(`Network error occurred: ${String(error)}`);
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

    const response = await send_request(url);
    return response.puuid;
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

    return await send_request(url);
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

    return await send_request(url);
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

    return await send_request(url);
}

export { RiotAPIError };