import ThreatLog from "../models/ThreatLog.js";

export const addThreatInternal = async (req, res) => {
  try {
    const log = await ThreatLog.create({
      ...req.body,
      user: process.env.SYSTEM_USER_ID,
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Internal log failed" });
  }
};
