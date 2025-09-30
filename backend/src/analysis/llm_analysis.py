from openai import OpenAI

from src.utils.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_insights(player_summary):
    """
    Uses LLM to generate insights based on player stats and game timeline.
    """

    prompt = f"""
    You are a League of Legends AI coach. Analyze this player's match:
    
    Following is the player stats: {player_summary['player_stats']}
    Following is the match's major timeline events: {player_summary['player_timeline']}

    Instructions:
    1. Identify misplays or suboptimal decisions.
    2. Suggest actionable improvements.
    3. Summarize overall strengths and weaknesses.
    Provide concise, coaching-style feedback.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert League of Legends coach."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
