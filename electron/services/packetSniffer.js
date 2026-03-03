import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;
import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import { handlePacket } from "./flowProcessor.js";
import { heuristicCheck } from "./heuristics.js";

export let tsharkProcess = null;


export function startSniffer(interfaceIndex = "5") {
  if (tsharkProcess) return;

  tsharkProcess = spawn("tshark", [
    "-l",
    "-i", interfaceIndex,
    "-T", "fields",
    "-e", "frame.time_epoch",
    "-e", "ip.src",
    "-e", "ip.dst",
    "-e", "tcp.dstport",
    "-e", "udp.dstport",
    "-e", "frame.len",
    "-e", "tcp.flags",
    "-E", "separator=|",
  ]);

  tsharkProcess.stdout.on("data", (data) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (!win) return;

    for (const line of data.toString().trim().split("\n")) {
      const [ts, src, dest, tcpPort, udpPort, size, flags] = line.split("|");
      if (!src || !dest) continue;

      const packet = {
        time: Number(ts) * 1000,
        src,
        dest,
        proto: tcpPort ? "TCP" : "UDP",
        port: Number(tcpPort || udpPort || 0),
        size: Number(size) || 0,
        flags: flags ? Number(flags) : 0,
      };

      handlePacket(packet);

      const h = heuristicCheck(packet);
      win.webContents.send("live-packet", {
        time: new Date().toLocaleTimeString(),
        ...packet,
        threat: h ? h.type : "Normal",
      });
    }
  });
}
