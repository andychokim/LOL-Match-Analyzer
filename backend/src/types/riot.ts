type TeamStats = {
    totalDeaths: number;
    totalTurretKills: number;
    totalDragonKills: number;
};

type PlayerDetails = {
    champion: string;
    role: string;
    champLevel: number;
    challenge: Record<string, any>;
    killParticipation: number;
    deathParticipation: number;
    turretKillParticipation: number;
    epicMonsterKillParticipation: number;
    win: boolean;
}

type PlayerAndTeamStats = {
    teamStats: TeamStats;
    playerDetails: PlayerDetails;
}

type timelineStats = {
    championTakedowns: number;
    deaths: number;
    epicMonsterTakedowns: number;
    turretTakedowns: number;
    platesTaken: number;
}

type playerTimelineStats = {
    earlyGameStats: timelineStats;
    midGameStats: timelineStats;
    lateGameStats: timelineStats;
}

type PlayerSummary = {
    playerDetails: PlayerDetails | null;
    playerTimeline: playerTimelineStats | null;
}
