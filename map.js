// Pan/zoom viewer for the supplied map image (mouse, wheel, touch pinch, buttons).
const MapView = (() => {
  let s = 1, x = 0, y = 0;
  const vp = () => document.getElementById("mapViewport"), img = () => document.getElementById("mapImg");
  const apply = () => { img().style.transform = `translate(${x}px,${y}px) scale(${s})`; };
  function fit() { const v = vp(), i = img(); if (!i.naturalWidth || !v.clientWidth) return;
    i.style.width = i.naturalWidth + "px"; s = Math.min(v.clientWidth / i.naturalWidth, v.clientHeight / i.naturalHeight);
    x = (v.clientWidth - i.naturalWidth * s) / 2; y = (v.clientHeight - i.naturalHeight * s) / 2; apply(); }
  function zoom(f, cx, cy) { const r = vp().getBoundingClientRect(); cx ??= r.width / 2; cy ??= r.height / 2;
    const ns = Math.min(6, Math.max(0.2, s * f)); x = cx - (cx - x) * ns / s; y = cy - (cy - y) * ns / s; s = ns; apply(); }
  function init() { const v = vp(), i = img(); i.onload = fit; if (i.complete) fit();
    const pts = new Map(); let drag = null, pinch = 0;
    v.addEventListener("pointerdown", e => { v.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); drag = { px: e.clientX - x, py: e.clientY - y }; });
    v.addEventListener("pointermove", e => { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
      if (pts.size === 2) { const [a, b] = [...pts.values()], r = v.getBoundingClientRect(), d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinch) zoom(d / pinch, (a.clientX + b.clientX) / 2 - r.left, (a.clientY + b.clientY) / 2 - r.top); pinch = d; }
      else if (drag) { x = e.clientX - drag.px; y = e.clientY - drag.py; apply(); } });
    const end = e => { pts.delete(e.pointerId); pinch = 0; const f = [...pts.values()][0]; drag = f ? { px: f.clientX - x, py: f.clientY - y } : null; };
    v.addEventListener("pointerup", end); v.addEventListener("pointercancel", end);
    v.addEventListener("wheel", e => { e.preventDefault(); const r = v.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.15 : 0.87, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    document.getElementById("zoomIn").onclick = () => zoom(1.3);
    document.getElementById("zoomOut").onclick = () => zoom(1 / 1.3);
    document.getElementById("zoomFit").onclick = fit; window.addEventListener("resize", fit); }
  return { init, fit };
})();
