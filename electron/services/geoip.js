// electron/services/geoip.js
import maxmind from "maxmind";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "GeoLite2-City.mmdb");

let geo;
try {
  geo = await maxmind.open(dbPath);
  console.log("GeoIP database loaded.");
} catch (err) {
  console.error("Failed loading GeoIP DB:", err);
}

export function lookupIP(ip) {
  if (!geo) return null;

  // skip local networks
  if (/^10\.|^192\.168\.|^127\./.test(ip)) return null;

  const data = geo.get(ip);
  if (!data) return null;

  return {
    country: data.country?.names?.en || "Unknown",
    city: data.city?.names?.en || "Unknown",
    latitude: data.location?.latitude || null,
    longitude: data.location?.longitude || null,
  };
}
