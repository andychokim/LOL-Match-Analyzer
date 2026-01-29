import express from 'express';
import request from 'supertest';
import router from '../../src/routes/riotRoutes';
import * as riotController from '../../src/controllers/riotControllers';


const mocks = {
    puuid: 'mockID',
    name: 'mockName',
    tag: 'mockTag',
    matchId: 'mockMatchID',
    stats: 'mockStats',
    timeline: 'mockTimeline',
};
const app = express();
app.use('/api/riot', router);

jest.mock('../../src/controllers/riotControllers');

describe('Riot Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /summoner/:summonerName/:tagLine', () => {

        it('should route to getPUUIDHandler ', async () => {
            (riotController.getPUUIDController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json(mocks.puuid);
            });

            const response = await request(app).get(`/api/riot/summoner/${mocks.name}/${mocks.tag}`);

            expect(response.status).toBe(200);
            expect(response.body).toBe(mocks.puuid);
            expect(response.text).toContain(mocks.puuid);
            expect(riotController.getPUUIDController).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getPUUIDHandler', async () => {

            (riotController.getPUUIDController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const response = await request(app).get(`/api/riot/summoner/${mocks.name}/${mocks.tag}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
            expect(riotController.getPUUIDController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /matches/:puuid', () => {

        it('should route to getRecentMatchesHandler ', async () => {
            (riotController.getRecentMatchesController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json([mocks.matchId]);
            });

            const response = await request(app).get(`/api/riot/matches/${mocks.puuid}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual([mocks.matchId]);
            expect(response.text).toContain(mocks.matchId);
            expect(riotController.getRecentMatchesController).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getRecentMatchesHandler', async () => {
            (riotController.getRecentMatchesController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const response = await request(app).get(`/api/riot/matches/${mocks.puuid}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
            expect(riotController.getRecentMatchesController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /match/:matchId', () => {

        it('should route to getMatchDetailsHandler ', async () => {
            (riotController.getMatchDetailsController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json({ matchId: mocks.matchId });
            });

            const response = await request(app).get(`/api/riot/match/${mocks.matchId}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual({ matchId: mocks.matchId });
            expect(response.text).toContain(mocks.matchId);
            expect(riotController.getMatchDetailsController).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getMatchDetailsHandler', async () => {
            (riotController.getMatchDetailsController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const response = await request(app).get(`/api/riot/match/${mocks.matchId}`);
            
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
            expect(riotController.getMatchDetailsController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /player-summary/:puuid/:matchId', () => {

        it('should route to getPlayerSummaryHandler ', async () => {
            (riotController.getPlayerSummaryController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(200).json({ 
                    stats: mocks.stats,
                    timeline: [mocks.timeline],
                });
            });


            const response = await request(app).get(`/api/riot/player-summary/${mocks.puuid}/${mocks.matchId}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual({ 
                stats: mocks.stats,
                timeline: [mocks.timeline],
            });
            expect(response.text).toContain(mocks.stats);
            expect(response.text).toContain(mocks.timeline);
            expect(riotController.getPlayerSummaryController).toHaveBeenCalledTimes(1);
        });

        it('should handle errors in getPlayerSummaryHandler', async () => {
            (riotController.getPlayerSummaryController as jest.Mock).mockImplementationOnce(async (_req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const response = await request(app).get(`/api/riot/player-summary/${mocks.puuid}/${mocks.matchId}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
            expect(riotController.getPlayerSummaryController).toHaveBeenCalledTimes(1);
        });
    });
});
