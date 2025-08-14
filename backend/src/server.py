from fastapi import FastAPI, File, UploadFile
from src.riot_api import get_match_data, get_timeline_data
from src.analysis import cs_per_minute, kill_participation
from src.feedback import feedback_from_stats

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "LOL Replay Analyzer"}
