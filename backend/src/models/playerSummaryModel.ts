import mongoose from "mongoose";

const playerSummarySchema = new mongoose.Schema({
    puuid: { type: String, required: true },
    matchid: { type: String, required: true },
    analysis: {
        stats: { type: mongoose.Schema.Types.Mixed, required: true },
        timeline: { type: [mongoose.Schema.Types.Mixed], required: true },
    }
});

export const playerSummaryModel = mongoose.model('PlayerSummary', playerSummarySchema);