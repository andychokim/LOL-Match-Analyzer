import { APIError } from '../../src/errors/APIError';
import { 
    // RiotAPIError,
    getMatchDetailsByMatchID,
    getMatchTimelineByMatchID,
    getPUUIDBySummonerNameAndTag,
    getRecentMatchesByPUUID,
} from '../../src/services/riotService';


const mocks = {
    puuid: 'mockID',
    name: 'mockName',
    tag: 'mockTag',
    matchId: 'mockMatchID',
    url: 'https://mockurl.com',
}

// Mock the config module to avoid exposing real API tokens in tests
jest.mock('../../src/config', () => ({
    HEADERS: {'X-Riot-Token': 'mockToken'},
    REGION: 'americas',
}));

const mockError = new APIError(404, 'Not Found');

describe('Riot Service', () => {

    // services fetches data from Riot API, so we need to mock fetch
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    // reset fetch mock before each test
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('sendRequest', () => {

        it('should return a valid json for a valid global.fetch response', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve({ data: 'mockData' }),
            });

            // const url = mocks.url;
            const response = await getPUUIDBySummonerNameAndTag('mockName', 'mockTag');

            expect(response).toEqual({ data: 'mockData' });
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('mockName/mockTag'),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw a correct APIError when fetch fails', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(new APIError(404, 'Not Found'));
            
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`${mocks.name}/${mocks.tag}`),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw a 500 APIError when an unknown error occurs', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(new APIError(500, 'Internal Server Error'));
            
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`${mocks.name}/${mocks.tag}`),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });
    });

    describe('getPUUIDBySummonerNameAndTag', () => {

        it('should return PUUID for valid summoner name and tag', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mocks.puuid),
            });

            const response = await getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag);

            expect(response).toBe(mocks.puuid);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            
            // Check that fetch was called with a URL containing the summoner name and tag
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`${mocks.name}/${mocks.tag}`),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw an error when it occurred', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(mockError);

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(mockError);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRecentMatchesByPUUID', () => {

        it('should return recent matches for valid PUUID', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(['match1', 'match2', 'match3']),
            });

            const response = await getRecentMatchesByPUUID(mocks.puuid);

            expect(response).toEqual(['match1', 'match2', 'match3']);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(mocks.puuid),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw RiotAPIError when an error occurred', async () => {

            (global.fetch as jest.Mock).mockRejectedValue(mockError);

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(mockError);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMatchDetailsByMatchID', () => {
        it('should return the match details for valid PUUID', async () => {

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    metadata: {
                        matchId: mocks.matchId,
                    },
                    info: {
                        mockInfo: 'mockInfoData',
                    },
                }),
            });

            const response = await getMatchDetailsByMatchID(mocks.matchId);

            expect(response).toEqual({
                metadata: {
                    matchId: mocks.matchId,
                },
                info: {
                    mockInfo: 'mockInfoData',
                },
            });
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(mocks.matchId),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw RiotAPIError when an error occurred', async () => {

            (global.fetch as jest.Mock).mockRejectedValue(mockError);

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(mockError);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMatchTimelineByMatchID', () => {
        it('should return the match timeline for valid PUUID', async () => {

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    metadata: {
                        matchId: mocks.matchId,
                    },
                    info: {
                        frames: [
                            { mockFrameData: 'data1' },
                        ],
                    },
                }),
            });

            const response = await getMatchTimelineByMatchID(mocks.matchId);

            expect(response).toEqual({
                metadata: {
                    matchId: mocks.matchId,
                },
                info: {
                    frames: [
                        { mockFrameData: 'data1' },
                    ],
                },
            });
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(mocks.matchId),
                expect.objectContaining({ headers: expect.any(Object) })
            );
        });

        it('should throw RiotAPIError when an error occurred', async () => {

            (global.fetch as jest.Mock).mockRejectedValue(mockError);

            await expect(getPUUIDBySummonerNameAndTag(mocks.name, mocks.tag)).rejects.toStrictEqual(mockError);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });
});
