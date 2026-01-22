import { getPlayerSummary } from '../../src/services/playerSummaryService';
import * as riotService from '../../src/services/riotService';

// Mock the riotService module
jest.mock('../../src/services/riotService');

const mocks = {
    puuid: 'mockPUUID',
    matchid: 'mockMatchID',
};

const mockMatchDetails = {
    info: {
        participants: [
            {
                puuid: mocks.puuid,
                championName: 'Ahri',
                teamPosition: 'MID',
                champLevel: 18,
                kills: 5,
                deaths: 2,
                assists: 10,
                goldEarned: 15000,
                totalDamageDealtToChampions: 45000,
                visionScore: 35,
                wardsPlaced: 20,
                detectorWardsPlaced: 5,
                totalMinionsKilled: 280,
                neutralMinionsKilled: 20,
                win: true,
                challenges: {
                    teamDamagePercentage: 0.30,
                    killParticipation: 0.75,
                    goldPerMinute: 450,
                    soloKills: 2,
                    maxCsAdvantageOnLaneOpponent: 50,
                    maxLevelLeadLaneOpponent: 2,
                    wardTakedowns: 8,
                    visionScoreAdvantageLaneOpponent: 15,
                    otherChallenge: 999, // Should be filtered out
                },
            },
            {
                puuid: 'otherPUUID',
                championName: 'Lux',
                teamPosition: 'SUPPORT',
                kills: 2,
                deaths: 4,
                assists: 15,
            },
        ],
    },
};

const mockMatchTimeline = {
    info: {
        participants: [
            {
                puuid: mocks.puuid,
                participantId: 0,
            },
            {
                puuid: 'otherPUUID',
                participantId: 1,
            },
        ],
        frames: [
            {
                timestamp: 60000, // 1 minute
                events: [
                    {
                        type: 'CHAMPION_KILL',
                        timestamp: 30000,
                        killerId: 0,
                        victimId: 1,
                        assistingParticipantIds: [],
                        killStreakLength: 1,
                        victimDamageDealt: 100,
                        victimDamageReceived: 200,
                    },
                    {
                        type: 'ELITE_MONSTER_KILL',
                        timestamp: 45000,
                        killerId: 0,
                        position: { x: 100, y: 200 },
                        monsterSubType: 'DRAGON',
                    },
                ],
                participantFrames: {
                    '0': {
                        championStats: {
                            health: 500,
                            bonusArmorPenPercent: 0.1,
                            bonusMagicPenPercent: 0.2,
                            healthMax: 600,
                            healthRegen: 2,
                            lifesteal: 0,
                            omnivamp: 0,
                            physicalVamp: 0,
                            spellVamp: 0,
                        },
                        currentGold: 1500,
                        damageStats: { mockDamageStats: 'data' },
                        goldPerSecond: 25,
                        minionsKilled: 20,
                        jungleMinionsKilled: 2,
                        totalGold: 3000,
                        xp: 5000,
                        timeEnemySpentControlled: 0,
                    },
                },
            },
            {
                timestamp: 120000, // 2 minutes
                events: [
                    {
                        type: 'CHAMPION_KILL',
                        timestamp: 90000,
                        killerId: 1,
                        victimId: 0,
                        assistingParticipantIds: [],
                        killStreakLength: 1,
                        victimDamageDealt: 150,
                        victimDamageReceived: 300,
                    },
                ],
                participantFrames: {
                    '0': {
                        championStats: {
                            health: 300,
                            bonusArmorPenPercent: 0.1,
                            bonusMagicPenPercent: 0.2,
                            healthMax: 600,
                            healthRegen: 2,
                            lifesteal: 0,
                            omnivamp: 0,
                            physicalVamp: 0,
                            spellVamp: 0,
                        },
                        currentGold: 2000,
                        damageStats: { mockDamageStats: 'data' },
                        goldPerSecond: 30,
                        minionsKilled: 40,
                        jungleMinionsKilled: 3,
                        totalGold: 4000,
                        xp: 6000,
                        timeEnemySpentControlled: 5,
                    },
                },
            },
        ],
    },
};

describe('Player Summary Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPlayerSummary', () => {
        it('should return complete player summary with stats and timeline', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result).not.toBeNull();
            expect(result?.player_stats).toBeDefined();
            expect(result?.player_timeline).toBeDefined();

            // Verify player_stats
            expect(result?.player_stats?.champion).toBe('Ahri');
            expect(result?.player_stats?.role).toBe('MID');
            expect(result?.player_stats?.kills).toBe(5);
            expect(result?.player_stats?.deaths).toBe(2);
            expect(result?.player_stats?.assists).toBe(10);
            expect(result?.player_stats?.win).toBe(true);

            // Verify cs calculation (totalMinionsKilled + neutralMinionsKilled)
            expect(result?.player_stats?.cs).toBe(300);

            // Verify challenges are filtered correctly
            expect(result?.player_stats?.challenge).toHaveProperty('teamDamagePercentage');
            expect(result?.player_stats?.challenge).toHaveProperty('killParticipation');
            expect(result?.player_stats?.challenge).not.toHaveProperty('otherChallenge');
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

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result).toBeNull();
        });

        it('should return null if match details are null', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(null);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result).toBeNull();
        });

        it('should handle empty timeline when no relevant events found', async () => {
            const emptyTimelineData = {
                info: {
                    participants: [
                        {
                            puuid: mocks.puuid,
                            participantId: 0,
                        },
                    ],
                    frames: [
                        {
                            timestamp: 60000,
                            events: [
                                {
                                    type: 'ITEM_PURCHASED',
                                    killerId: 0,
                                },
                            ],
                            participantFrames: {
                                '0': {
                                    championStats: {
                                        health: 500,
                                    },
                                    currentGold: 1500,
                                },
                            },
                        },
                    ],
                },
            };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(emptyTimelineData);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_timeline).toEqual([]);
        });

        it('should return null if timeline info is missing', async () => {
            const timelineWithoutInfo = { info: null };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(timelineWithoutInfo);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_timeline).toBeNull();
        });

        it('should extract CHAMPION_KILL events where player is killer', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_timeline?.length).toBeGreaterThan(0);
            const firstFrame = result?.player_timeline?.[0];
            expect(firstFrame?.events).toContainEqual(
                expect.objectContaining({
                    type: 'CHAMPION_KILL',
                    killerId: 0,
                })
            );
            // Verify timestamps are removed
            expect(firstFrame?.events?.[0]).not.toHaveProperty('timestamp');
            // Verify unnecessary properties are removed
            expect(firstFrame?.events?.[0]).not.toHaveProperty('killStreakLength');
            expect(firstFrame?.events?.[0]).not.toHaveProperty('victimDamageDealt');
        });

        it('should extract CHAMPION_KILL events where player is victim', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            const secondFrame = result?.player_timeline?.[1];
            expect(secondFrame?.events).toContainEqual(
                expect.objectContaining({
                    type: 'CHAMPION_KILL',
                    victimId: 0,
                })
            );
        });

        it('should extract ELITE_MONSTER_KILL events', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            const firstFrame = result?.player_timeline?.[0];
            expect(firstFrame?.events).toContainEqual(
                expect.objectContaining({
                    type: 'ELITE_MONSTER_KILL',
                })
            );
            // Verify unnecessary properties are removed
            expect(firstFrame?.events?.[1]).not.toHaveProperty('position');
            expect(firstFrame?.events?.[1]).not.toHaveProperty('monsterSubType');
        });

        it('should convert frame timestamps from ms to minutes', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_timeline?.[0]?.timestamp).toBe(1); // 60000 ms / 60000 = 1 minute
            expect(result?.player_timeline?.[1]?.timestamp).toBe(2); // 120000 ms / 60000 = 2 minutes
        });

        it('should remove unnecessary participant frame data to reduce size', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            const frameData = result?.player_timeline?.[0]?.participantFrames;
            expect(frameData).not.toHaveProperty('damageStats');
            expect(frameData).not.toHaveProperty('goldPerSecond');
            expect(frameData).not.toHaveProperty('minionsKilled');
            expect(frameData).not.toHaveProperty('jungleMinionsKilled');
            expect(frameData).not.toHaveProperty('totalGold');
            expect(frameData).not.toHaveProperty('xp');
            expect(frameData).not.toHaveProperty('timeEnemySpentControlled');
            expect(frameData?.championStats).not.toHaveProperty('bonusArmorPenPercent');
            expect(frameData?.championStats).not.toHaveProperty('bonusMagicPenPercent');
            expect(frameData?.championStats).not.toHaveProperty('healthMax');
        });

        it('should handle player not found in timeline', async () => {
            const timelineWithoutPlayer = {
                info: {
                    participants: [
                        {
                            puuid: 'differentPUUID',
                            participantId: 0,
                        },
                    ],
                    frames: [
                        {
                            timestamp: 60000,
                            events: [],
                            participantFrames: {},
                        },
                    ],
                },
            };

            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(timelineWithoutPlayer);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_timeline).toEqual([]);
        });

        it('should call getMatchDetailsByMatchID and getMatchTimelineByMatchID', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(riotService.getMatchDetailsByMatchID).toHaveBeenCalledWith(mocks.matchid);
            expect(riotService.getMatchTimelineByMatchID).toHaveBeenCalledWith(mocks.matchid);
            expect(riotService.getMatchDetailsByMatchID).toHaveBeenCalledTimes(1);
            expect(riotService.getMatchTimelineByMatchID).toHaveBeenCalledTimes(1);
        });

        it('should extract all required player stats fields', async () => {
            (riotService.getMatchDetailsByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchDetails);
            (riotService.getMatchTimelineByMatchID as jest.Mock).mockResolvedValueOnce(mockMatchTimeline);

            const result = await getPlayerSummary(mocks.puuid, mocks.matchid);

            expect(result?.player_stats).toEqual(
                expect.objectContaining({
                    champion: 'Ahri',
                    role: 'MID',
                    champLevel: 18,
                    kills: 5,
                    deaths: 2,
                    assists: 10,
                    totalGold: 15000,
                    totalDamage: 45000,
                    visionScore: 35,
                    wardsPlaced: 20,
                    detectorWardsPlaced: 5,
                    cs: 300,
                    win: true,
                    challenge: expect.any(Object),
                })
            );
        });
    });
});
