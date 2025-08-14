def cs_per_minute(stats, duration_sec):
    return stats["totalMinionsKilled"] / (duration_sec / 60)

def kill_participation(stats, team_kills):
    return (stats["kills"] + stats["assists"]) / team_kills if team_kills > 0 else 0
