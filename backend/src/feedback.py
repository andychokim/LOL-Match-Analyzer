def feedback_from_stats(cs_min, kp):
    tips = []
    if cs_min < 6:
        tips.append("Work on last hitting to improve CS/min.")
    if kp < 0.5:
        tips.append("Participate in more fights to improve kill participation.")
    return tips
