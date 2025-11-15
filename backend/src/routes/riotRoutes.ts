import express from 'express';
import * as riotController from '../controllers/riotControllers';

const router = express.Router();

/**
 * routes
 */

// GET a PUUID by summoner name and tag
router.get('/summoner/:summonerName/:tagLine', riotController.getPUUIDHandler);

// GET recent matches by PUUID
router.get('/matches/:puuid', riotController.getRecentMatchesHandler);

// GET player summary by PUUID and match ID
router.get('/player-summary/:puuid/:matchID', riotController.getPlayerSummaryHandler);


export default router;
