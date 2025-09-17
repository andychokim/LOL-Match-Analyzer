from ..riot_api.riot_client import get_matchDetails, get_matchTimeline

def get_playerMatchDetails(puuid, matchId):
    """
    Extracts player-specific stats from match details.
    """
    match_details = get_matchDetails(matchId)

    # check if match_details is valid
    if match_details and "info" in match_details:
        players = match_details["info"]["participants"]
        for player in players:
            if player.get("puuid") == puuid:
                match_details = {"stats": {
                    "champion": player.get("championName"),
                    "role": player.get("teamPosition"),
                    "kills": player.get("kills"),
                    "deaths": player.get("deaths"),
                    "assists": player.get("assists"),
                    "gold": player.get("goldEarned"),
                    "damage": player.get("totalDamageDealtToChampions"),
                    "vision": player.get("visionScore"),
                    "cs": player.get("totalMinionsKilled") + player.get("neutralMinionsKilled"),
                    # raw copy if needed
                    "_raw": player
                }}
                break

    return match_details["stats"]

def get_playerMatchTimeline(puuid, matchId):
    """
    Extracts player-specific data from match timeline.
    
    return: a dictionary that has one key "frames" which contains a list of frames. 
        Each frame contains two keys: "events" and "inGameStats".
    """
    match_events = get_matchTimeline(matchId)
    player_timeData = {"frameData": []}

    # check if match_events is valid
    if match_events and "info" in match_events:
        players = match_events["info"]["participants"]
        for player in players:

            if player["puuid"] == puuid:
                playerId = player["participantId"]
                break

        frames = match_events["info"]["frames"]
        for frame in frames:

            # refresh player events for each frame
            player_events = []

            events = frame["events"]
            for event in events:

                # filter events based on criteria:
                # type = CHAMPION_KILL and involves killerId, assistingParticipantIds or victimId of the player
                # type = ELITE_MONSTER_KILL (any) with DRAGON_SOUL_GIVEN (any)
                # type = FEAT_UPDATE (any)
                # type = BUILDING_KILL and involves killerId of the player
                # type = TURRET_PLATE_DESTROYED and involves killerId of the player
                if event["type"] == "CHAMPION_KILL":
                    if ((event.get("killerId") == playerId) or
                        (event.get("assistingParticipantIds") and playerId in event.get("assistingParticipantIds")) or
                        (event.get("victimId") == playerId)):
                        player_events.append(event)
                elif event["type"] == "ELITE_MONSTER_KILL":
                    player_events.append(event)
                elif event["type"] == "FEAT_UPDATE":
                    player_events.append(event)
                elif event["type"] == "BUILDING_KILL":
                    if event.get("killerId") == playerId:
                        player_events.append(event)
                elif event["type"] == "TURRET_PLATE_DESTROYED":
                    if event.get("killerId") == playerId:
                        player_events.append(event)


            # in-game stats for this player at this frame
            player_data = frame["participantFrames"][str(playerId)]
            
            # append to result
            player_timeData["frameData"].append({
                "events": player_events,
                "participantFrames": player_data
            })

    return player_timeData["frameData"]

def get_playerSummary(puuid, match_details, match_timeline):
    """
    Combines player-specific match details and timeline data.
    """

    return {
        "player_stats": get_playerMatchDetails(puuid, match_details),
        "player_timeline": get_playerMatchTimeline(puuid, match_timeline)
    }
