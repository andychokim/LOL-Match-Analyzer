import requests
from src.config import API_KEY, REGION

def riot_get(endpoint):
    headers = {"X-Riot-Token": API_KEY}
    url = f"https://{REGION}.api.riotgames.com{endpoint}"
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json()

def get_match_data(match_id):
    return riot_get(f"/lol/match/v5/matches/{match_id}")

def get_timeline_data(match_id):
    return riot_get(f"/lol/match/v5/matches/{match_id}/timeline")
