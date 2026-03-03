import { updateFlow, flushExpiredFlows } from "./flowAggregator.js";
import { extractFlowFeatures } from "./featureExtractor.js";
import { mlPredict } from "../../ml/mlBridge.js";
import { shouldLogThreat } from "./threatLogger.js";
import { sendThreat } from "./backendLogger.js";

export function handlePacket(packet) {
  updateFlow(packet);

  flushExpiredFlows(async (flow) => {
    try {
      // 1️⃣ Feature extraction
      const features = extractFlowFeatures(flow);

      // 2️⃣ ML inference
      const label = await mlPredict(features);
      

      // 3️⃣ LOG EVERY ML RESULT (NORMAL + ATTACK)
      console.log(
        `🧠 ML FLOW | ${label} | ${flow.src} → ${flow.dest} | Port ${flow.port} | Packets ${flow.fwdPackets}`
      );

      // 4️⃣ Log ONLY confirmed attacks to backend
      if (label !== "BENIGN" && shouldLogThreat(flow, label)) {
        const payload = {
          time: new Date().toLocaleTimeString(),
          src: flow.src,
          dest: flow.dest,
          attack: label,
          severity: "High",
          status: "Detected",
        };

        console.log(
          `🚨 ML CONFIRMED THREAT | ${label} | ${flow.src} → ${flow.dest}`
        );

        await sendThreat(payload);
      }
    } catch (err) {
      console.error("❌ FlowProcessor error:", err.message);
    }
  });
}
