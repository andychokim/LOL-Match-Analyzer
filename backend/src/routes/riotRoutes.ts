import express from 'express';
import { 
    getPUUIDBySummonerNameAndTag, 
    getRecentMatchesByPUUID, 
    getMatchDetailsByMatchID, 
    getMatchTimelineByMatchID 
} from '../services/riotService';


const router = express.Router();

/**
 * routes
 */

// Get PUUID by summoner name and tag
router.get('/summoner/:summonerName/:tagLine', async (req: any, res: any) => {
    const { summonerName, tagLine } = req.params;

    try {
        console.log(`Fetching PUUID for ${summonerName}#${tagLine}`);
        const data = await getPUUIDBySummonerNameAndTag(summonerName, tagLine);
        res.json(data);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch PUUID' });
    }
});

// Get recent matches by PUUID
router.get('/matches/:puuid', async (req: any, res: any) => {
    const { puuid } = req.params;

    try {
        console.log(`Fetching recent matches for PUUID: ${puuid}`);
        const data = await getRecentMatchesByPUUID(puuid);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch recent matches' });
    }
});

// Get match details by match ID
router.get('/match/:matchID', async (req: any, res: any) => {
    const { matchID } = req.params;
    
    try {
        console.log(`Fetching match details for Match ID: ${matchID}`);
        const data = await getMatchDetailsByMatchID(matchID);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch match details' });
    }
});

// Get match timeline by match ID
router.get('/match/:matchID/timeline', async (req: any, res: any) => {
    const { matchID } = req.params;

    try {
        console.log(`Fetching match timeline for Match ID: ${matchID}`);
        const data = await getMatchTimelineByMatchID(matchID);
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch match timeline' });
    }
});

export default router;
