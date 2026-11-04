const TRANSFER_MINS = 4; // ESTIMATED walking time per line change
const graph = new Graph();
const stationLines = new Map(); // name -> [line keys]
for (const [key, L] of Object.entries(LINES)) {
  L.stations.forEach((s, i) => {
    graph.addNode(s);
    if (!stationLines.has(s)) stationLines.set(s, []);
    stationLines.get(s).push(key);
    if (i > 0) graph.addEdge(L.stations[i - 1], s, L.mins, L.km, key);
  });
}
const allStations = [...stationLines.keys()].sort((a, b) => a.localeCompare(b));
const isInterchange = s => (stationLines.get(s) || []).length > 1;

// Station search (case-insensitive substring, prefix matches first)
function searchStations(q) {
  q = q.trim().toLowerCase(); if (!q) return allStations;
  const hits = allStations.filter(s => s.toLowerCase().includes(q));
  return hits.sort((a, b) => a.toLowerCase().startsWith(q) === b.toLowerCase().startsWith(q) ? 0 : a.toLowerCase().startsWith(q) ? -1 : 1);
}

// Dijkstra with predecessor map; weight = estimated minutes between adjacent stations.
function dijkstra(g, src, dst) {
  const dist = new Map(), prev = new Map(), heap = new MinHeap();
  for (const n of g.adj.keys()) dist.set(n, Infinity);
  dist.set(src, 0); heap.push([0, src]);
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d > dist.get(u)) continue;
    if (u === dst) break;
    for (const e of g.neighbors(u)) {
      const nd = d + e.mins;
      if (nd < dist.get(e.to)) { dist.set(e.to, nd); prev.set(e.to, { from: u, edge: e }); heap.push([nd, e.to]); }
    }
  }
  if (dist.get(dst) === Infinity) return null;
  const path = [dst], edges = [];
  for (let c = dst; prev.has(c);) { const p = prev.get(c); edges.unshift(p.edge); path.unshift(p.from); c = p.from; }
  return { path, edges };
}

function planRoute(from, to) {
  if (!graph.adj.has(from) || !graph.adj.has(to)) return { error: "Choose stations from the list." };
  if (from === to) return { error: "Pick two different stations." };
  const r = dijkstra(graph, from, to);
  if (!r) return { error: "No route found between these stations." };
  const legs = [];
  r.edges.forEach((e, i) => {
    const last = legs[legs.length - 1];
    if (last && last.line === e.line) { last.to = r.path[i + 1]; last.stops++; }
    else legs.push({ line: e.line, from: r.path[i], to: r.path[i + 1], stops: 1 });
  });
  const transfers = legs.slice(1).map(l => l.from);
  const ride = r.edges.reduce((s, e) => s + e.mins, 0);
  return { ...r, legs, transfers, stops: r.path.length - 1,
    mins: Math.round(ride + transfers.length * TRANSFER_MINS),
    km: +r.edges.reduce((s, e) => s + e.km, 0).toFixed(1) };
}
