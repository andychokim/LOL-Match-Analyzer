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

def get_matchEvents(puuid, matchId):
    return None

def get_playerPerformance(puuid, match_details, match_timeline):
    return None