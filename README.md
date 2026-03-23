# LOL Match Analyzer

A full-stack League of Legends match analysis app.

The app takes a Riot ID (game name + tag), fetches recent matches, and generates a player-focused analysis for a selected match using an LLM.

Live site: [https://andrewprojects-lolma.vercel.app/](https://andrewprojects-lolma.vercel.app/)

## Features

- Fetch player `puuid` from Riot ID.
- Fetch recent match IDs.
- Fetch full match details.
- Build a player summary from match + timeline data.
- Generate natural-language analysis with Groq (`llama-3.1-8b-instant`).
- Cache generated analyses in MongoDB for reuse.

## Tech Stack

- Frontend: React (Create React App), React Router
- Backend: Node.js, Express, TypeScript
- Data/API: Riot Games API
- LLM: Groq SDK
- Database: MongoDB Atlas (Mongoose)
- Testing: Jest, Supertest (backend), React Testing Library (frontend)

## Repository Structure

```text
.
|- backend/                 # Express + TypeScript API
|  |- src/
|  |- tests/
|  |- python_legacy/        # legacy Python implementation
|- frontend/lol-analyzer/   # React app
|- documents/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Riot API key
- Groq API key

## Environment Variables (Backend)

Create `backend/.env`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

RIOT_API_KEY=your_riot_api_key
REGION=americas
PLATFORM_REGION=na1

GROQ_API_KEY=your_groq_api_key
GROQ_MESSAGE=your_prompt_for_analysis

OPENAI_API_KEY=optional_or_unused
```

Notes:

- The frontend uses a proxy to `http://localhost:5000`, so `PORT=5000` is recommended for local development.
- `PLATFORM_REGION` exists in config, but current route handlers use `REGION` for the exposed endpoints.

## Local Development

### 1) Start backend

```bash
cd backend
npm install
npm run dev
```

### 2) Start frontend

```bash
cd frontend/lol-analyzer
npm install
npm start
```

Frontend default URL: `http://localhost:3000`

## Backend API Endpoints

Base URL (local): `http://localhost:5000`

- `GET /` - Hero route (health-style welcome response)
- `GET /api/riot/summoner/:summonerName/:tagLine` - Resolve Riot ID to account data / `puuid`
- `GET /api/riot/matches/:puuid` - Recent match IDs (default 5)
- `GET /api/riot/match/:matchId` - Match details
- `GET /api/riot/player-summary/:puuid/:matchId` - Cached or newly generated analysis

## Scripts

### Backend (`backend/package.json`)

- `npm run dev` - Run API in watch mode with `.env`
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run compiled server
- `npm run test` - Run Jest tests with coverage
- `npm run lint` - Run ESLint

### Frontend (`frontend/lol-analyzer/package.json`)

- `npm start` - Start React dev server
- `npm run build` - Build production bundle
- `npm test` - Run React tests
- `npm run lint` - Run ESLint

## Testing

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend/lol-analyzer
npm test
```

## Legacy Python Implementation

`backend/python_legacy/` contains the older Python-based server and analysis pipeline kept for reference and migration history.
