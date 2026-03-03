import ThreatLog from "../models/ThreatLog.js";

export const getSummary = async (req, res) => {
  try {
    const { range = "24h" } = req.query;

    const now = new Date();
    let from = new Date(now);

    if (range === "7d") {
      from.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      from.setDate(now.getDate() - 30);
    } else {
      from.setHours(now.getHours() - 24);
    }

    const logs = await ThreatLog.find({
      user: req.user._id,
      createdAt: { $gte: from },
    }).lean();

    const totalThreats = logs.length;
    const blocked = logs.filter((l) => l.status === "Blocked").length;
    const manual = logs.filter((l) => l.status !== "Blocked").length;

    // derive "packets analyzed" from threats (for now)
    const totalPackets = totalThreats * 20;

    // severity counts
    const severityDistribution = { High: 0, Medium: 0, Low: 0 };
    logs.forEach((l) => {
      if (severityDistribution[l.severity] !== undefined) {
        severityDistribution[l.severity]++;
      }
    });

    // attack categories
    const categoryMap = {};
    logs.forEach((l) => {
      categoryMap[l.attack] = (categoryMap[l.attack] || 0) + 1;
    });
    const attackCategories = Object.entries(categoryMap).map(
      ([attack, count]) => ({ attack, count })
    );

    // top malicious IPs (by src)
    const ipMap = {};
    logs.forEach((l) => {
      if (!ipMap[l.src]) {
        ipMap[l.src] = {
          ip: l.src,
          count: 0,
          attacksCount: {},
        };
      }
      ipMap[l.src].count++;
      ipMap[l.src].attacksCount[l.attack] =
        (ipMap[l.src].attacksCount[l.attack] || 0) + 1;
    });

    let topIps = Object.values(ipMap).map((entry) => {
      let primaryAttack = null;
      let max = 0;
      Object.entries(entry.attacksCount).forEach(([attack, c]) => {
        if (c > max) {
          max = c;
          primaryAttack = attack;
        }
      });
      return {
        ip: entry.ip,
        count: entry.count,
        attacks: primaryAttack || "Unknown",
        country: "Unknown", // placeholder, later from geoip
      };
    });

    topIps.sort((a, b) => b.count - a.count);
    topIps = topIps.slice(0, 5);

    res.json({
      metrics: {
        totalPackets,
        totalThreats,
        blocked,
        manual,
      },
      attackCategories,
      severityDistribution,
      topIps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating reports" });
  }
};
