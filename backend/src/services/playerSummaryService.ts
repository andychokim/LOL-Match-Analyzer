import { getMatchDetailsByMatchID, getMatchTimelineByMatchID } from './riotService';

interface PlayerDetails {
    champion: string;
    role: string;
    champLevel: number;
    kills: number;
    deaths: number;
    assists: number;
    totalGold: number;
    totalDamage: number;
    visionScore: number;
    wardsPlaced: number;
    detectorWardsPlaced: number;
    cs: number;
    runes: any;
    challenge: Record<string, any>;
    win: boolean;
}

interface FrameData {
    timestamp: number;
    events: any[];
    participantFrames: any;
}

interface PlayerTimeline {
    frameData: FrameData[];
}

interface PlayerSummary {
    player_stats: PlayerDetails;
    player_timeline: FrameData[];
}

const CHALLENGES_KEEP_KEYS = new Set([
    // Core performance
    'kda',
    'damagePerMinute',
    'teamDamagePercentage',
    'killParticipation',
    'goldPerMinute',
    'visionScorePerMinute',

    // Objective & Macro
    'baronTakedowns',
    'dragonTakedowns',
    'riftHeraldTakedowns',
    'turretTakedowns',
    'voidMonsterKill',

    // Fighting / Skirmishing
    'soloKills',
    'killsNearEnemyTurret',
    'killsUnderOwnTurret',
    'outnumberedKills',
    'immobilizeAndKillWithAlly',
    'enemyChampionImmobilizations',

    // Laning Phase
    'laneMinionsFirst10Minutes',
    'maxCsAdvantageOnLaneOpponent',
    'maxLevelLeadLaneOpponent',

    // Survivability
    'damageTakenOnTeamPercentage',
    'survivedSingleDigitHpCount',
    'survivedThreeImmobilizesInFight',

    // Vision & Utility
    'controlWardsPlaced',
    'stealthWardsPlaced',
    'wardTakedowns',
    'visionScoreAdvantageLaneOpponent',
]);

/**
 * Extracts player-specific stats details from match details.
 * @returns player details or null if not found.
 */
async function getPlayerDetails(puuid: string, match_id: string): Promise<PlayerDetails | null> {
    const match_details = await getMatchDetailsByMatchID(match_id);

    if (match_details && match_details.info) {
        const players = match_details.info.participants;

        for (const player of players) {

            if (player.puuid === puuid) {

                // Filter out unnecessary information to reduce size
                const filtered_challenges: Record<string, any> = {};
                for (const [key, value] of Object.entries(player.challenges || {})) {
                    if (CHALLENGES_KEEP_KEYS.has(key)) {
                        filtered_challenges[key] = value;
                    }
                }

                // Extract relevant stats
                const player_details: PlayerDetails = {
                    champion: player.championName,
                    role: player.teamPosition,
                    champLevel: player.champLevel,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    totalGold: player.goldEarned,
                    totalDamage: player.totalDamageDealtToChampions,
                    visionScore: player.visionScore,
                    wardsPlaced: player.wardsPlaced,
                    detectorWardsPlaced: player.detectorWardsPlaced,
                    cs: player.totalMinionsKilled + player.neutralMinionsKilled,
                    runes: player.perks,
                    challenge: filtered_challenges,
                    win: player.win,
                };

                return player_details;
            }
        }
    }

    return null;
};

/**
 * Extracts player-specific data from match timeline.
 * @returns a list of frames containing events and in-game stats for the player.
 */
async function getPlayerTimeline(puuid: string, match_id: string): Promise<FrameData[]> {
    const match_events = await getMatchTimelineByMatchID(match_id);
    const frameData: FrameData[] = [];

    if (match_events && match_events.info) {

        // Find the participantId for this puuid
        let playerId: number | null = null;

        for (const player of match_events.info.participants) {

            if (player.puuid === puuid) {
                playerId = player.participantId;
                break;
            }
        }

        if (playerId === null) return frameData;


        // Iterate through each frame in the timeline
        for (const frame of match_events.info.frames) {
            const frame_timestamp = Math.floor(frame.timestamp / 60000); // convert to minutes

            // Iterate through events
            const player_events: any[] = [];
            
            for (const event of frame.events) {
                delete event.timestamp; // remove timestamp to reduce size

                // Filter events based on criteria
                if (event.type === 'CHAMPION_KILL') {
                    if (
                        event.killerId === playerId ||
                        (event.assistingParticipantIds && event.assistingParticipantIds.includes(playerId)) ||
                        event.victimId === playerId
                    ) {
                        delete event.killStreakLength;
                        delete event.victimDamageDealt;
                        delete event.victimDamageReceived;
                        player_events.push(event);
                    }
                } else if (event.type === 'ELITE_MONSTER_KILL' || event.type === 'FEAT_UPDATE') {
                    player_events.push(event);
                } else if (event.type === 'BUILDING_KILL' || event.type === 'TURRET_PLATE_DESTROYED') {
                    if (event.killerId === playerId) {
                        player_events.push(event);
                    }
                }
            }

            // Add the player's current in-game stats to this event (if any relevant events found)
            if (player_events.length > 0) {
                const player_data = frame.participantFrames[playerId.toString()];
                
                // Remove unnecessary information to reduce size
                delete player_data.damageStats;
                delete player_data.goldPerSecond;
                delete player_data.minionsKilled;
                delete player_data.jungleMinionsKilled;
                delete player_data.totalGold;
                delete player_data.xp;
                delete player_data.timeEnemySpentControlled;

                frameData.push({
                    timestamp: frame_timestamp,
                    events: player_events,
                    participantFrames: player_data,
                });
            }
        }
    }

    return frameData;
};

/**
 * Combines player-specific match details and timeline data.
 * @return player summary or null if player details not found.
 */
export async function getPlayerSummary(puuid: string, match_id: string): Promise<PlayerSummary | null> {
    const player_stats = await getPlayerDetails(puuid, match_id);
    const player_timeline = await getPlayerTimeline(puuid, match_id);

    if (!player_stats) {
        return null;
    }

    return {
        player_stats,
        player_timeline,
    };
};
