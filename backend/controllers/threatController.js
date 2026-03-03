import ThreatLog from "../models/ThreatLog.js";
import { checkIPReputation } from "../../electron/services/reputation.js";
import { lookupIP } from "../../electron/services/geoip.js";
import { lookupWHOIS } from "../../electron/services/whois.js";

export const getThreats = async (req, res) => {
  try {
    const logs = await ThreatLog.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};

export const addThreat = async (req, res) => {
  try {
    const { src } = req.body;

    // ⭐ Reputation Check (AbuseIPDB)
    const rep = await checkIPReputation(src);
    console.log("Reputation for", src, rep);

    // ⭐ GeoIP Lookup
    const geo = lookupIP(src);
    console.log("GeoIP for", src, geo);

    // ⭐ WHOIS Lookup
    const whoisData = await lookupWHOIS(src);
    console.log("WHOIS for", src, whoisData);

    // ⭐ Create threat log with all enrichment fields
    const log = await ThreatLog.create({
      ...req.body,

      // Reputation fields
      reputationScore: rep.score,
      reputationReports: rep.totalReports,
      reputationBlacklisted: rep.isBlacklisted,

      // GeoIP fields
      geoCountry: geo?.country || null,
      geoCity: geo?.city || null,
      geoLat: geo?.latitude || null,
      geoLon: geo?.longitude || null,

      // WHOIS fields
      whoisOrg: whoisData?.org || null,
      whoisCountry: whoisData?.country || null,
      whoisASN: whoisData?.asn || null,
      whoisRegistrar: whoisData?.registrar || null,

      user: req.user._id,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("Error adding log", err);
    res.status(500).json({ message: "Error adding log" });
  }
};

export const deleteThreat = async (req, res) => {
  try {
    await ThreatLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
};
