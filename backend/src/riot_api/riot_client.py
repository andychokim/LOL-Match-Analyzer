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

class RiotAPIError(Exception):
    """
    Custom exception for Riot API-related errors.
    This helps in catching and handling specific API-related issues.
    """
    def __init__(self, message, status_code=None, response_text=None):
        super().__init__(message)
        self.status_code = status_code
        self.response_text = response_text

def send_request(url: str):
    """
    Helper function to make a GET request and handle errors.

    Args:
        url (str): The URL to send the GET request to.

    Returns:
        dict: The JSON response from the API.
    """
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()  # This will raise an HTTPError for 4xx/5xx responses

        return response.json()
    
    except requests.exceptions.HTTPError as error:
        logger.error(f"API request with HTTP status code {error.response.status_code}")

        raise RiotAPIError(
            f"API request failed: {error.response.status_code} - {error.response.text}",
            status_code=error.response.status_code if error.response else None,
            response_text=error.response.text if error.response else None
        ) from error
    
    except requests.exceptions.RequestException as error:
        logger.error(f"Network error occurred while accessing {url}: {error}")

        raise RiotAPIError(f"Network error occurred: {str(error)}") from error


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

    return send_request(url).get("puuid")

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

    return send_request(url)

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

    return send_request(url)

def get_matchTimeline(match_id:str) -> dict[str, Any]:
    """
    Fetches the timeline information about a specific match using its match ID.

    Args:
        match_id (str): The ID of the match to fetch timeline for.
    
    Returns:
        dict: A dictionary containing match timeline.

    Raises:
        Exception: If the API request fails or returns an error.
    """
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/{match_id}/timeline"
    logger.info(f"Fetching match timeline for match ID {match_id} from {url}")

    return send_request(url)
    