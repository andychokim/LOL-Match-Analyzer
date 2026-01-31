/**
 * Type definitions for Riot API responses
 */

export interface MatchDetails {
    metadata: {
        dataVersion: string;
        matchId: string;
        participants: string[];
    };
    info: {
        endOfGameResult: string;
        gameCreation: number;
        gameDuration: number;
        gameId: number;
        gameMode: string;
        gameName: string;
        gameStartTimestamp: number;
        gameType: string;
        gameVersion: string;
        mapId: number;
        participants: ParticipantInfo[];
        platformId: string;
        queueId: number;
        teams: TeamInfo[];
        tournamentCode: string;
    };
}

export interface ParticipantInfo {
    puuid: string;
    championName: string;
    teamPosition: string;
    champLevel: number;
    kills: number;
    deaths: number;
    assists: number;
    goldEarned: number;
    totalDamageDealtToChampions: number;
    visionScore: number;
    wardsPlaced: number;
    detectorWardsPlaced: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    win: boolean;
    challenges?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface TeamInfo {
    teamId: number;
    win: boolean;
    bans: Array<{
        championId: number;
        pickTurn: number;
    }>;
    objectives: {
        baron: {
            first: boolean;
            kills: number;
        };
        champion: {
            first: boolean;
            kills: number;
        };
        dragon: {
            first: boolean;
            kills: number;
        };
        inhibitor: {
            first: boolean;
            kills: number;
        };
        riftHerald: {
            first: boolean;
            kills: number;
        };
        tower: {
            first: boolean;
            kills: number;
        };
    };
}

export interface MatchTimeline {
    metadata: {
        dataVersion: string;
        matchId: string;
        participants: string[];
    };
    info: {
        frameInterval: number;
        frames: TimelineFrame[];
        gameId: number;
        participants: ParticipantIdentity[];
    };
}

export interface TimelineFrame {
    timestamp: number;
    participantFrames: Record<string, ParticipantFrame>;
    events: TimelineEvent[];
}

export interface ParticipantFrame {
    participantId: number;
    minionsKilled: number;
    teamScore: number;
    position: {
        x: number;
        y: number;
    };
    currentGold: number;
    totalGold: number;
    level: number;
    xp: number;
    damageStats: {
        magicDamageDone: number;
        magicDamageDoneToChampions: number;
        magicDamageTaken: number;
        physicalDamageDone: number;
        physicalDamageDoneToChampions: number;
        physicalDamageTaken: number;
        trueDamageDone: number;
        trueDamageDoneToChampions: number;
        trueDamageTaken: number;
    };
    goldPerSecond: number;
    jungleMinionsKilled: number;
    championStats: {
        ability_haste: number;
        ability_power: number;
        armor: number;
        armor_pen_flat: number;
        armor_pen_percent: number;
        attack_damage: number;
        attack_speed: number;
        bonus_armor_pen_percent: number;
        bonus_magic_pen_percent: number;
        cooldown_reduction: number;
        health_max: number;
        health_regen: number;
        lifesteal: number;
        magic_pen_flat: number;
        magic_pen_percent: number;
        magic_resist: number;
        movement_speed: number;
        omnivamp: number;
        physical_vamp: number;
        power: number;
        spell_vamp: number;
        [key: string]: unknown;
    };
    timeEnemySpentControlled: number;
}

export interface TimelineEvent {
    realTimestamp: number;
    timestamp: number;
    type: string;
    participantId?: number;
    killerId?: number;
    victimId?: number;
    assistingParticipantIds?: number[];
    killStreakLength?: number;
    victimDamageDealt?: unknown[];
    victimDamageReceived?: unknown[];
    position?: {
        x: number;
        y: number;
    };
    monsterSubType?: string;
    [key: string]: unknown;
}

export interface ParticipantIdentity {
    puuid: string;
    participantId: number;
    championId: number;
    championName: string;
    summonerName: string;
    teamId: number;
    [key: string]: unknown;
}
