const $ = id => document.getElementById(id);
let current = null, progress = 0, journeyOn = false;
const lineChip = k => `<span class="chip" style="background:${LINES[k].color}">${LINES[k].name}</span>`;
const stationColor = (path, i) => LINES[current.edges[Math.min(i, current.edges.length - 1)].line].color;

$("stationList").innerHTML = allStations.map(s => `<option value="${s}">`).join("");

// Navigation
function show(v) {
  document.querySelectorAll(".view").forEach(e => e.classList.toggle("active", e.id === v));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
  if (v === "map") MapView.fit();
}
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => show(b.dataset.v));

// Home
$("swap").onclick = () => { [$("from").value, $("to").value] = [$("to").value, $("from").value]; };
$("q").addEventListener("change", () => { if (allStations.includes($("q").value)) { $("to").value = $("q").value; $("q").value = ""; } });
$("findRoute").onclick = () => {
  $("homeErr").textContent = "";
  const r = planRoute($("from").value.trim(), $("to").value.trim());
  if (r.error) { $("homeErr").textContent = r.error; return; }
  current = r; progress = 0; journeyOn = false; saveRecent(r.path[0], r.path.at(-1)); renderRoute(); show("routes");
};

// Recents (localStorage, wrapped in try/catch)
function recents() { try { return JSON.parse(localStorage.getItem("mp_recent") || "[]"); } catch { return []; } }
function saveRecent(a, b) { try { const l = recents().filter(r => r.a !== a || r.b !== b); l.unshift({ a, b }); localStorage.setItem("mp_recent", JSON.stringify(l.slice(0, 4))); } catch {} renderRecents(); }
function renderRecents() {
  const l = recents();
  $("recents").innerHTML = l.length ? `<div class="card">${l.map((r, i) => `<div class="row" data-i="${i}"><span>${r.a} → ${r.b}</span><small>Plan again</small></div>`).join("")}</div>`
    : `<div class="empty">Your recent journeys will show up here.</div>`;
  $("recents").querySelectorAll(".row").forEach(e => e.onclick = () => { const r = l[e.dataset.i]; $("from").value = r.a; $("to").value = r.b; $("findRoute").click(); });
}
$("clearRecents").onclick = () => { try { localStorage.removeItem("mp_recent"); } catch {} renderRecents(); };

// Route + journey details
function renderRoute() {
  const out = $("routeOut");
  if (!current) { out.innerHTML = `<div class="empty">No route yet.<br>Pick two stations on Home and tap Find Route.</div>`; return; }
  const r = current, last = r.path.length - 1;
  const instr = r.legs.map((l, i) => `<div class="leg">${i ? "🔁" : "🚇"}<div>${i ? `Change at <b>${l.from}</b> and take ` : "Take "}${lineChip(l.line)} from <b>${l.from}</b> to <b>${l.to}</b> (${l.stops} stop${l.stops > 1 ? "s" : ""})</div></div>`).join("");
  const remainMins = Math.round(r.edges.slice(progress).reduce((s, e) => s + e.mins, 0) + r.transfers.filter(t => r.path.indexOf(t) > progress).length * TRANSFER_MINS);
  const list = r.path.map((s, i) => {
    const lc = LINES[r.edges[Math.min(i, r.edges.length - 1)].line].color;
    const cls = [isInterchange(s) ? "ix" : "", journeyOn && i < progress ? "done" : "", journeyOn && i === progress ? "now" : ""].join(" ");
    return `<li class="${cls}" style="--lc:${lc}">${s}${r.transfers.includes(s) ? " · change line" : ""}</li>`; }).join("");
  const jp = journeyOn ? `<div class="card" style="margin-top:14px"><b>${progress >= last ? "You have arrived" : "Next: " + r.path[progress + 1]}</b>
    <div class="prog"><i style="width:${progress / last * 100}%"></i></div>
    <small class="muted">${progress} of ${last} stops · about ${progress >= last ? 0 : remainMins} min left (estimate)</small>
    ${progress < last ? `<button class="btn" id="advance" style="margin-top:10px">I reached ${r.path[progress + 1]}</button>` : ""}</div>` : "";
  out.innerHTML = `<div class="card"><b>${r.path[0]} → ${r.path[last]}</b>
    <div class="stats"><div><b>${r.mins}</b><small>min</small></div><div><b>${r.stops}</b><small>stops</small></div><div><b>${r.km}</b><small>km</small></div><div><b>${r.transfers.length}</b><small>changes</small></div></div>
    ${instr}<p class="muted">Time and distance are estimates, not live data.</p>
    <button class="btn" id="startJ">${journeyOn ? "Restart journey" : "Start journey"}</button></div>${jp}
    <h2>Stations</h2><ul class="tl card">${list}</ul>`;
  $("startJ").onclick = () => { journeyOn = true; progress = 0; renderRoute(); };
  if ($("advance")) $("advance").onclick = () => { progress++; renderRoute(); };
}

// Nearby
$("findNearby").onclick = async () => {
  const btn = $("findNearby"), o = $("nearbyOut"); btn.disabled = true; btn.textContent = "Locating…"; o.innerHTML = "";
  try {
    const n = nearestStations(await locateUser());
    o.innerHTML = n.map((s, i) => `<div class="row" data-s="${s.name}"><span><b>${s.name}</b>${i ? "" : " · nearest"}</span><small>${s.km.toFixed(1)} km</small></div>`).join("") + `<p class="muted">Straight-line distance to approximate station positions.</p>`;
    o.querySelectorAll(".row").forEach(e => e.onclick = () => { $("from").value = e.dataset.s; });
  } catch (e) { o.innerHTML = `<p class="err" role="alert">${e.message}</p>`; }
  btn.disabled = false; btn.textContent = "Find Nearby Metro";
};

// Map: station search + selection
function pickStation(s) {
  const sh = $("mapSheet"), ks = stationLines.get(s);
  sh.hidden = false;
  sh.innerHTML = `<b>${s}</b> ${isInterchange(s) ? "· Interchange" : ""}<div style="margin-top:8px">${ks.map(lineChip).join(" ")}</div>
    <div class="btns"><button class="btn ghost" id="asFrom">Set as From</button><button class="btn" id="asTo">Set as To</button></div>`;
  $("asFrom").onclick = () => { $("from").value = s; show("home"); };
  $("asTo").onclick = () => { $("to").value = s; show("home"); };
}
$("mapSearch").addEventListener("change", e => { const v = e.target.value.trim(); const m = allStations.find(s => s.toLowerCase() === v.toLowerCase()) || searchStations(v)[0]; if (v && m) { e.target.value = m; pickStation(m); } });

MapView.init(); renderRecents(); renderRoute();
