import { getPUUIDBySummonerNameAndTag, getRecentMatchesByPUUID } from '../../src/services/riotService';
import { getGroqChatCompletion } from '../../src/services/groqAnalysisService';
import {
    getPUUIDController,
    getRecentMatchesController,
    getPlayerSummaryController,
} from '../../src/controllers/riotControllers';
import { playerSummaryModel } from '../../src/models/playerSummaryModel';
import { APIError } from '../../src/errors/APIError';


jest.mock('../../src/services/riotService');
jest.mock('../../src/services/playerSummaryService');
jest.mock('../../src/services/groqAnalysisService');
jest.mock('../../src/models/playerSummaryModel');

const mocks = {
    puuid: 'mockID',
    name: 'mockName',
    tag: 'mockTag',
    matchid: 'mockMatchID',
    analysis: 'mockAnalysis',
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

        it('should include a correct error status and message in response when an error occurs', async () => {
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

        it('should handle undefined errors with 500 status code', async () => {
            (getPUUIDBySummonerNameAndTag as jest.Mock).mockRejectedValueOnce(undefined);

            await getPUUIDController(mockReq as any, mockRes as any);

            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledTimes(1);
            expect(getPUUIDBySummonerNameAndTag).toHaveBeenCalledWith(mocks.name, mocks.tag);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `500: Internal Server Error` });
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

        it('should include a correct error status and message in response when an error occurs', async () => {
            (getRecentMatchesByPUUID as jest.Mock).mockRejectedValueOnce(mockError);

            await getRecentMatchesController(mockReq as any, mockRes as any);

            expect(getRecentMatchesByPUUID).toHaveBeenCalledTimes(1);
            expect(getRecentMatchesByPUUID).toHaveBeenCalledWith(mocks.puuid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });

        it('should handle undefined errors with 500 status code', async () => {
            (getRecentMatchesByPUUID as jest.Mock).mockRejectedValueOnce(undefined);

            await getRecentMatchesController(mockReq as any, mockRes as any);

            expect(getRecentMatchesByPUUID).toHaveBeenCalledTimes(1);
            expect(getRecentMatchesByPUUID).toHaveBeenCalledWith(mocks.puuid);

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `500: Internal Server Error` });
        });
    });

    describe('getPlayerSummaryController', () => {
        const mockReq = {
            params: {
                puuid: mocks.puuid,
                matchid: mocks.matchid,
            }
        };

        it('should generate a valid player analysis for a valid, nonredundant request', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockResolvedValueOnce(null); // no previous data
            (getGroqChatCompletion as jest.Mock).mockResolvedValueOnce({ choices: [{ message: { content: mocks.analysis } }] });
            (playerSummaryModel.create as jest.Mock).mockResolvedValueOnce({ puuid: mocks.puuid, matchid: mocks.matchid, analysis: mocks.analysis });

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).toHaveBeenCalledTimes(1);
            expect(getGroqChatCompletion).toHaveBeenCalledWith(process.env.GROQ_MESSAGE, mocks.puuid, mocks.matchid);
            expect(playerSummaryModel.create).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.create).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid, analysis: mocks.analysis });

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mocks.analysis);
        });

        it('should return a premade analysis for a valid, redundant request', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockResolvedValueOnce({ puuid: mocks.puuid, matchid: mocks.matchid, analysis: mocks.analysis });

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).not.toHaveBeenCalled();
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith(mocks.analysis);
        });

        it('should include correct error status and message in response when an error occurs from model.findOne', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockRejectedValueOnce(mockError);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).not.toHaveBeenCalled();
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });

        it('should handle undefined errors from model.findOne with 500 status code', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockRejectedValueOnce(undefined);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).not.toHaveBeenCalled();
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `500: Internal Server Error` });
        });

        it('should include correct error status and message in response when an error occurs from getGroqChatCompletion', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockResolvedValueOnce(null); // no previous data
            (getGroqChatCompletion as jest.Mock).mockRejectedValueOnce(mockError);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).toHaveBeenCalledTimes(1);
            expect(getGroqChatCompletion).toHaveBeenCalledWith(process.env.GROQ_MESSAGE, mocks.puuid, mocks.matchid);
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `${mockError.status}: ${mockError.statusText}` });
        });

        it('should prevent data creation with a correct error when a faulty response occurs from getGroqChatCompletion', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockResolvedValueOnce(null);
            (getGroqChatCompletion as jest.Mock).mockResolvedValueOnce({ choices: [{ message: { content: undefined } }] });

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).toHaveBeenCalledTimes(1);
            expect(getGroqChatCompletion).toHaveBeenCalledWith(process.env.GROQ_MESSAGE, mocks.puuid, mocks.matchid);
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `500: Analysis generation returned empty content` });
        });

        it('should handle undefined errors from getGroqChatCompletion with 500 status code', async () => {
            (playerSummaryModel.findOne as jest.Mock).mockResolvedValueOnce(null);
            (getGroqChatCompletion as jest.Mock).mockRejectedValueOnce(undefined);

            await getPlayerSummaryController(mockReq as any, mockRes as any);

            expect(playerSummaryModel.findOne).toHaveBeenCalledTimes(1);
            expect(playerSummaryModel.findOne).toHaveBeenCalledWith({ puuid: mocks.puuid, matchid: mocks.matchid });
            expect(getGroqChatCompletion).toHaveBeenCalledTimes(1);
            expect(getGroqChatCompletion).toHaveBeenCalledWith(process.env.GROQ_MESSAGE, mocks.puuid, mocks.matchid);
            expect(playerSummaryModel.create).not.toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledWith({ error: `500: Internal Server Error` });
        });
    });
});
