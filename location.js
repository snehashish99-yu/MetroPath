const toRad = d => d * Math.PI / 180;
function haversineKm(a, b) {
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}
function nearestStations(pos, n = 3) {
  return Object.entries(COORDS).map(([name, c]) => ({ name, km: haversineKm(pos, c) }))
    .sort((a, b) => a.km - b.km).slice(0, n);
}
function locateUser() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Location is not supported in this browser."));
    navigator.geolocation.getCurrentPosition(
      p => resolve([p.coords.latitude, p.coords.longitude]),
      e => reject(new Error(e.code === 1 ? "Location permission was denied. You can still use the map and route planner." : "Couldn't get your location. Try again.")),
      { enableHighAccuracy: true, timeout: 10000 });
  });
}
