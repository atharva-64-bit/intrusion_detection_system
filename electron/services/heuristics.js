// electron/services/heuristics.js

const WINDOW_MS = 5000;        // 5 sec window
const RATE_THRESHOLD = 100;   // packets per window
const PORT_SCAN_THRESHOLD = 20;

const ipStats = new Map();

function isPrivateIP(ip) {
  return /^10\.|^192\.168\.|^127\./.test(ip);
}

export function heuristicCheck(packet) {
  const { src, port } = packet;

  if (!src || isPrivateIP(src)) return null;

  const now = Date.now();

  if (!ipStats.has(src)) {
    ipStats.set(src, { count: 0, ports: new Set(), start: now });
  }

  const stat = ipStats.get(src);

  // reset window
  if (now - stat.start > WINDOW_MS) {
    stat.count = 0;
    stat.ports.clear();
    stat.start = now;
  }

  stat.count++;
  if (port && port !== "-") stat.ports.add(port);

  // 🚨 Rate-based detection
  if (stat.count >= RATE_THRESHOLD) {
    return { type: "RateSpike", severity: "High" };
  }

  // 🚨 Port scanning
  if (stat.ports.size >= PORT_SCAN_THRESHOLD) {
    return { type: "PortScan", severity: "Medium" };
  }

  return null; // not suspicious
}
