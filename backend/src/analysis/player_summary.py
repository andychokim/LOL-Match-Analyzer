from ..riot_api.riot_client import get_matchDetails, get_matchTimeline

def get_playerDetails(puuid:str, match_id:str) -> dict:
    """
    Extracts player-specific stats details from match details.
    """
    match_details = get_matchDetails(match_id)

    # keys to keep in the challenges dictionary
    chllanges_keep_keys = {
        # Core performance
        "kda",
        "damagePerMinute",
        "teamDamagePercentage",
        "killParticipation",
        "goldPerMinute",
        "visionScorePerMinute",

        # Objective & Macro
        "baronTakedowns",
        "dragonTakedowns",
        "riftHeraldTakedowns",
        "turretTakedowns",
        "voidMonsterKill",

        # Fighting / Skirmishing
        "soloKills",
        "killsNearEnemyTurret",
        "killsUnderOwnTurret",
        "outnumberedKills",
        "immobilizeAndKillWithAlly",
        "enemyChampionImmobilizations",

        # Laning Phase
        "laneMinionsFirst10Minutes",
        "maxCsAdvantageOnLaneOpponent",
        "maxLevelLeadLaneOpponent",

        # Survivability
        "damageTakenOnTeamPercentage",
        "survivedSingleDigitHpCount",
        "survivedThreeImmobilizesInFight",

        # Vision & Utility
        "controlWardsPlaced",
        "stealthWardsPlaced",
        "wardTakedowns",
        "visionScoreAdvantageLaneOpponent",
    }

    # check if match_details is valid
    if match_details and "info" in match_details:
        players = match_details["info"]["participants"]
        for player in players:
            if player.get("puuid") == puuid:

                # filter out unnecessary information to reduce size
                filtered_challenges = {key: value for key, value in player["challenges"].items() if key in chllanges_keep_keys}

                # extract relevant stats
                player_details = {
                    "champion": player.get("championName"),
                    "role": player.get("teamPosition"),
                    "champLevel": player.get("champLevel"),
                    "kills": player.get("kills"),
                    "deaths": player.get("deaths"),
                    "assists": player.get("assists"),
                    "totalGold": player.get("goldEarned"),
                    "totalDamage": player.get("totalDamageDealtToChampions"),
                    "visionScore": player.get("visionScore"),
                    "wardsPlaced": player.get("wardsPlaced"),
                    "detectorWardsPlaced": player.get("detectorWardsPlaced"),
                    "cs": player.get("totalMinionsKilled") + player.get("neutralMinionsKilled"),
                    "runes": player.get("perks"),
                    "challenge": filtered_challenges,
                    "win": player.get("win")
                }
                break

    return player_details

def get_playerTimeline(puuid:str, match_id:str) -> list[dict]:
    """
    Extracts player-specific data from match timeline.
    
    return: a dictionary that has one key "frames" which contains a list of frames. 
        Each frame contains two keys: "events" and "inGameStats".
    """
    match_events = get_matchTimeline(match_id)
    player_timeData = {"frameData": []}

    # check if match_events is valid
    if match_events and "info" in match_events:

        # find the participantId for this puuid
        for player in match_events["info"]["participants"]:

            if player["puuid"] == puuid:
                playerId = player["participantId"]
                break
        
        # iterate through each frame in the timeline
        for frame in match_events["info"]["frames"]:

            # in-game stats for this player at this frame
            frame_timestamp = frame["timestamp"] // 60000  # convert to minutes

            # iterate through events after refreshing the frame's events holder
            player_events = []
            for event in frame["events"]:
                event.pop("timestamp", None)  # remove timestamp to reduce size

                # filter events based on criteria:
                # type = CHAMPION_KILL and involves killerId, assistingParticipantIds or victimId of the player
                # type = ELITE_MONSTER_KILL (any) with DRAGON_SOUL_GIVEN (any)
                # type = FEAT_UPDATE (any)
                # type = BUILDING_KILL and involves killerId of the player
                # type = TURRET_PLATE_DESTROYED and involves killerId of the player
                if event["type"] == "CHAMPION_KILL":
                    if (
                        (event.get("killerId") == playerId) or
                        (event.get("assistingParticipantIds") and playerId in event.get("assistingParticipantIds")) or
                        (event.get("victimId") == playerId)
                        ):
                        event.pop("killStreakLength", None)  # remove killStreakLength to reduce size
                        event.pop("victimDamageDealt", None)  # remove victimDamageDealt to reduce size
                        event.pop("victimDamageReceived", None)  # remove victimDamageReceived to reduce size
                        player_events.append(event)

                elif event["type"] == ("ELITE_MONSTER_KILL" or "FEAT_UPDATE"):
                    player_events.append(event)

                elif event["type"] == ("BUILDING_KILL" or "TURRET_PLATE_DESTROYED"):
                    if event.get("killerId") == playerId:
                        player_events.append(event)
            
            # add the player's current in-game stats to this event (if any relevant events found)
            if player_events is not None and len(player_events) > 0:
                player_data = frame["participantFrames"][str(playerId)]
                # remove unnecessary information to reduce size  
                player_data.pop("damageStats", None)   
                player_data.pop("goldPerSecond", None)
                player_data.pop("minionsKilled", None)
                player_data.pop("jungleMinionsKilled", None)
                player_data.pop("totalGold", None)
                player_data.pop("xp", None)
                player_data.pop("timeEnemySpentControlled", None)

                # append both to result
                player_timeData["frameData"].append({
                    "timestamp": frame_timestamp,
                    "events": player_events,
                    "participantFrames": player_data
                })

    return player_timeData["frameData"]

def get_playerSummary(puuid:str, match_id:str) -> dict:
    """
    Combines player-specific match details and timeline data.
    """

    return {
        "player_stats": get_playerDetails(puuid, match_id),
        "player_timeline": get_playerTimeline(puuid, match_id)
    }
