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

type TimelineStats = {
    championTakedowns: number;
    deaths: number;
    epicMonsterTakedowns: number;
    turretTakedowns: number;
    platesTaken: number;
}

type PlayerTimelineStats = {
    earlyGameStats: TimelineStats;
    midGameStats: TimelineStats;
    lateGameStats: TimelineStats;
}

type PlayerSummary = {
    playerDetails: PlayerDetails | null;
    playerTimeline: PlayerTimelineStats | null;
}
