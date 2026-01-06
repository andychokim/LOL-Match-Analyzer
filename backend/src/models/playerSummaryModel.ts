import mongoose from "mongoose";

const playerSummarySchema = new mongoose.Schema({
    puuid: { type: String, required: true },
    matchid: { type: String, required: true },
    analysis: { type: String, required: true }
});

export const playerSummaryModel = mongoose.model('PlayerSummary', playerSummarySchema);