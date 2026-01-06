import express from 'express';
import * as riotController from '../controllers/riotControllers';

const router = express.Router();

/**
 * routes
 */

// GET a PUUID by summoner name and tag
router.get('/summoner/:summonerName/:tagLine', riotController.getPUUIDController);

// GET recent matches by PUUID
router.get('/matches/:puuid', riotController.getRecentMatchesController);

// GET player summary by PUUID and match ID
router.get('/player-summary/:puuid/:matchid', riotController.getPlayerSummaryController);


export default router;
