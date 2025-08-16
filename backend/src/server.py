"""
server.py is the main entry point for the backend server.
It initializes the server, sets up routes, and starts listening for requests.
"""

from fastapi import FastAPI, File, UploadFile
from src.riot_api import riot_client
from src.config import API_KEY, REGION, PLATFORM_REGION

app = FastAPI(title="LOL Match Analyzer")

# Define the root endpoint
# This can be used to check if the server is running
@app.get("/")
def read_root():
    return {"message": "LOL Replay Analyzer"}

# Define endpoints for the Riot API client
@app.get("/puuid/{gameName}/{tagLine}")
def fetch_puuid(gameName: str, tagLine: str):
    """
    Returns the PUUID for a given player.
    """
    try:
        puuid = riot_client.get_PUUID(gameName, tagLine)
        return {"puuid": puuid}
    except Exception as error:
        return {"error": str(error)}

@app.get("/recent-matches/{puuid}")
def fetch_recentMatches(puuid: str, count: int = 5):
    """
    Returns recent match IDs for a given PUUID.
    """
    try:
        matches = riot_client.get_recentMatches(puuid, count)
        return {"matches": matches}
    except Exception as error:
        return {"error": str(error)}

@app.get("/match-details/{match_id}")
def fetch_matchDetails(match_id: str):
    """
    Returns detailed information for a given match ID.
    """
    try:
        details = riot_client.get_matchDetails(match_id)
        return {"match_details": details}
    except Exception as error:
        return {"error": str(error)}