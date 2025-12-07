import { getPUUIDBySummonerNameAndTag, getRecentMatchesByPUUID } from '../../src/services/riotService';
import { getPlayerSummary } from '../../src/services/playerSummaryService';
import {
    getPUUIDController,
    getRecentMatchesController,
    getPlayerSummaryController,
} from '../../src/controllers/riotControllers';

jest.mock('../../src/services/riotService');
jest.mock('../../src/services/playerSummaryService');

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

jest.mock('../../src/services/riotService');

describe('Riot Controllers', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPUUIDHandler', () => {
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
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mocks.puuid);
        });

        it('should include error status and message in response when an error occurs', async () => {

            (getPUUIDBySummonerNameAndTag as jest.Mock).mockRejectedValueOnce(Error);

            await getPUUIDController(mockReq as any, mockRes as any);

            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledTimes(1);
            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledWith(mocks.name, mocks.tag);

            // on error, status should be called once
            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRecentMatchesHandler', () => {
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

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith([mocks.matchid]);
        });

        it('should include error status and message in response when an error occurs', async () => {

            (getRecentMatchesByPUUID as jest.Mock).mockRejectedValueOnce(Error);

            await getRecentMatchesController(mockReq as any, mockRes as any);

            expect(getRecentMatchesByPUUID).toHaveBeenCalledTimes(1);
            expect(getRecentMatchesByPUUID).toHaveBeenCalledWith(mocks.puuid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPlayerSummaryHandler', () => {
        const mockReq = {
            params: {
                puuid: mocks.puuid,
                matchID: mocks.matchid,
            }
        };

        it('should include a valid player summary in response for valid request', async () => {

            (getPlayerSummary as jest.Mock).mockResolvedValueOnce({ stats: mocks.stats, timeline: mocks.timeline });

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
            expect(getPlayerSummary).toHaveBeenCalledWith(mocks.puuid, mocks.matchid);

            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ stats: mocks.stats, timeline: mocks.timeline });
        });

        it('should include error status and message in response when an error occurs', async () => {

            (getPlayerSummary as jest.Mock).mockRejectedValueOnce(Error);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
            expect(getPlayerSummary).toHaveBeenCalledWith(mocks.puuid, mocks.matchid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
        });
    });
});
