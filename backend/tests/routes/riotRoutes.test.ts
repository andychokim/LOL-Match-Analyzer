import express from 'express';
import request from 'supertest';
import router from '../../src/routes/riotRoutes';
import * as riotController from '../../src/controllers/riotControllers';


const mocks = {
    puuid: 'mockID',
    name: 'mockName',
    tag: 'mockTag',
    matchid: 'mockMatchID',
    stats: 'mockStats',
    timeline: 'mockTimeline',
}
const app = express();
app.use('/api/riot', router);

jest.mock('../../src/controllers/riotControllers');

describe('Riot Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /summoner/:summonerName/:tagLine', () => {
        it('should route to getPUUIDHandler ', async () => {

            (riotController.getPUUIDHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json(mocks.puuid);
            });

            const response = await request(app).get(`/api/riot/summoner/${mocks.name}/${mocks.tag}`);

            expect(response.status).toBe(200);
            expect(response.body).toBe(mocks.puuid);
            expect(response.text).toContain(mocks.puuid);
            expect(riotController.getPUUIDHandler).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getPUUIDHandler', async () => {

            (riotController.getPUUIDHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal Server Error' });
            });

            const response = await request(app).get(`/api/riot/summoner/${mocks.name}/${mocks.tag}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
            expect(riotController.getPUUIDHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /matches/:puuid', () => {
        it('should route to getRecentMatchesHandler ', async () => {

            (riotController.getRecentMatchesHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json([mocks.matchid]);
            });

            const response = await request(app).get(`/api/riot/matches/${mocks.puuid}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual([mocks.matchid]);
            expect(response.text).toContain(mocks.matchid);
            expect(riotController.getRecentMatchesHandler).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getRecentMatchesHandler', async () => {

            (riotController.getRecentMatchesHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal Server Error' });
            });

            const response = await request(app).get(`/api/riot/matches/${mocks.puuid}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
            expect(riotController.getRecentMatchesHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /player-summary/:puuid/:matchID', () => {
        it('should route to getPlayerSummaryHandler ', async () => {

            (riotController.getPlayerSummaryHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json({ 
                    player_stats: mocks.stats,
                    player_timeline: [mocks.timeline],
                });
            });


            const response = await request(app).get(`/api/riot/player-summary/${mocks.puuid}/${mocks.matchid}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual({ 
                player_stats: mocks.stats,
                player_timeline: [mocks.timeline],
            });
            expect(response.text).toContain(mocks.stats);
            expect(response.text).toContain(mocks.timeline);
            expect(riotController.getPlayerSummaryHandler).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getPlayerSummaryHandler', async () => {

            (riotController.getPlayerSummaryHandler as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal Server Error' });
            });

            const response = await request(app).get(`/api/riot/player-summary/${mocks.puuid}/${mocks.matchid}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
            expect(riotController.getPlayerSummaryHandler).toHaveBeenCalledTimes(1);
        });
    });
});
