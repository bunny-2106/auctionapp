require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ─── In-memory room store ────────────────────────────────────────────────────
const rooms = {};

// ─── Player database ──────────────────────────────────────────────────────────
const ALL_PLAYERS = require("./players");

// ─── Routes ──────────────────────────────────────────────────────────────────

// Serve room page
app.get("/room/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/room.html"));
});

// Get all available players (for host to browse and select)
app.get("/api/players", (req, res) => {
  res.json(ALL_PLAYERS);
});

// Create room API
app.post("/api/create-room", (req, res) => {
  const { hostName, hostTeam, numTeams, budget, analysisMode, bidTime, selectedPlayerIds } = req.body;
  const roomId = uuidv4().slice(0, 6).toUpperCase();

  // Filter players based on host selection (by index/name), fallback to all
  let chosenPlayers = ALL_PLAYERS;
  if (Array.isArray(selectedPlayerIds) && selectedPlayerIds.length >= 10) {
    chosenPlayers = selectedPlayerIds
      .map(idx => ALL_PLAYERS[idx])
      .filter(Boolean);
  }

  const shuffled = [...chosenPlayers].sort(() => Math.random() - 0.5);

  rooms[roomId] = {
    id: roomId,
    hostName,
    hostTeam,          // host's own franchise name
    budget: Number(budget),
    analysisMode,
    bidTime: Number(bidTime) || 30, // seconds per player auction
    teams: [],
    numTeams: Number(numTeams),
    players: shuffled,
    currentPlayerIdx: 0,
    phase: "lobby",
    currentBid: null,
    currentBidTeam: null,
    bidTimerEnd: null,  // epoch ms when current bid timer expires
    soldLog: [],
    createdAt: Date.now(),
    timerInterval: null,
  };

  res.json({ roomId });
});

// Get room info
app.get("/api/room/:roomId", (req, res) => {
  const room = rooms[req.params.roomId];
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(sanitizeRoom(room));
});

// AI ranking endpoint
app.post("/api/rank/:roomId", async (req, res) => {
  const room = rooms[req.params.roomId];
  if (!room) return res.status(404).json({ error: "Room not found" });

  const analysisMode = room.analysisMode;
  const squadSummaries = room.teams
    .map((t) => {
      const bats  = t.players.filter((p) => p.role === "Batsman").length;
      const bowls = t.players.filter((p) => p.role === "Bowler").length;
      const ars   = t.players.filter((p) => p.role === "All-rounder").length;
      const wks   = t.players.filter((p) => p.role === "Wicketkeeper").length;
      const avg   = t.players.length ? (t.spent / t.players.length).toFixed(1) : 0;
      const stars = t.players.filter((p) => p.base >= 15).map((p) => p.name).join(", ") || "none";
      const playerList = t.players
        .map((p) => `${p.name} (${p.role}, ${p.country}, base:₹${p.base}Cr, sold:₹${p.soldFor}Cr)`)
        .join("; ") || "No players";

      return `TEAM: ${t.name}
Players (${t.players.length}): ${playerList}
Composition: Bat=${bats}, Bowl=${bowls}, AR=${ars}, WK=${wks}
Budget: ₹${t.spent.toFixed(1)}Cr of ₹${room.budget}Cr | Avg:₹${avg}Cr
Stars (base≥15Cr): ${stars}`;
    })
    .join("\n\n");

  const modeInstructions = analysisMode === "recent"
    ? `IMPORTANT: Base your analysis primarily on each player's RECENT FORM and performance in the last 3-4 years (2021–2025). Weight recent IPL seasons, T20 WC 2022 & 2024, and current fitness/form heavily.`
    : `Base your analysis on each player's COMPLETE CAREER history — total caps, career averages, consistency, peak performances, and overall legacy.`;

  const prompt = `You are an expert IPL cricket analyst. Analyze these ${room.teams.length} auction squads and rank them.
ANALYSIS MODE: ${analysisMode === "recent" ? "Recent Form (2021–2025)" : "Complete Career History"}
${modeInstructions}

${squadSummaries}

Rank from best to worst. Consider: squad balance, player quality, spending efficiency, depth, star power.

Respond ONLY with a valid JSON array. No markdown or extra text:
[{"team":"exact team name","rank":1,"score":88,"strengths":"2-3 key strengths","weaknesses":"1-2 weaknesses","verdict":"2 sentence verdict","mvp":"best player and why (1 sentence)"}]`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20251001",
        max_tokens: 2000,
        temperature:0.75,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const raw = data.content.map((c) => c.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const rankings = JSON.parse(clean);

    const enriched = rankings.map((r) => {
      const team = room.teams.find((t) => t.name === r.team);
      return { ...r, players: team ? team.players : [] };
    });

    res.json({ rankings: enriched, analysisMode });
  } catch (err) {
    console.error("AI ranking error:", err.message);
    const fallback = room.teams.map((t, i) => ({
      team: t.name,
      rank: i + 1,
      score: Math.max(40, 85 - i * 8),
      strengths: `${t.players.length} players acquired`,
      weaknesses: t.players.length < 5 ? "Thin squad depth" : "Hard to assess without AI",
      verdict: `${t.name} spent ₹${t.spent.toFixed(1)}Cr on ${t.players.length} players.`,
      mvp: t.players.length > 0
        ? `${t.players.sort((a, b) => b.soldFor - a.soldFor)[0].name} — highest price`
        : "None",
      players: t.players,
    }));
    res.json({ rankings: fallback, analysisMode, fallback: true });
  }
});

// ─── Socket.io real-time logic ────────────────────────────────────────────────
io.on("connection", (socket) => {
  // Join a room — everyone (including host) joins as a participant
  socket.on("join-room", ({ roomId, teamName, isHost, playerName }) => {
    const room = rooms[roomId];
    if (!room) { socket.emit("error", { message: "Room not found" }); return; }

    socket.join(roomId);
    socket.roomId = roomId;
    socket.teamName = teamName;
    socket.isHost = isHost;

    // Register team if not already there and slots are open
    if (teamName && !room.teams.find((t) => t.name === teamName)) {
      if (room.teams.length < room.numTeams) {
        room.teams.push({
          name: teamName,
          playerName: playerName || teamName,
          budget: room.budget,
          spent: 0,
          players: [],
          socketId: socket.id,
          isHost,
        });
      }
    } else if (teamName) {
      // Update socketId on reconnect
      const existing = room.teams.find((t) => t.name === teamName);
      if (existing) existing.socketId = socket.id;
    }

    socket.emit("room-state", sanitizeRoom(room));

    io.to(roomId).emit("lobby-update", buildLobbyUpdate(room));
  });

  // Host starts the auction
  socket.on("start-auction", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.teams.length < 2) {
      socket.emit("error", { message: "Need at least 2 teams to start" });
      return;
    }
    room.phase = "auction";
    room.currentPlayerIdx = 0;
    broadcastCurrentPlayer(roomId);
  });

  // Any participant bids
  socket.on("place-bid", ({ roomId, teamName, bidAmount }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== "auction") return;

    const team = room.teams.find((t) => t.name === teamName);
    if (!team) return;

    const remaining = team.budget - team.spent;
    if (remaining < bidAmount) {
      socket.emit("bid-rejected", { reason: "Insufficient budget" }); return;
    }
    if (bidAmount <= (room.currentBid || 0)) {
      socket.emit("bid-rejected", { reason: "Bid must be higher than current" }); return;
    }
    // Can't bid on yourself if you're leading (anti-spam)
    if (room.currentBidTeam === teamName) {
      socket.emit("bid-rejected", { reason: "You are already the highest bidder" }); return;
    }

    room.currentBid = bidAmount;
    room.currentBidTeam = teamName;

    // Reset timer on each new bid
    startBidTimer(roomId);

    io.to(roomId).emit("bid-update", {
      currentBid: room.currentBid,
      currentBidTeam: room.currentBidTeam,
      timerEnd: room.bidTimerEnd,
      teamBudgets: room.teams.map((t) => ({ name: t.name, remaining: t.budget - t.spent })),
    });
  });

  // Host forces end of auction (mark player sold at current bid or skip)
  socket.on("host-end-player", ({ roomId, action }) => {
    const room = rooms[roomId];
    if (!room) return;
    clearRoomTimer(roomId);
    if (action === "sold" && room.currentBidTeam) {
      finalizeSold(roomId);
    } else {
      finalizeUnsold(roomId);
    }
  });

  socket.on("disconnect", () => {
    // nothing — teams persist for reconnects
  });
});

// ─── Timer logic ──────────────────────────────────────────────────────────────

function startBidTimer(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  clearRoomTimer(roomId);

  room.bidTimerEnd = Date.now() + room.bidTime * 1000;

  // Broadcast timer start/reset to all clients
  io.to(roomId).emit("timer-update", { timerEnd: room.bidTimerEnd });

  room.timerInterval = setTimeout(() => {
    // Timer expired — auto-finalize
    if (room.currentBidTeam) {
      finalizeSold(roomId);
    } else {
      finalizeUnsold(roomId);
    }
  }, room.bidTime * 1000);
}

function clearRoomTimer(roomId) {
  const room = rooms[roomId];
  if (room && room.timerInterval) {
    clearTimeout(room.timerInterval);
    room.timerInterval = null;
  }
}

function finalizeSold(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  const player = room.players[room.currentPlayerIdx];
  const team = room.teams.find((t) => t.name === room.currentBidTeam);

  if (team && player) {
    team.spent += room.currentBid;
    team.players.push({ ...player, soldFor: room.currentBid });
    room.soldLog.push({ player: player.name, team: team.name, price: room.currentBid });

    io.to(roomId).emit("player-sold", {
      player: player.name,
      team: team.name,
      price: room.currentBid,
    });
  }

  advancePlayer(roomId);
}

function finalizeUnsold(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  const player = room.players[room.currentPlayerIdx];
  io.to(roomId).emit("player-unsold", { player: player.name });
  advancePlayer(roomId);
}

function advancePlayer(roomId) {
  const room = rooms[roomId];
  clearRoomTimer(roomId);
  room.currentPlayerIdx++;
  room.currentBid = null;
  room.currentBidTeam = null;
  room.bidTimerEnd = null;

  if (room.currentPlayerIdx >= room.players.length) {
    room.phase = "results";
    io.to(roomId).emit("auction-ended", { soldLog: room.soldLog });
  } else {
    broadcastCurrentPlayer(roomId);
  }
}

function broadcastCurrentPlayer(roomId) {
  const room = rooms[roomId];
  const player = room.players[room.currentPlayerIdx];
  room.currentBid = player.base;
  room.currentBidTeam = null;

  // Find next player preview
  const nextPlayer = room.players[room.currentPlayerIdx + 1] || null;

  io.to(roomId).emit("next-player", {
    player,
    nextPlayer: nextPlayer ? { name: nextPlayer.name, role: nextPlayer.role, country: nextPlayer.country, initials: nextPlayer.initials } : null,
    playerIdx: room.currentPlayerIdx,
    totalPlayers: room.players.length,
    currentBid: room.currentBid,
    teamBudgets: room.teams.map((t) => ({
      name: t.name,
      remaining: t.budget - t.spent,
      playerCount: t.players.length,
    })),
  });

  // Start the bid timer as soon as the player comes up
  startBidTimer(roomId);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildLobbyUpdate(room) {
  return {
    teams: room.teams.map((t) => ({
      name: t.name,
      playerName: t.playerName,
      budget: t.budget,
      spent: t.spent,
      playerCount: t.players.length,
      isHost: t.isHost,
    })),
    phase: room.phase,
    numTeams: room.numTeams,
  };
}

function sanitizeRoom(room) {
  return {
    id: room.id,
    hostName: room.hostName,
    hostTeam: room.hostTeam,
    budget: room.budget,
    analysisMode: room.analysisMode,
    bidTime: room.bidTime,
    numTeams: room.numTeams,
    phase: room.phase,
    teams: room.teams.map((t) => ({
      name: t.name,
      playerName: t.playerName,
      budget: t.budget,
      spent: t.spent,
      playerCount: t.players.length,
      isHost: t.isHost,
    })),
    currentPlayerIdx: room.currentPlayerIdx,
    totalPlayers: room.players.length,
    soldLog: room.soldLog,
  };
}

// Clean up rooms older than 2 hours
setInterval(() => {
  const twoHours = 2 * 60 * 60 * 1000;
  const now = Date.now();
  Object.keys(rooms).forEach((id) => {
    if (now - rooms[id].createdAt > twoHours) {
      clearRoomTimer(id);
      delete rooms[id];
    }
  });
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🏏 CricBid server running on http://localhost:${PORT}\n`);
});
