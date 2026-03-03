const TIMEOUT = 60000;
const flows = new Map();
const keyOf = p => `${p.src}-${p.dest}-${p.proto}`;

export function updateFlow(p) {
  const now = p.time || Date.now();
  let f = flows.get(keyOf(p));

  if (!f) {
    f = {
      src: p.src, dest: p.dest, proto: p.proto, port: p.port,
      startTime: now, lastSeen: now,
      fwdPackets: 0, bwdPackets: 0,
      fwdBytes: 0, bwdBytes: 0,
      fwdLens: [], bwdLens: [],
      times: [],
      flags: { FIN:0,SYN:0,RST:0,PSH:0,ACK:0,URG:0,ECE:0,CWR:0 },
    };
    flows.set(keyOf(p), f);
  }

  f.lastSeen = now;
  f.fwdPackets++; f.fwdBytes += p.size; f.fwdLens.push(p.size);
  f.times.push(now);

  if (p.flags) {
    if (p.flags & 0x01) f.flags.FIN++;
    if (p.flags & 0x02) f.flags.SYN++;
    if (p.flags & 0x04) f.flags.RST++;
    if (p.flags & 0x08) f.flags.PSH++;
    if (p.flags & 0x10) f.flags.ACK++;
    if (p.flags & 0x20) f.flags.URG++;
    if (p.flags & 0x40) f.flags.ECE++;
    if (p.flags & 0x80) f.flags.CWR++;
  }
}

export function flushExpiredFlows(cb) {
  const now = Date.now();
  for (const [k,f] of flows.entries()) {
    if (now - f.lastSeen > TIMEOUT) {
      cb(f);
      flows.delete(k);
    }
  }
}
