// room.js — Client-side logic for the auction room
// Everyone (including host) participates. Bidding is automatic via countdown timer.

const socket = io();

// ── State ──────────────────────────────────────────────────────────────────────
const state = {
  roomId: null,
  myTeam: null,
  myName: null,
  isHost: false,
  currentBid: 0,
  currentBidTeam: null,
  phase: "lobby",
  budget: 0,
  bidTime: 30,
  numTeams: 0,
  analysisMode: "career",
  teams: [],         // full team list with budgets
  myPlayers: [],     // my own squad
  mySpent: 0,
  soldLog: [],
  timerEnd: null,
  timerRAF: null,
  timerCircumference: 2 * Math.PI * 26, // matches SVG r=26
};

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const pathParts = window.location.pathname.split("/");
  state.roomId = pathParts[pathParts.length - 1];

  const params = new URLSearchParams(window.location.search);
  state.isHost = params.get("host") === "1";
  state.myName = params.get("name") || "";
  const myTeamParam = params.get("team") || "";

  document.getElementById("lobby-room-id").textContent = state.roomId;
  document.getElementById("auction-room-id").textContent = state.roomId;
  document.getElementById("lobby-invite-url").textContent =
    `${window.location.origin}/room/${state.roomId}`;

  // Pre-fill join form with URL params
  if (state.myName) {
    const nameEl = document.getElementById("join-name");
    if (nameEl) nameEl.value = state.myName;
  }

  // Setup timer ring
  const ringFill = document.getElementById("timer-ring-fill");
  if (ringFill) {
    ringFill.style.strokeDasharray = state.timerCircumference;
    ringFill.style.strokeDashoffset = 0;
  }

  fetchRoomData().then(() => {
    if (state.isHost && myTeamParam) {
      // Host auto-joins with their chosen team
      state.myTeam = myTeamParam;
      socket.emit("join-room", {
        roomId: state.roomId,
        teamName: myTeamParam,
        playerName: state.myName,
        isHost: true,
      });
      document.getElementById("host-controls").style.display = "block";
      document.getElementById("join-form").style.display = "none";
    } else if (!state.isHost) {
      document.getElementById("join-form").style.display = "block";
    }
  });
});

async function fetchRoomData() {
  try {
    const res = await fetch(`/api/room/${state.roomId}`);
    if (!res.ok) {
      document.body.innerHTML = `<div style="padding:3rem;text-align:center;font-family:sans-serif;color:#fff;background:#111;min-height:100vh;"><h2>Room not found</h2><p style="color:#aaa;">This room may have expired. <a href="/" style="color:#1D9E75;">Create a new one</a></p></div>`;
      return;
    }
    const room = await res.json();
    state.budget      = room.budget;
    state.numTeams    = room.numTeams;
    state.analysisMode = room.analysisMode;
    state.phase       = room.phase;
    state.bidTime     = room.bidTime || 30;
    state.soldLog     = room.soldLog || [];

    document.getElementById("lobby-budget").textContent  = `₹${room.budget} Crore`;
    document.getElementById("lobby-bid-time").textContent = `${room.bidTime}s per player`;
    document.getElementById("lobby-mode").textContent     =
      room.analysisMode === "recent" ? "🔥 Recent form (2021–2025)" : "📚 Complete career";
    document.getElementById("lobby-title").textContent    = `${room.hostName}'s Auction`;
    document.getElementById("lobby-player-count").textContent = `${room.totalPlayers} players`;

    if (room.phase === "results") {
      showPhase("results");
      triggerAIRanking();
    }
  } catch (e) {
    console.error("Failed to load room:", e);
  }
}

// ── Join room ──────────────────────────────────────────────────────────────────
function joinRoom() {
  const name = document.getElementById("join-name").value.trim();
  const team = document.getElementById("join-team").value.trim();
  if (!name || !team) { alert("Please enter your name and team name"); return; }

  state.myName = name;
  state.myTeam = team;

  socket.emit("join-room", {
    roomId: state.roomId,
    teamName: team,
    playerName: name,
    isHost: false,
  });

  document.getElementById("join-form").style.display = "none";
}

function startAuction() {
  socket.emit("start-auction", { roomId: state.roomId });
}

// ── Bidding ────────────────────────────────────────────────────────────────────
function placeBid() {
  if (!state.myTeam) { showToast("Join a team first", "error"); return; }

  // Can't outbid yourself
  if (state.currentBidTeam === state.myTeam) {
    showToast("You're already the highest bidder!", "error");
    return;
  }

  const myTeam = state.teams.find(t => t.name === state.myTeam);
  const remaining = myTeam ? (myTeam.budget - myTeam.spent) : 0;
  const nextBid = parseFloat((state.currentBid + 0.5).toFixed(1));

  if (remaining < nextBid) {
    showToast("Insufficient budget!", "error");
    return;
  }

  socket.emit("place-bid", {
    roomId: state.roomId,
    teamName: state.myTeam,
    bidAmount: nextBid,
  });
}

// Host override
function hostEndPlayer(action) {
  socket.emit("host-end-player", { roomId: state.roomId, action });
}

// ── Socket events ──────────────────────────────────────────────────────────────

socket.on("room-state", (room) => {
  state.budget  = room.budget;
  state.phase   = room.phase;
  state.bidTime = room.bidTime || 30;
  updateTeamsList(room.teams);
});

socket.on("lobby-update", ({ teams, phase, numTeams }) => {
  state.numTeams = numTeams;
  updateTeamsList(teams);
  document.getElementById("teams-count").textContent = `${teams.length} / ${numTeams}`;

  if (state.isHost) {
    const btn = document.getElementById("start-btn");
    if (teams.length >= 2) {
      btn.disabled = false;
      btn.textContent = `Start auction (${teams.length} teams) →`;
    } else {
      btn.disabled = true;
    }
  }
});

socket.on("next-player", ({ player, nextPlayer, playerIdx, totalPlayers, currentBid, teamBudgets }) => {
  showPhase("auction");
  state.currentBid    = currentBid;
  state.currentBidTeam = null;
  hideBanners();

  // Player card
  const rc = roleColor(player.role);
  const avatarEl = document.getElementById("player-avatar");
  avatarEl.textContent = player.initials;
  avatarEl.style.background = rc.bg;
  avatarEl.style.color = rc.text;
  document.getElementById("player-name").textContent     = player.name;
  const roleTag = document.getElementById("player-role-tag");
  roleTag.textContent = player.role;
  roleTag.className   = "role-tag role-" + player.role.toLowerCase().replace(/[- ]/g,"");
  document.getElementById("player-country").textContent   = player.country;
  document.getElementById("player-speciality").textContent = player.speciality || "";

  // Bid display
  document.getElementById("current-bid-amount").textContent = `₹${currentBid} Cr`;
  document.getElementById("current-bid-team").textContent   = "No bids — base price";

  // Progress
  const pct = (playerIdx / totalPlayers) * 100;
  document.getElementById("auction-progress").style.width = pct + "%";
  document.getElementById("auction-counter").textContent  = `Player ${playerIdx + 1} / ${totalPlayers}`;

  // Next player preview
  renderNextPlayer(nextPlayer);

  // Update teams
  updateTeams(teamBudgets);

  // Big bid button
  updateBidButton();

  // Host controls
  if (state.isHost) {
    document.getElementById("auction-host-controls").style.display = "flex";
    document.getElementById("host-sold-btn").disabled = true;
  }
});

socket.on("bid-update", ({ currentBid, currentBidTeam, timerEnd, teamBudgets }) => {
  state.currentBid    = currentBid;
  state.currentBidTeam = currentBidTeam;
  state.timerEnd      = timerEnd;

  document.getElementById("current-bid-amount").textContent = `₹${currentBid} Cr`;
  document.getElementById("current-bid-team").textContent   = `🔥 Leading: ${currentBidTeam}`;

  if (state.isHost) {
    document.getElementById("host-sold-btn").disabled = false;
  }

  updateTeams(teamBudgets);
  updateBidButton();
  flashBidAmount();
  startClientTimer(timerEnd);
});

socket.on("timer-update", ({ timerEnd }) => {
  state.timerEnd = timerEnd;
  startClientTimer(timerEnd);
});

socket.on("bid-rejected", ({ reason }) => {
  showToast(reason, "error");
});

socket.on("player-sold", ({ player, team, price }) => {
  const banner = document.getElementById("sold-banner");
  banner.textContent = `✅ ${player} → ${team} for ₹${price} Cr`;
  banner.style.display = "block";
  state.soldLog.push({ player, team, price });
  renderSoldLog();

  // Update my squad if it's mine
  if (team === state.myTeam) {
    state.mySpent += price;
    renderMySquadLog();
  }

  if (state.isHost) document.getElementById("host-sold-btn").disabled = true;
  stopClientTimer();
});

socket.on("player-unsold", ({ player }) => {
  const banner = document.getElementById("unsold-banner");
  banner.textContent = `❌ ${player} — unsold`;
  banner.style.display = "block";
  stopClientTimer();
});

socket.on("auction-ended", ({ soldLog }) => {
  state.soldLog = soldLog;
  stopClientTimer();
  showPhase("results");
  triggerAIRanking();
});

socket.on("error", ({ message }) => {
  showToast(message, "error");
});

// ── Client-side countdown timer ────────────────────────────────────────────────

function startClientTimer(timerEnd) {
  state.timerEnd = timerEnd;
  if (state.timerRAF) cancelAnimationFrame(state.timerRAF);
  tickTimer();
}

function stopClientTimer() {
  if (state.timerRAF) cancelAnimationFrame(state.timerRAF);
  state.timerRAF = null;
  document.getElementById("timer-number").textContent = "–";
  const fill = document.getElementById("timer-ring-fill");
  if (fill) fill.style.strokeDashoffset = 0;
}

function tickTimer() {
  const now = Date.now();
  const remaining = Math.max(0, state.timerEnd - now);
  const secs = Math.ceil(remaining / 1000);
  const frac = remaining / (state.bidTime * 1000); // 1 → 0

  const numEl = document.getElementById("timer-number");
  const fill  = document.getElementById("timer-ring-fill");

  if (numEl) {
    numEl.textContent = secs;
    numEl.className = "timer-number" + (secs <= 5 ? " timer-danger" : secs <= 10 ? " timer-warn" : "");
  }
  if (fill) {
    fill.style.strokeDashoffset = state.timerCircumference * (1 - frac);
    fill.style.stroke = secs <= 5 ? "#E24B4A" : secs <= 10 ? "#EF9F27" : "#1D9E75";
  }

  if (remaining > 0) {
    state.timerRAF = requestAnimationFrame(tickTimer);
  } else {
    stopClientTimer();
  }
}

// ── AI Ranking ─────────────────────────────────────────────────────────────────

async function triggerAIRanking() {
  const modeLabel = state.analysisMode === "recent"
    ? "🔥 Analyzing recent form (2021–2025)..."
    : "📚 Analyzing complete career history...";
  const modeEl = document.getElementById("ai-mode-label");
  if (modeEl) modeEl.textContent = modeLabel;
  const subEl = document.getElementById("results-mode-label");
  if (subEl) subEl.textContent = state.analysisMode === "recent"
    ? "AI ranked based on recent form (2021–2025)"
    : "AI ranked based on complete career history";

  try {
    const res = await fetch(`/api/rank/${state.roomId}`, { method: "POST" });
    const data = await res.json();
    renderRankings(data.rankings, data.analysisMode);
  } catch (e) {
    console.error("Ranking failed:", e);
    document.getElementById("ai-loading").innerHTML =
      `<p style="color:#c0392b;">AI ranking failed. Please refresh.</p>`;
  }
}

function renderRankings(rankings, mode) {
  document.getElementById("ai-loading").style.display  = "none";
  document.getElementById("rankings-wrap").style.display = "block";

  const medals  = ["🥇", "🥈", "🥉"];
  const modeLine = mode === "recent" ? "Recent form 2021–25" : "Career history";

  document.getElementById("rankings-list").innerHTML = rankings.map((r, i) => `
    <div class="ranking-card rank-pos-${i + 1}">
      <div class="rank-medal">${medals[i] || "#" + r.rank}</div>
      <div class="rank-score-badge">${r.score}<span>/100</span></div>
      <div class="rank-team">${r.team}</div>
      <div class="rank-mode-label">${modeLine}</div>
      <div class="rank-verdict">${r.verdict}</div>
      <div class="rank-detail-row">
        <div class="rank-detail">
          <div class="rank-detail-label">Strengths</div>
          <div class="rank-detail-val rank-strengths">${r.strengths}</div>
        </div>
        <div class="rank-detail">
          <div class="rank-detail-label">Weaknesses</div>
          <div class="rank-detail-val rank-weaknesses">${r.weaknesses}</div>
        </div>
      </div>
      <div class="rank-mvp"><span class="rank-mvp-label">MVP</span> ${r.mvp}</div>
      <div class="rank-players">
        ${(r.players || []).map(p => `<span class="player-chip player-chip-${p.role.toLowerCase().replace(/[- ]/g,"")}">${p.name} ₹${p.soldFor}Cr</span>`).join("")}
      </div>
    </div>
  `).join("");

  document.getElementById("squads-detail").innerHTML = rankings.map((r) => `
    <div class="squad-card">
      <div class="squad-header">
        <div class="squad-name">${r.team}</div>
        <div class="squad-spent">₹${(r.players||[]).reduce((s,p)=>s+p.soldFor,0).toFixed(1)} Cr spent</div>
      </div>
      <div class="squad-composition">
        ${["Batsman","Bowler","All-rounder","Wicketkeeper"].map(role=>{
          const count=(r.players||[]).filter(p=>p.role===role).length;
          return count>0?`<span class="comp-tag role-${role.toLowerCase().replace(/[- ]/g,"")}">${roleEmoji(role)} ${role.replace("All-rounder","AR").replace("Wicketkeeper","WK")} ×${count}</span>`:"";
        }).join("")}
      </div>
      <div class="squad-players">
        ${(r.players||[]).length===0
          ?`<p style="color:#999;font-size:13px;">No players acquired</p>`
          :(r.players||[]).map(p=>`
            <div class="squad-player-row">
              <span class="squad-player-initials" style="background:${roleColor(p.role).bg};color:${roleColor(p.role).text}">${p.initials}</span>
              <span class="squad-player-name">${p.name}</span>
              <span class="squad-player-role">${p.role}</span>
              <span class="squad-player-price">₹${p.soldFor} Cr</span>
            </div>
          `).join("")
        }
      </div>
    </div>
  `).join("");

  document.getElementById("full-log").innerHTML = `
    <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Price</th></tr></thead>
    <tbody>
      ${state.soldLog.map((s,i)=>`
        <tr>
          <td>${i+1}</td><td>${s.player}</td><td>${s.team}</td><td>₹${s.price} Cr</td>
        </tr>
      `).join("")}
    </tbody>
  `;
}

// ── Render helpers ─────────────────────────────────────────────────────────────

function updateTeamsList(teams) {
  state.teams = teams;
  const list = document.getElementById("teams-list");
  if (!list) return;

  if (teams.length === 0) {
    list.innerHTML = `<p class="empty-msg">No teams yet...</p>`;
    return;
  }
  list.innerHTML = teams.map((t) => `
    <div class="lobby-team-row">
      <div class="team-avatar">${t.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
      <div>
        <div class="team-row-name">${t.name} ${t.isHost ? '<span class="host-badge">Host</span>' : ""}</div>
        <div class="team-row-budget">${t.playerName || ""} · ₹${t.budget} Cr</div>
      </div>
      <div class="team-row-status">${t.name === state.myTeam ? '<span class="you-badge">You</span>' : ""}</div>
    </div>
  `).join("");

  // Sync my balance in auction
  syncMyBalance();
}

function updateTeams(teamBudgets) {
  // Sync state.teams with latest budgets
  teamBudgets.forEach(tb => {
    const t = state.teams.find(t => t.name === tb.name);
    if (t) { t.remaining = tb.remaining; t.playerCount = tb.playerCount; }
    else state.teams.push({ name: tb.name, remaining: tb.remaining, budget: state.budget });
  });

  const panel = document.getElementById("teams-bid-panel");
  if (!panel) return;

  panel.innerHTML = teamBudgets.map((t) => {
    const isLeading = t.name === state.currentBidTeam;
    const isMe      = t.name === state.myTeam;
    const pct       = Math.max(0, Math.min(100, (t.remaining / state.budget) * 100)).toFixed(0);
    return `
      <div class="bid-team-card ${isLeading ? "leading" : ""} ${isMe ? "my-team" : ""}">
        <div class="bid-team-top">
          <div class="bid-team-name">${t.name} ${isMe ? '<span class="you-badge">You</span>' : ""}</div>
          ${isLeading ? '<div class="leading-badge">🔥 Leading</div>' : ""}
        </div>
        <div class="bid-team-budget">₹${t.remaining.toFixed(1)} Cr left · ${t.playerCount||0} players</div>
        <div class="budget-bar-wrap">
          <div class="budget-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join("");

  syncMyBalance();
}

function syncMyBalance() {
  if (!state.myTeam) return;
  const mine = state.teams.find(t => t.name === state.myTeam);
  if (!mine) return;
  const rem = mine.remaining !== undefined ? mine.remaining : (mine.budget - mine.spent);
  if (!isNaN(rem)) {
    document.getElementById("my-balance-display").textContent = `₹${rem.toFixed(1)} Cr`;
    document.getElementById("sidebar-my-balance").textContent = `₹${rem.toFixed(1)} Cr left`;
  }
}

function updateBidButton() {
  const btn        = document.getElementById("big-bid-btn");
  const amountEl   = document.getElementById("big-bid-next-amount");
  const nextBid    = parseFloat((state.currentBid + 0.5).toFixed(1));
  const isLeading  = state.currentBidTeam === state.myTeam;
  const myTeam     = state.teams.find(t => t.name === state.myTeam);
  const remaining  = myTeam ? (myTeam.remaining !== undefined ? myTeam.remaining : (myTeam.budget - myTeam.spent)) : 0;
  const canAfford  = remaining >= nextBid;

  amountEl.textContent = `₹${nextBid} Cr`;

  if (!state.myTeam) {
    btn.disabled = true;
    btn.classList.remove("btn-leading","btn-disabled");
    btn.classList.add("btn-disabled");
    return;
  }
  if (isLeading) {
    btn.disabled = true;
    btn.classList.add("btn-leading");
    btn.classList.remove("btn-disabled");
    document.getElementById("big-bid-label") && (document.querySelector(".big-bid-label").textContent = "LEADING");
  } else {
    document.querySelector(".big-bid-label") && (document.querySelector(".big-bid-label").textContent = "BID");
    btn.disabled  = !canAfford;
    btn.classList.remove("btn-leading");
    btn.classList.toggle("btn-disabled", !canAfford);
  }
}

function renderMySquadLog() {
  const soldForMe = state.soldLog.filter(s => s.team === state.myTeam);
  const listEl = document.getElementById("my-squad-list");
  if (!listEl) return;

  if (soldForMe.length === 0) {
    listEl.innerHTML = `<p class="empty-msg-sm">No players yet...</p>`;
    return;
  }
  listEl.innerHTML = soldForMe.map(s => `
    <div class="my-squad-row">
      <span class="my-squad-player">${s.player}</span>
      <span class="my-squad-price">₹${s.price}Cr</span>
    </div>
  `).join("");

  // Update label
  const labelEl = document.getElementById("my-team-label");
  if (labelEl && state.myTeam) labelEl.textContent = state.myTeam;
}

function renderNextPlayer(nextPlayer) {
  const el = document.getElementById("next-player-preview");
  if (!el) return;
  if (!nextPlayer) {
    el.innerHTML = `<span class="empty-msg-sm">Last player</span>`;
    return;
  }
  const rc = roleColor(nextPlayer.role);
  el.innerHTML = `
    <div class="next-player-inner">
      <div class="next-avatar" style="background:${rc.bg};color:${rc.text}">${nextPlayer.initials}</div>
      <div>
        <div class="next-name">${nextPlayer.name}</div>
        <div class="next-meta">${nextPlayer.country} · ${nextPlayer.role}</div>
      </div>
    </div>
  `;
}

function renderSoldLog() {
  const log = document.getElementById("sold-log");
  if (!log) return;
  log.innerHTML = [...state.soldLog].reverse().slice(0, 8).map(s => `
    <div class="log-row ${s.team === state.myTeam ? "log-mine" : ""}">
      <span class="log-player">${s.player}</span>
      <span class="log-arrow">→</span>
      <span class="log-team">${s.team}</span>
      <span class="log-price">₹${s.price}Cr</span>
    </div>
  `).join("");

  // Also refresh my squad
  renderMySquadLog();
}

// ── UI helpers ─────────────────────────────────────────────────────────────────

function showPhase(phase) {
  document.querySelectorAll(".phase").forEach(p => p.classList.remove("active"));
  document.getElementById(`phase-${phase}`).classList.add("active");
  state.phase = phase;
}

function hideBanners() {
  document.getElementById("sold-banner").style.display   = "none";
  document.getElementById("unsold-banner").style.display = "none";
}

function flashBidAmount() {
  const el = document.getElementById("current-bid-amount");
  el.classList.add("bid-flash");
  setTimeout(() => el.classList.remove("bid-flash"), 600);
}

function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add("fade-out"); setTimeout(() => toast.remove(), 400); }, 2500);
}

function copyLobbyLink() {
  const url = `${window.location.origin}/room/${state.roomId}`;
  navigator.clipboard.writeText(url).then(() => showToast("Link copied!", "success"));
}

function roleColor(role) {
  const map = {
    "Batsman":      { bg: "#162233", text: "#5a9fd4" },
    "Bowler":       { bg: "#0e2118", text: "#4cb58a" },
    "All-rounder":  { bg: "#231a0c", text: "#c9872a" },
    "Wicketkeeper": { bg: "#22101a", text: "#c47a9a" },
  };
  return map[role] || { bg: "#1a1a1a", text: "#aaa" };
}

function roleEmoji(role) {
  return { "Batsman":"🏏","Bowler":"⚡","All-rounder":"⭐","Wicketkeeper":"🧤" }[role] || "";
}