import Groq from 'groq-sdk';
import { getPlayerSummary } from './playerSummaryService';

export async function getGroqChatCompletion(message: string | undefined, puuid: string, matchId: string) {
    
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const playerSummary = await getPlayerSummary(puuid, matchId);

        return groq.chat.completions.create({
            model: 'llama-3.1-8b-instant', 
            messages: [
                {
                    role: 'user',
                    content: `${message} \n Player Summary: ${JSON.stringify(playerSummary)}`,
                },
            ],
        });
    }
    catch (error) {
        console.error('Error generating Groq chat completion:', error);
        throw error;
    }
}
