// electron/services/threatLogger.js

const COOLDOWN_MS = 60_000; // 1 minute per IP + attack
const recentIncidents = new Map();

/**
 * Decide whether this threat should be logged
 */
export function shouldLogThreat(flow, label) {
  const key = `${flow.src}-${label}`;
  const now = Date.now();

  const lastTime = recentIncidents.get(key);

  if (lastTime && now - lastTime < COOLDOWN_MS) {
    return false; // ⛔ cooldown active
  }

  recentIncidents.set(key, now);
  return true;
}
