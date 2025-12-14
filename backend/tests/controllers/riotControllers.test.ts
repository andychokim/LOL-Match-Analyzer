import { getPUUIDBySummonerNameAndTag, getRecentMatchesByPUUID } from '../../src/services/riotService';
import { getPlayerSummary } from '../../src/services/playerSummaryService';
import {
    getPUUIDController,
    getRecentMatchesController,
    getPlayerSummaryController,
    postPlayerSummaryController,
} from '../../src/controllers/riotControllers';
import { playerSummaryModel } from '../../src/models/playerSummaryModel';
import { APIError } from '../../src/errors/APIError';


jest.mock('../../src/services/riotService');
jest.mock('../../src/services/playerSummaryService');
jest.mock('../../src/models/playerSummaryModel');

const mocks = {
    puuid: 'mockID',
    name: 'mockName',
    tag: 'mockTag',
    matchid: 'mockMatchID',
    stats: 'mockStats',
    timeline: 'mockTimeline',
};

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
};

const mockError = new APIError(404, 'Summoner not found');

describe('Riot Controllers', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPUUIDController', () => {
        const mockReq = {
            params: {
                summonerName: mocks.name,
                tagLine: mocks.tag,
            }
        };

        it('should include a valid PUUID in response for valid request', async () => {
            (getPUUIDBySummonerNameAndTag as jest.Mock).mockResolvedValueOnce(mocks.puuid);

            await getPUUIDController(mockReq as any, mockRes as any);

            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledTimes(1);
            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledWith(mocks.name, mocks.tag);

            // on successful response, status should not be called (defaults to 200)
            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mocks.puuid);
        });

        it('should include error status and message in response when an error occurs', async () => {
            (getPUUIDBySummonerNameAndTag as jest.Mock).mockRejectedValueOnce(mockError);

            await getPUUIDController(mockReq as any, mockRes as any);

            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledTimes(1);
            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledWith(mocks.name, mocks.tag);

            // on error, status should be called once
            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });
    });

    describe('getRecentMatchesController', () => {
        const mockReq = {
            params: {
                puuid: mocks.puuid,
            }
        };

        it('should include a valid matchids in response for valid request', async () => {
            (getRecentMatchesByPUUID as jest.Mock).mockResolvedValueOnce([mocks.matchid]);

            await getRecentMatchesController(mockReq as any, mockRes as any);

            
            expect(getRecentMatchesByPUUID).toHaveBeenCalledTimes(1);
            expect(getRecentMatchesByPUUID).toHaveBeenCalledWith(mocks.puuid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith([mocks.matchid]);
        });

        it('should include error status and message in response when an error occurs', async () => {
            (getRecentMatchesByPUUID as jest.Mock).mockRejectedValueOnce(mockError);

            await getRecentMatchesController(mockReq as any, mockRes as any);

            expect(getRecentMatchesByPUUID).toHaveBeenCalledTimes(1);
            expect(getRecentMatchesByPUUID).toHaveBeenCalledWith(mocks.puuid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });
    });

    describe('getPlayerSummaryController', () => {
        const mockReq = {
            params: {
                puuid: mocks.puuid,
                matchid: mocks.matchid,
            }
        };

        it('should include a valid player summary in response for valid request', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce({ stats: mocks.stats, timeline: mocks.timeline });

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
            expect(getPlayerSummary).toHaveBeenCalledWith(mocks.puuid, mocks.matchid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ stats: mocks.stats, timeline: mocks.timeline });
        });

        it('should include error status and message in response when an error occurs', async () => {
            (getPlayerSummary as jest.Mock).mockRejectedValueOnce(mockError);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
            expect(getPlayerSummary).toHaveBeenCalledWith(mocks.puuid, mocks.matchid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });
    });

    describe('postPlayerSummaryController', () => {
        const mockReq = { body: {} };

        it('should include a valid response for a valid request', async () => {
            mockReq.body = { 
                puuid: mocks.puuid,
                matchid: mocks.matchid,
                analysis: {
                    stats: mocks.stats, 
                    timeline: mocks.timeline 
                }
            };

            (playerSummaryModel.create as jest.Mock).mockResolvedValue(mockReq.body);

            await postPlayerSummaryController(mockReq as any, mockRes as any);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mockReq.body);
        });

        it('should include correct missing parameters in the error message', async () => {
            mockReq.body = {
                puuid: mocks.puuid,
                // missing fields
            };

            (playerSummaryModel.create as jest.Mock).mockResolvedValue(mockReq.body);

            await postPlayerSummaryController(mockReq as any, mockRes as any);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing parameters: matchid, analysis' });
        });

        it('should not post and notify the user with a correct error message if duplicate entry exists', async () => {
            // work on this later
        });

        it('should result in a 500 error when an unexpected error occurs', async () => {
            mockReq.body = { 
                puuid: mocks.puuid,
                matchid: mocks.matchid,
                analysis: {
                    stats: mocks.stats, 
                    timeline: mocks.timeline 
                }
            };

            (playerSummaryModel.create as jest.Mock).mockRejectedValueOnce(mockError);

            await postPlayerSummaryController(mockReq as any, mockRes as any);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});
