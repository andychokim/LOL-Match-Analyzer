"""
Riot API Client for League of Legends
This module provides functions to interact with the Riot Games API to fetch player PUUIDs, recent matches, and match details.
It uses the requests library to make HTTP requests and requires an API key and region configuration.
Author: Andrew C. Kim
Date: 2025-08-15
Version: 1.1
"""

import logging
from typing import Any
import requests
from src.config import REGION, HEADERS

# Configure logging
logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)

def get_PUUID(gameName:str, tagLine:str) -> str:
    """
    Fetches the PUUID (Player Unique ID) for a given game name and tag line.

    Args:
        game_name (str): The player's in-game name (ex: GNR nomsy).
        tag_line (str): The player's tag line (ex: #stuck).
    
    Returns:
        str: The PUUID of the player.

    Raises:
        Exception: If the API request fails or returns an error.
    """
    url = f"https://{REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
    logger.info(f"Fetching PUUID for {gameName}#{tagLine} from {url}")

    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        return response.json().get("puuid")
    else:
        logger.error(f"Failed to fetch PUUID: {response.status_code} - {response.text}")
        raise Exception(f"Error fetching PUUID: {response.status_code} - {response.text}")


def get_recentMatches(puuid:str, count:int = 5) -> list[str]:
    """
    Fetches recent match IDs for a given PUUID.

    Args:
        puuid (str): The PUUID of the player.
        count (int): The number of recent matches to fetch (default is 5).

    Returns:
        list: A list of recent match IDs.

    Raises:
        Exception: If the API request fails or returns an error.
    """
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?count={count}"
    logger.info(f"Fetching recent matches for PUUID {puuid} from {url}")

    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Failed to fetch recent matches: {response.status_code} - {response.text}")
        raise Exception(f"Error fetching recent matches: {response.status_code} - {response.text}")
    

def get_matchDetails(match_id:str) -> dict[str, Any]:
    """
    Fetches detailed information about a specific match using its match ID.

    Args:
        match_id (str): The ID of the match to fetch details for.
    
    Returns:
        dict: A dictionary containing match details.

    Raises:
        Exception: If the API request fails or returns an error.
    """
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    logger.info(f"Fetching match details for match ID {match_id} from {url}")

    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Failed to fetch match details: {response.status_code} - {response.text}")
        raise Exception(f"Error fetching match details: {response.status_code} - {response.text}")
    