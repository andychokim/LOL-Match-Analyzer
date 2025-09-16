from ..riot_api.riot_client import get_matchDetails, get_matchTimeline

def get_matchStats(puuid, matchId):
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

def get_matchTimeData(puuid, matchId):
    """
    Extracts player-specific timeline data from match timeline.
    
    return: a dictionary that has one key "frames" which contains a list of frames. 
        Each frame contains two keys: "events" and "inGameStats".
    """
    match_events = get_matchTimeline(matchId)
    player_timeData = {"frameData": []}

    # check if match_events is valid
    if match_events and "info" in match_events:
        players = match_events["metadata"]["participants"]
        for player in players:
            if player == puuid:
                playerId = players.index(player) + 1
                break

        frames = match_events["info"].get("frames", [])
        for frame in frames:

            # events related to this player at this frame
            player_events = [
                event for event in frame.get("events", [])
                if any(value == playerId for key, value in event.items() if key.endswith("Id"))
            ]

            # in-game stats for this player at this frame
            player_data = frame.get("participantFrames", {}).get(str(playerId), {})
            
            # append to result
            player_timeData["frameData"].append({
                "events": player_events,
                "participantFrames": player_data
            })

    return player_timeData["frameData"]

def get_playerSummary(puuid, match_details, match_timeline):

    return {
        "final_stats": get_matchStats(puuid, match_details),
        "timeline_data": get_matchTimeData(puuid, match_timeline)
    }
