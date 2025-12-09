import mongoose from "mongoose";

const playerSummarySchema = new mongoose.Schema({
    puuid: { type: String, required: true },
    matchid: { type: String, required: true },
    analysis: {
        player_stats: { type: mongoose.Schema.Types.Mixed, required: true },
        player_timeline: { type: [mongoose.Schema.Types.Mixed], required: true },
    }
});

export const playerSummaryModel = mongoose.model('PlayerSummary', playerSummarySchema);