import * as dotenv from 'dotenv';

dotenv.config();

export const RIOT_API_KEY = process.env.RIOT_API_KEY;
export const REGION = process.env.REGION;
export const PLATFORM_REGION = process.env.PLATFORM_REGION;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const HEADERS = {
    'X-Riot-Token': RIOT_API_KEY,
};
