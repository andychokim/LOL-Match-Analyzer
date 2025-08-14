import requests
from src.config import API_KEY, PLATFORM_REGION

# Get the PUUID for a given summoner name and tag line.
def get_puuid(gameName: str, tagLine: str) -> str:

    url = f"https://{PLATFORM_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
    headers = {"X-Riot-Token": API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise an error for bad responses
    data = response.json()
    print("data:", data)

    return data["puuid"]

