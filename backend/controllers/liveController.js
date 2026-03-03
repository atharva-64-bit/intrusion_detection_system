// backend/controllers/liveController.js
const ips = [
  "192.168.1.10",
  "203.91.44.10",
  "88.12.44.231",
  "156.22.19.33",
  "142.250.77.46",
  "91.22.14.88",
  "34.110.22.80",
  "201.88.14.5",
  "103.44.99.18",
];

const threatsArr = [
  "Normal",
  "Normal",
  "Normal",
  "Normal",
  "Normal",
  "DoS",
  "DDoS",
  "Brute Force",
  "Port Scan",
  "XSS",
  "SQLi",
];

const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS"];

let packets = []; // in-memory last N packets
let lastId = 0;

// generate 1 random packet
function generatePacket() {
  const time = new Date().toLocaleTimeString();
  const src = ips[Math.floor(Math.random() * ips.length)];
  const dest = ips[Math.floor(Math.random() * ips.length)];
  const proto = protocols[Math.floor(Math.random() * protocols.length)];
  const port = Math.floor(Math.random() * 70000);
  const size = Math.floor(Math.random() * 1500) + 40;
  const threat = threatsArr[Math.floor(Math.random() * threatsArr.length)];

  lastId += 1;

  return {
    _id: lastId, // just an incrementing id for UI key
    time,
    src,
    dest,
    proto,
    port,
    size,
    threat,
    createdAt: new Date(),
  };
}

// start generator: push packet every 900ms
function startLiveGenerator() {
  setInterval(() => {
    const p = generatePacket();
    packets.push(p);
    if (packets.length > 200) {
      packets = packets.slice(-200);
    }
  }, 900);
}

// GET /api/live/packets  -> last 50
export const getLivePackets = (req, res) => {
  const last50 = packets.slice(-50);
  res.json(last50);
};

// GET /api/live/stats -> simple stats based on recent packets
export const getLiveStats = (req, res) => {
  const lastWindow = packets.slice(-50); // simple window

  const packetsPerSec = lastWindow.length > 0
    ? Math.floor(lastWindow.length / 5) + 1
    : 0;

  const threatsPerSec = lastWindow.filter(
    (p) => p.threat && p.threat !== "Normal"
  ).length;

  const cpuUsage = Math.floor(Math.random() * 30) + 10; // demo

  res.json({
    packetsPerSec,
    threatsPerSec,
    cpuUsage,
  });
};

export const initLive = () => {
  if (!packets.length) {
    // seed some initial packets
    for (let i = 0; i < 20; i++) {
      packets.push(generatePacket());
    }
  }
  startLiveGenerator();
};
