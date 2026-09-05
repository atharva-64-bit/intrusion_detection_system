import { updateFlow, flushExpiredFlows } from "./flowAggregator.js";
import { extractFlowFeatures } from "./featureExtractor.js";
import { mlPredict } from "../../ml/mlBridge.js";
import { shouldLogThreat } from "./threatLogger.js";
import { sendThreat } from "./backendLogger.js";

export function handlePacket(packet) {
  updateFlow(packet);

  flushExpiredFlows(async (flow) => {
    try {
      const totalPackets = flow.fwdPackets + flow.bwdPackets;
      const totalBytes = flow.fwdBytes + flow.bwdBytes;
      const flowDuration = flow.lastSeen - flow.startTime;

      // ❌ Ignore tiny flows
      if (totalPackets < 8) return;

      // ❌ Ignore low data flows
      if (totalBytes < 4000) return;

      // ❌ Ignore very short flows
      if (flowDuration < 5000) return;

      // ❌ Ignore common browser traffic (reduce false positives)
      if ((flow.port === 80 || flow.port === 443) && totalPackets < 20) return;

      // 1️⃣ Feature extraction
      const features = extractFlowFeatures(flow);

      // 2️⃣ ML inference
      const label = await mlPredict(features);

      // 3️⃣ Debug log
      console.log(
        `🧠 ML FLOW | ${label} | ${flow.src} → ${flow.dest} | Port ${flow.port} | Packets ${totalPackets}`
      );

      // 4️⃣ STRICT threat filtering (VERY IMPORTANT)
      if (
        label !== "BENIGN" &&
        shouldLogThreat(flow, label) &&
        totalPackets > 10 &&
        totalBytes > 8000
      ) {
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