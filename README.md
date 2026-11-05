# MetroPath — Kolkata Metro navigation 

## Run (Windows 11 + VS Code)
1. Install VS Code, then the **Live Server** extension (Ritwick Dey).
2. File → Open Folder → select the `MetroPath` folder.
3. Right-click `index.html` → **Open with Live Server** (or click **Go Live**).
4. Browser opens at `http://127.0.0.1:5500`. Allow location only when you tap *Find Nearby Metro*.

## DSA used
- `js/graph.js`: adjacency-list graph (stations = vertices, hops = weighted edges) and a binary min-heap.
- `js/route.js`: Dijkstra with predecessor map and path reconstruction; station search.
- `js/location.js`: Haversine distance for nearest station.

## Data honesty
- **From the map image:** station names, order on each line, interchanges.
- **Estimated:** minutes and km per hop (one average per line), 4 min per line change, approximate coordinates for ~25 stations.
- No live train data. Edit `data/stations.js` to refine values.
- Please compare station order against your map once (e.g. Kavi Nazrul / Gitanjali).
