import { getPlayerSummary } from '../../src/services/playerSummaryService';
import * as riotService from '../../src/services/riotService';

// Mock the riotService module
jest.mock('../../src/services/riotService');

const mocks = {
    puuid: 'mockPUUID',
    matchId: 'mockMatchID',
};

const mockMatchDetails = {
    info: {
        participants: [
            {
                puuid: mocks.puuid,
                championName: 'Ahri',
                teamPosition: 'MID',
                champLevel: 18,
                deaths: 2,
                turretKills: 4,
                dragonKills: 2,
                teamId: 100,
                win: true,
                challenges: {
                    teamDamagePercentage: 0.30124,
                    visionScoreAdvantageLaneOpponent: 0.55666,
                    killParticipation: 0.75,
                    turretTakedowns: 3,
                    dragonTakedowns: 2,
                    baronTakedowns: 1,
                    teamBaronKills: 2,
                    riftHeraldTakedowns: 1,
                    teamRiftHeraldKills: 2,
                    otherChallenge: 999, // Should be filtered out
                },
            },
            {
                puuid: 'otherPUUID',
                championName: 'Lux',
                teamPosition: 'SUPPORT',
                deaths: 4,
                turretKills: 1,
                dragonKills: 1,
                teamId: 100,
                win: true,
                challenges: {},
            },
            {
                puuid: 'enemyPUUID',
                championName: 'Zed',
                teamPosition: 'MID',
                deaths: 8,
                turretKills: 2,
                dragonKills: 0,
                teamId: 200,
                win: false,
                challenges: {},
            },
        ],
    },
};

const mockMatchTimeline = {
    info: {
        participants: [
            {
                puuid: mocks.puuid,
                participantId: 1,
            },
            {
                puuid: 'otherPUUID',
                participantId: 2,
            },
        ],
        frames: [
            {
                events: [
                    {
                        type: 'CHAMPION_KILL',
                        timestamp: 30000,
                        killerId: 1,
                        victimId: 2,
                        assistingParticipantIds: [],
                    },
                    {
                        type: 'ELITE_MONSTER_KILL',
                        timestamp: 45000,
                        killerId: 1,
                    },
                    {
                        type: 'BUILDING_KILL',
                        timestamp: 50000,
                        killerId: 1,
                    },
                    {
                        type: 'TURRET_PLATE_DESTROYED',
                        timestamp: 55000,
                        participantId: 1,
                    },
                ],
            },
            {
                events: [
                    {
                        type: 'CHAMPION_KILL',
                        timestamp: 1200000,
                        killerId: 2,
                        victimId: 1,
                        assistingParticipantIds: [],
                    },
                    {
                        type: 'ELITE_MONSTER_KILL',
                        timestamp: 1210000,
                        killerId: 1,
                    },
                ],
            },
            {
                events: [
                    {
                        type: 'CHAMPION_KILL',
                        timestamp: 2500000,
                        killerId: 1,
                        victimId: 2,
                        assistingParticipantIds: [],
                    },
                    {
                        type: 'BUILDING_KILL',
                        timestamp: 2510000,
                        killerId: 1,
                    },
                ],
            },
        ],
    },
};

describe('Player Summary Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPlayerSummary', () => {
        it('should return player details and phase-based timeline aggregates', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result).not.toBeNull();
            expect(result?.playerDetails).toEqual(
                expect.objectContaining({
                    champion: 'Ahri',
                    role: 'MID',
                    champLevel: 18,
                    killParticipation: 0.75,
                    deathParticipation: 0.333,
                    turretKillParticipation: 0.6,
                    epicMonsterKillParticipation: 0.667,
                    win: true,
                })
            );

            expect(result?.playerDetails?.challenge).toEqual(
                expect.objectContaining({
                    teamDamagePercentage: 0.301,
                    visionScoreAdvantageLaneOpponent: 0.557,
                })
            );
            expect(result?.playerDetails?.challenge).not.toHaveProperty('otherChallenge');
            expect(result?.playerDetails?.challenge).not.toHaveProperty('killParticipation');
            expect(result?.playerDetails?.challenge).not.toHaveProperty('turretTakedowns');

            expect(result?.playerTimeline).toEqual(
                expect.objectContaining({
                    earlyGameStats: {
                        championTakedowns: 1,
                        deaths: 0,
                        epicMonsterTakedowns: 1,
                        turretTakedowns: 1,
                        platesTaken: 1,
                    },
                    midGameStats: {
                        championTakedowns: 0,
                        deaths: 1,
                        epicMonsterTakedowns: 1,
                        turretTakedowns: 0,
                        platesTaken: 0,
                    },
                    lateGameStats: {
                        championTakedowns: 1,
                        deaths: 0,
                        epicMonsterTakedowns: 0,
                        turretTakedowns: 1,
                        platesTaken: 0,
                    },
                })
            );
        });

        it('should calculate and expose expected participation metrics', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result?.playerDetails?.champion).toBe('Ahri');
            expect(result?.playerDetails?.killParticipation).toBe(0.75);
            expect(result?.playerDetails?.deathParticipation).toBe(0.333);
            expect(result?.playerDetails?.turretKillParticipation).toBe(0.6);
            expect(result?.playerDetails?.epicMonsterKillParticipation).toBe(0.667);
        });

        it('should return null if player is not found in match details', async () => {
            const matchDetailsWithoutPlayer = {
                info: {
                    participants: [
                        {
                            puuid: 'differentPUUID',
                            championName: 'Lux',
                            teamPosition: 'SUPPORT',
                        },
                    ],
                },
            };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(
                matchDetailsWithoutPlayer
            );
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result).toBeNull();
        });

        it('should return null if match details are null', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(null);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result).toBeNull();
        });

        it('should return default-zero timeline buckets when no relevant events are found', async () => {
            const emptyTimelineData = {
                info: {
                    participants: [
                        {
                            puuid: mocks.puuid,
                            participantId: 1,
                        },
                    ],
                    frames: [
                        {
                            events: [
                                {
                                    type: 'ITEM_PURCHASED',
                                    killerId: 1,
                                },
                            ],
                        },
                    ],
                },
            };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(emptyTimelineData);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result?.playerTimeline).toEqual({
                earlyGameStats: {
                    championTakedowns: 0,
                    deaths: 0,
                    epicMonsterTakedowns: 0,
                    turretTakedowns: 0,
                    platesTaken: 0,
                },
                midGameStats: {
                    championTakedowns: 0,
                    deaths: 0,
                    epicMonsterTakedowns: 0,
                    turretTakedowns: 0,
                    platesTaken: 0,
                },
                lateGameStats: {
                    championTakedowns: 0,
                    deaths: 0,
                    epicMonsterTakedowns: 0,
                    turretTakedowns: 0,
                    platesTaken: 0,
                },
            });
        });

        it('should return null if timeline info is missing', async () => {
            const timelineWithoutInfo = { info: null };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(timelineWithoutInfo);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result).toBeNull();
        });

        it('should handle player not found in timeline', async () => {
            const timelineWithoutPlayer = {
                info: {
                    participants: [
                        {
                            puuid: 'differentPUUID',
                            participantId: 1,
                        },
                    ],
                    frames: [
                        {
                            events: [],
                        },
                    ],
                },
            };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(timelineWithoutPlayer);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(result).toBeNull();
        });

        it('should call getMatchDetailsByMatchID and getMatchTimelineByMatchID', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            await getPlayerSummary(mocks.puuid, mocks.matchId);

            expect(riotService.getMatchDetailsByMatchID).toHaveBeenCalledWith(mocks.matchId);
            expect(riotService.getMatchTimelineByMatchID).toHaveBeenCalledWith(mocks.matchId);
            expect(riotService.getMatchDetailsByMatchID).toHaveBeenCalledTimes(1);
            expect(riotService.getMatchTimelineByMatchID).toHaveBeenCalledTimes(1);
        });
    });
});
