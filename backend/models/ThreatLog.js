import mongoose from "mongoose";

const threatLogSchema = new mongoose.Schema(
  {
    time: String,
    src: String,
    dest: String,
    attack: String,
    severity: String,
    status: String,

    // ⭐ Reputation info (AbuseIPDB)
    reputationScore: {
      type: Number,
      default: null,
    },
    reputationReports: {
      type: Number,
      default: 0,
    },
    reputationBlacklisted: {
      type: Boolean,
      default: false,
    },

    // ⭐ GeoIP info
    geoCountry: {
      type: String,
      default: null,
    },
    geoCity: {
      type: String,
      default: null,
    },
    geoLat: {
      type: Number,
      default: null,
    },
    geoLon: {
      type: Number,
      default: null,
    },

    // ⭐ WHOIS info
    whoisOrg: {
      type: String,
      default: null,
    },
    whoisCountry: {
      type: String,
      default: null,
    },
    whoisASN: {
      type: String,
      default: null,
    },
    whoisRegistrar: {
      type: String,
      default: null,
    },

    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ThreatLog = mongoose.model("ThreatLog", threatLogSchema);
export default ThreatLog;
