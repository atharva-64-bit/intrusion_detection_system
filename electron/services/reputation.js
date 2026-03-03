// electron/services/reputation.js
import axios from "axios";

const ABUSE_API_URL = "https://api.abuseipdb.com/api/v2/check";
const API_KEY = process.env.ABUSEIPDB_KEY;

export async function checkIPReputation(ip) {
  // skip if key missing
  if (!API_KEY) {
    console.warn("ABUSEIPDB_KEY missing in env, skipping reputation lookup.");
    return {
      score: null,
      isBlacklisted: false,
      totalReports: 0,
      lastReportedAt: null,
    };
  }

  // skip obvious private/local IPs
  if (!ip || /^10\.|^192\.168\.|^127\./.test(ip)) {
    return {
      score: null,
      isBlacklisted: false,
      totalReports: 0,
      lastReportedAt: null,
    };
  }

  try {
    const res = await axios.get(ABUSE_API_URL, {
      params: {
        ipAddress: ip,
        maxAgeInDays: 90,
      },
      headers: {
        Key: API_KEY,
        Accept: "application/json",
      },
      timeout: 4000,
    });

    const data = res.data?.data;
    if (!data) {
      return {
        score: null,
        isBlacklisted: false,
        totalReports: 0,
        lastReportedAt: null,
      };
    }

    return {
      score: data.abuseConfidenceScore ?? null,
      isBlacklisted: (data.abuseConfidenceScore ?? 0) >= 25,
      totalReports: data.totalReports ?? 0,
      lastReportedAt: data.lastReportedAt || null,
    };
  } catch (err) {
    console.error("AbuseIPDB lookup failed for", ip, "-", err.message);
    return {
      score: null,
      isBlacklisted: false,
      totalReports: 0,
      lastReportedAt: null,
    };
  }
}
