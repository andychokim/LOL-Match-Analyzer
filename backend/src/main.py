from src.analysis.player_summary import get_playerSummary
from src.analysis.llm_analysis import generate_insights

# Example usage: replace with actual match JSON & puuid
puuid = "DPCQ2w2ucJEn0rwyW9KNj65pKoqFvFJH7qnkeUgJVZP4xBo4Cc9g6RB-R3yM9ZdgpdxyxLeCKrxOUA"
match_id = "NA1_5348234520"

player_summary = get_playerSummary(puuid, match_id)

feedback = generate_insights(player_summary)
print("=== AI Coaching Feedback ===")
print(feedback)