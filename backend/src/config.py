import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RIOT_API_KEY")
REGION = os.getenv("REGION")
PLATFORM_REGION = os.getenv("PLATFORM_REGION")
