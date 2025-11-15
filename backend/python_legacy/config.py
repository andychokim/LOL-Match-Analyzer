"""
Configuration file for the API clients.
"""

import os
from dotenv import load_dotenv

load_dotenv()

RIOT_API_KEY = os.getenv("RIOT_API_KEY")
REGION = os.getenv("REGION")
PLATFORM_REGION = os.getenv("PLATFORM_REGION")
HEADERS = {
    "X-Riot-Token": RIOT_API_KEY
}

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")