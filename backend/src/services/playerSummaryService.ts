import { getMatchDetailsByMatchID, getMatchTimelineByMatchID } from './riotService';


/**
 * Extracts player-specific stats details from match details.
 * @returns player details or null if not found.
 */
async function getPlayerDetails(puuid: string, match_id: string): Promise<PlayerDetails | null> {
    // a Set of challenge keys to keep
    const CHALLENGES_KEEP_KEYS = new Set([
        "earlyLaningPhaseGoldExpAdvantage",
        "controlWardTimeCoverageInRiverOrEnemyHalf",
        "hadAfkTeammate",
        "laningPhaseGoldExpAdvantage",
        "maxCsAdvantageOnLaneOpponent",
        "maxLevelLeadLaneOpponent",
        "soloTurretsLategame",
        "takedownsFirst25Minutes",
        "teleportTakedowns",
        "visionScoreAdvantageLaneOpponent",
        "controlWardsPlaced",
        "firstTurretKilled",
        "laneMinionsFirst10Minutes",
        "takedownsAfterGainingLevelAdvantage",
        "teamDamagePercentage",

        // Jungler-specific challenges
        "junglerKillsEarlyJungle",
        "killsOnLanersEarlyJungleAsJungler",
        "jungleCsBefore10Minutes",

        // to be removed after aggregation
        "killParticipation",
        "turretTakedowns",
        "dragonTakedowns",
        "baronTakedowns",
        "teamBaronKills",
        "riftHeraldTakedowns",
        "teamRiftHeraldKills",
    ]);
    const matchDetails = await getMatchDetailsByMatchID(match_id);

    if (matchDetails && matchDetails.info) {
        const players = matchDetails.info.participants;
        const player = players.find((p: any) => p.puuid === puuid);
        if (!player) return null;

        const playerDetails: PlayerDetails = {
            champion: player.championName,
            role: player.teamPosition,
            champLevel: player.champLevel,
            challenge: player.challenges || {},
            killParticipation: 0,
            deathParticipation: 0,
            turretKillParticipation: 0,
            epicMonsterKillParticipation: 0,
            win: player.win,
        }

        const teamStats: TeamStats = {
            totalDeaths: 0,
            totalTurretKills: 0,
            totalDragonKills: 0,
        };

        for (const p of players) {
            // Aggregate team stats for the player's team
            if (p.teamId === player.teamId) {
                teamStats.totalDeaths += p.deaths;
                teamStats.totalTurretKills += p.turretKills;
                teamStats.totalDragonKills += p.dragonKills;
            }

            // Filter player's challenges to only include relevant keys
            if (p.puuid === puuid && p.challenges) {
                const filteredChallenges: Record<string, any> = {};
                for (const key in p.challenges) {
                    if (CHALLENGES_KEEP_KEYS.has(key)) {
                        if (key === "teamDamagePercentage" || key === "visionScoreAdvantageLaneOpponent") {
                            filteredChallenges[key] = parseFloat(p.challenges[key].toFixed(3)); // round to 3 decimal places
                        } else {
                            filteredChallenges[key] = p.challenges[key];
                        }
                    }
                }
                playerDetails.challenge = filteredChallenges;
            }
        }

        // Calculate participation rates
        playerDetails.killParticipation = parseFloat((playerDetails.challenge.killParticipation).toFixed(3));
        playerDetails.deathParticipation = parseFloat((player.deaths / teamStats.totalDeaths).toFixed(3));
        playerDetails.turretKillParticipation = parseFloat((playerDetails.challenge.turretTakedowns / teamStats.totalTurretKills).toFixed(3));
        playerDetails.epicMonsterKillParticipation = parseFloat(
            ((playerDetails.challenge.dragonTakedowns + playerDetails.challenge.baronTakedowns + playerDetails.challenge.riftHeraldTakedowns) / 
            (teamStats.totalDragonKills + playerDetails.challenge.teamBaronKills + playerDetails.challenge.teamRiftHeraldKills)).toFixed(3)
        );

        // remove unnecessary information to reduce size
        delete playerDetails.challenge.killParticipation;
        delete playerDetails.challenge.turretTakedowns;
        delete playerDetails.challenge.dragonTakedowns;
        delete playerDetails.challenge.baronTakedowns;
        delete playerDetails.challenge.teamBaronKills;
        delete playerDetails.challenge.riftHeraldTakedowns;
        delete playerDetails.challenge.teamRiftHeraldKills;
        
        return playerDetails;
    }
    return null;
};

/**
 * Extracts player-specific data from match timeline.
 * Purpose is to extract early-game and late-game events and stats for the player, which can be used to analyze the player's performance and decision-making throughout the match.
 * @returns a list of frames containing events and in-game stats for the player.
 */
async function getPlayerTimeline(puuid: string, match_id: string): Promise<playerTimelineStats | null> {
    const matchTimeline = await getMatchTimelineByMatchID(match_id);

    if (matchTimeline && matchTimeline.info) {
        const player = matchTimeline.info.participants.find((p: any) => p.puuid === puuid);
        const playerId = player ? player.participantId : null; // need participantId to match events to the player
        if (!playerId) return null;

        const playerTimeline: playerTimelineStats = {
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
            }
        };

        // Iterate through each frame in the timeline
        const frames = matchTimeline.info.frames;        
        for (const frame of frames) {
            // Iterate through events, collecting early game events first
            for (const event of frame.events) {
                const timeStampInMinute = Math.floor(event.timestamp / 60000); // convert to minutes

                // Filter events based on criteria
                if (event.type === 'CHAMPION_KILL' && (event.killerId === playerId || (event.assistingParticipantIds && event.assistingParticipantIds.includes(playerId)))) {
                    if (timeStampInMinute < 15) playerTimeline.earlyGameStats.championTakedowns += 1;
                    else if (timeStampInMinute < 35) playerTimeline.midGameStats.championTakedowns += 1;
                    else playerTimeline.lateGameStats.championTakedowns += 1;
                } 
                else if (event.type === 'CHAMPION_KILL' && event.victimId === playerId) {
                    if (timeStampInMinute < 15) playerTimeline.earlyGameStats.deaths += 1;
                    else if (timeStampInMinute < 35) playerTimeline.midGameStats.deaths += 1;
                    else playerTimeline.lateGameStats.deaths += 1;
                } 
                else if (event.type === 'ELITE_MONSTER_KILL' && (event.killerId === playerId || (event.assistingParticipantIds && event.assistingParticipantIds.includes(playerId)))) {
                    if (timeStampInMinute < 15) playerTimeline.earlyGameStats.epicMonsterTakedowns += 1;
                    else if (timeStampInMinute < 35) playerTimeline.midGameStats.epicMonsterTakedowns += 1;
                    else playerTimeline.lateGameStats.epicMonsterTakedowns += 1;
                } 
                else if (event.type === 'BUILDING_KILL' && (event.killerId === playerId || (event.assistingParticipantIds && event.assistingParticipantIds.includes(playerId)))) {
                    if (timeStampInMinute < 15) playerTimeline.earlyGameStats.turretTakedowns += 1;
                    else if (timeStampInMinute < 35) playerTimeline.midGameStats.turretTakedowns += 1;
                    else playerTimeline.lateGameStats.turretTakedowns += 1;
                }
                else if (event.type === 'TURRET_PLATE_DESTROYED' && event.participantId === playerId) {
                    if (timeStampInMinute < 15) playerTimeline.earlyGameStats.platesTaken += 1;
                    // do not count mid-game and late-game plates for now, as they can be influenced by many factors beyond the player's control (e.g. team decision, enemy team composition, etc.)
                    // else if (timeStampInMinute < 35) playerTimeline.midGameStats.platesTaken += 1;
                    // else playerTimeline.lateGameStats.platesTaken += 1;
                }
            }
        }
        return playerTimeline;
    }
    return null;
};

/**
 * Combines player-specific match details and timeline data.
 * @return player summary or null if player details not found.
 */
export async function getPlayerSummary(puuid: string, match_id: string): Promise<PlayerSummary | null> {
    const playerDetails = await getPlayerDetails(puuid, match_id);
    const playerTimeline = await getPlayerTimeline(puuid, match_id);

    const payloadString1 = JSON.stringify(playerDetails);
    console.log(payloadString1);
    console.log('@@@');
    const payloadString2 = JSON.stringify(playerTimeline);
    console.log(payloadString2);

    console.log('Payload size:', (Buffer.byteLength(payloadString1) + Buffer.byteLength(payloadString2)), 'bytes');

    if (playerDetails && playerTimeline) return { playerDetails, playerTimeline };
    return null;
};
