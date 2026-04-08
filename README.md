# 🏏 CricBid — Multiplayer Cricket Auction Game

A real-time, IPL-style cricket auction game with Claude AI team rankings.

## Features
- Create auction rooms with a shareable invite link
- Real-time multiplayer bidding via WebSockets (Socket.io)
- 40 real international cricket players with base prices
- **AI Analysis Mode**: Choose between *Complete Career* or *Recent Form (2021–2025)* for team rankings
- Claude AI gives each team a score, verdict, MVP pick, strengths & weaknesses
- Fully responsive — works on mobile

---

## Quick Start

### 1. Clone / download the project
```
cricket-auction/
├── server/
│   ├── index.js        ← Main server (Express + Socket.io)
│   └── players.js      ← Player database (40 players)
├── public/
│   ├── index.html      ← Homepage (create room)
│   ├── pages/
│   │   └── room.html   ← Auction room page
│   ├── js/
│   │   └── room.js     ← Client-side socket logic
│   └── css/
│       └── main.css    ← All styles
├── package.json
└── .env.example
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and paste your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
```
Get your API key from: https://console.anthropic.com

### 4. Run the server
```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

### 5. Open in browser
```
http://localhost:3000
```

---

## How to Play

1. **Host** opens `http://localhost:3000`, enters their name, sets teams/budget, picks AI mode, clicks **Create Room**
2. Host shares the invite link with friends
3. **Participants** open the link, enter their name and franchise name, click **Join**
4. Once all teams have joined, **Host** clicks **Start Auction**
5. Players appear one by one — any team clicks **Bid** to place the next bid
6. Host clicks **Confirm Sold** or **Mark Unsold**
7. After all 40 players — **Claude AI** ranks the teams!

---

## AI Analysis Modes

| Mode | What AI looks at |
|------|-----------------|
| 📚 Complete Career | All-time stats, legacy, career averages, consistency across all formats |
| 🔥 Recent Form (2021–2025) | Recent IPL seasons, T20 WC 2022 & 2024, current fitness and form |

---

## Deploy to Production

### Backend (Railway — free tier)
1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Railway auto-detects Node.js and runs `npm start`
5. You get a public URL like `https://cricbid.up.railway.app`

### Alternative: Render
1. https://render.com → New Web Service → Connect GitHub repo
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add env var: `ANTHROPIC_API_KEY`

---

## Tech Stack
- **Backend**: Node.js + Express
- **Real-time**: Socket.io (WebSockets)
- **AI**: Claude claude-opus-4-20250514 via Anthropic API
- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
- **Database**: In-memory (rooms expire after 1 hour)

---

## Extending the App

### Add persistent storage (MongoDB)
```bash
npm install mongoose
```
Replace the `rooms` object with MongoDB documents for rooms that survive server restarts.

### Add authentication
```bash
npm install express-session passport
```
Let players create accounts, track all-time auction stats.

### Mobile app (React Native / Flutter)
The backend is REST + Socket.io — any mobile framework can connect to it.
Use `socket.io-client` in React Native or the Dart socket.io package in Flutter.

### Add more players
Edit `server/players.js` — just add more objects to the array.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required for AI rankings) |
| `PORT` | Server port (default: 3000) |
