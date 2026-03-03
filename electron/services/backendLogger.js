import axios from "axios";

const API_URL = "http://localhost:5000/api/internal/threats";
const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

export async function sendThreat(payload) {
  try {
    await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": INTERNAL_KEY,
      },
      timeout: 4000,
    });

    console.log("📝 Threat logged:", payload.attack, payload.src);
  } catch (err) {
    console.error("❌ Threat logging failed:", err.message);
  }
}
