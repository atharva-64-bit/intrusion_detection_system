const mean = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0;
const std  = (a,m) => a.length ? Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length) : 0;
const safe = v => (Number.isFinite(v) ? v : 0);

export function extractFlowFeatures(f) {
  const dur = Math.max((f.lastSeen - f.startTime) * 1000, 1);
  const totalPkts = f.fwdPackets + f.bwdPackets;
  const totalBytes = f.fwdBytes + f.bwdBytes;

  const iats = f.times.slice(1).map((t,i)=>(t - f.times[i])*1000);
  const iatM = mean(iats);

  const fm = mean(f.fwdLens);
  const bm = mean(f.bwdLens);

  return {
    // ===== EXACT CICIDS FEATURE SET =====
    "Destination Port": f.port,
    "Flow Duration": dur,

    "Total Fwd Packets": f.fwdPackets,
    "Total Backward Packets": f.bwdPackets,

    "Total Length of Fwd Packets": f.fwdBytes,
    "Total Length of Bwd Packets": f.bwdBytes,

    "Fwd Packet Length Max": Math.max(...f.fwdLens,0),
    "Fwd Packet Length Min": Math.min(...f.fwdLens,0),
    "Fwd Packet Length Mean": fm,
    "Fwd Packet Length Std": std(f.fwdLens,fm),

    "Bwd Packet Length Max": Math.max(...f.bwdLens,0),
    "Bwd Packet Length Min": Math.min(...f.bwdLens,0),
    "Bwd Packet Length Mean": bm,
    "Bwd Packet Length Std": std(f.bwdLens,bm),

    "Flow Bytes/s": safe((totalBytes*1000)/dur),
    "Flow Packets/s": safe((totalPkts*1000)/dur),

    "Flow IAT Mean": iatM,
    "Flow IAT Std": std(iats,iatM),
    "Flow IAT Max": Math.max(...iats,0),
    "Flow IAT Min": Math.min(...iats,0),

    "Fwd IAT Total": iats.reduce((a,b)=>a+b,0),
    "Fwd IAT Mean": iatM,
    "Fwd IAT Std": std(iats,iatM),
    "Fwd IAT Max": Math.max(...iats,0),
    "Fwd IAT Min": Math.min(...iats,0),

    "Bwd IAT Total": 0,
    "Bwd IAT Mean": 0,
    "Bwd IAT Std": 0,
    "Bwd IAT Max": 0,
    "Bwd IAT Min": 0,

    "Fwd PSH Flags": f.flags.PSH,
    "Fwd URG Flags": f.flags.URG,

    "Fwd Header Length": 0,
    "Bwd Header Length": 0,

    "Fwd Packets/s": safe((f.fwdPackets*1000)/dur),
    "Bwd Packets/s": 0,

    "Min Packet Length": Math.min(...f.fwdLens,0),
    "Max Packet Length": Math.max(...f.fwdLens,0),
    "Packet Length Mean": safe(totalPkts ? totalBytes/totalPkts : 0),
    "Packet Length Std": std(f.fwdLens,fm),
    "Packet Length Variance": Math.pow(std(f.fwdLens,fm),2),

    "FIN Flag Count": f.flags.FIN,
    "SYN Flag Count": f.flags.SYN,
    "RST Flag Count": f.flags.RST,
    "PSH Flag Count": f.flags.PSH,
    "ACK Flag Count": f.flags.ACK,
    "URG Flag Count": f.flags.URG,
    "CWE Flag Count": f.flags.CWR,
    "ECE Flag Count": f.flags.ECE,

    "Down/Up Ratio": safe(f.fwdPackets ? f.bwdPackets/f.fwdPackets : 0),
    "Average Packet Size": safe(totalPkts ? totalBytes/totalPkts : 0),

    "Avg Fwd Segment Size": fm,
    "Avg Bwd Segment Size": bm,

    "Fwd Header Length.1": 0,

    "Subflow Fwd Packets": f.fwdPackets,
    "Subflow Fwd Bytes": f.fwdBytes,
    "Subflow Bwd Packets": f.bwdPackets,
    "Subflow Bwd Bytes": f.bwdBytes,

    "Init_Win_bytes_forward": 0,
    "Init_Win_bytes_backward": 0,
    "act_data_pkt_fwd": 0,
    "min_seg_size_forward": 0,

    "Active Mean": 0,
    "Active Std": 0,
    "Active Max": 0,
    "Active Min": 0,

    "Idle Mean": 0,
    "Idle Std": 0,
    "Idle Max": 0,
    "Idle Min": 0,
  };
}
