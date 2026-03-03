import { execSync } from "child_process";

export function getBestInterface() {
  const output = execSync("tshark -D", { encoding: "utf-8" });

  const lines = output.split("\n").map(l => l.trim()).filter(Boolean);

  // Priority order
  const preferred = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      lower.includes("loopback") ||
      lower.includes("local area connection") ||
      lower.includes("vethernet") ||
      lower.includes("etwdump")
    ) {
      continue; // ignore junk interfaces
    }

    if (lower.includes("wi-fi") || lower.includes("wifi")) {
      preferred.unshift(line); // highest priority
    } else if (lower.includes("ethernet")) {
      preferred.push(line);
    } else if (lower.includes("vpn") || lower.includes("tun")) {
      preferred.push(line);
    }
  }

  if (!preferred.length) {
    throw new Error("No valid network interface found");
  }

  // Extract interface number (before dot)
  return preferred[0].split(".")[0];
}
