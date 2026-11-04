// Weighted undirected graph (adjacency list) + binary min-heap priority queue.
class Graph {
  constructor() { this.adj = new Map(); }
  addNode(n) { if (!this.adj.has(n)) this.adj.set(n, []); }
  addEdge(a, b, mins, km, line) {
    this.addNode(a); this.addNode(b);
    this.adj.get(a).push({ to: b, mins, km, line });
    this.adj.get(b).push({ to: a, mins, km, line });
  }
  neighbors(n) { return this.adj.get(n) || []; }
}
class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(item) { const a = this.a; a.push(item); let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0;
      for (;;) { let l = 2 * i + 1, r = l + 1, m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } }
    return top; }
}
