import { useState } from "react";
import { Shield } from "lucide-react";
import authFetch from "../utils/authFetch";

export default function AttackValidation() {
  
  const dosSample = {
    "Destination Port": 80,
    "Flow Duration": 1878,
    "Total Fwd Packets": 3,
    "Total Backward Packets": 6,
    "Total Length of Fwd Packets": 382,
    "Total Length of Bwd Packets": 11595,
    "Fwd Packet Length Max": 382,
    "Fwd Packet Length Min": 0,
    "Fwd Packet Length Mean": 127.3333333,
    "Fwd Packet Length Std": 220.5478028,
    "Bwd Packet Length Max": 4355,
    "Bwd Packet Length Min": 0,
    "Bwd Packet Length Mean": 1932.5,
    "Bwd Packet Length Std": 2182.468304,
    "Flow Bytes/s": 6377529.286,
    "Flow Packets/s": 4792.332268,
    "Flow IAT Mean": 234.75,
    "Flow IAT Std": 229.1298758,
    "Flow IAT Max": 577,
    "Flow IAT Min": 15,
    "Fwd IAT Total": 975,
    "Fwd IAT Mean": 487.5,
    "Fwd IAT Std": 265.1650429,
    "Fwd IAT Max": 675,
    "Fwd IAT Min": 300,
    "Bwd IAT Total": 1780,
    "Bwd IAT Mean": 356,
    "Bwd IAT Std": 399.7880689,
    "Bwd IAT Max": 950,
    "Bwd IAT Min": 15,
    "Fwd PSH Flags": 0,
    "Fwd URG Flags": 0,
    "Fwd Header Length": 104,
    "Bwd Header Length": 200,
    "Fwd Packets/s": 1597.444089,
    "Bwd Packets/s": 3194.888179,
    "Min Packet Length": 0,
    "Max Packet Length": 4355,
    "Packet Length Mean": 1197.7,
    "Packet Length Std": 1886.332364,
    "Packet Length Variance": 3558249.789,
    "FIN Flag Count": 0,
    "SYN Flag Count": 0,
    "RST Flag Count": 0,
    "PSH Flag Count": 1,
    "ACK Flag Count": 0,
    "URG Flag Count": 0,
    "CWE Flag Count": 0,
    "ECE Flag Count": 0,
    "Down/Up Ratio": 2,
    "Average Packet Size": 1330.777778,
    "Avg Fwd Segment Size": 127.3333333,
    "Avg Bwd Segment Size": 1932.5,
    "Fwd Header Length.1": 104,
    "Subflow Fwd Packets": 3,
    "Subflow Fwd Bytes": 382,
    "Subflow Bwd Packets": 6,
    "Subflow Bwd Bytes": 11595,
    Init_Win_bytes_forward: 29200,
    Init_Win_bytes_backward: 235,
    act_data_pkt_fwd: 1,
    min_seg_size_forward: 32,
    "Active Mean": 0,
    "Active Std": 0,
    "Active Max": 0,
    "Active Min": 0,
    "Idle Mean": 0,
    "Idle Std": 0,
    "Idle Max": 0,
    "Idle Min": 0,
  };

 const bruteSample = {
  "Destination Port": 21,
  "Flow Duration": 3302859,
  "Total Fwd Packets": 6,
  "Total Backward Packets": 6,
  "Total Length of Fwd Packets": 36,
  "Total Length of Bwd Packets": 76,
  "Fwd Packet Length Max": 22,
  "Fwd Packet Length Min": 0,
  "Fwd Packet Length Mean": 6,
  "Fwd Packet Length Std": 9.633275663,
  "Bwd Packet Length Max": 34,
  "Bwd Packet Length Min": 0,
  "Bwd Packet Length Mean": 12.66666667,
  "Bwd Packet Length Std": 14.67878287,
  "Flow Bytes/s": 33.91001554,
  "Flow Packets/s": 3.63321595,
  "Flow IAT Mean": 300259.9091,
  "Flow IAT Std": 977989.9797,
  "Flow IAT Max": 3248752,
  "Flow IAT Min": 3,
  "Fwd IAT Total": 3302859,
  "Fwd IAT Mean": 660571.8,
  "Fwd IAT Std": 1471692.192,
  "Fwd IAT Max": 3293208,
  "Fwd IAT Min": 3,
  "Bwd IAT Total": 3302056,
  "Bwd IAT Mean": 660411.2,
  "Bwd IAT Std": 1447040.35,
  "Bwd IAT Max": 3248752,
  "Bwd IAT Min": 3,
  "Fwd PSH Flags": 0,
  "Fwd URG Flags": 0,
  "Fwd Header Length": 200,
  "Bwd Header Length": 200,
  "Fwd Packets/s": 1.816607975,
  "Bwd Packets/s": 1.816607975,
  "Min Packet Length": 0,
  "Max Packet Length": 34,
  "Packet Length Mean": 8.615384615,
  "Packet Length Std": 12.09365165,
  "Packet Length Variance": 146.2564103,
  "FIN Flag Count": 0,
  "SYN Flag Count": 0,
  "RST Flag Count": 0,
  "PSH Flag Count": 1,
  "ACK Flag Count": 0,
  "URG Flag Count": 0,
  "CWE Flag Count": 0,
  "ECE Flag Count": 0,
  "Down/Up Ratio": 1,
  "Average Packet Size": 9.333333333,
  "Avg Fwd Segment Size": 6,
  "Avg Bwd Segment Size": 12.66666667,
  "Fwd Header Length.1": 200,
  "Subflow Fwd Packets": 6,
  "Subflow Fwd Bytes": 36,
  "Subflow Bwd Packets": 6,
  "Subflow Bwd Bytes": 76,
  "Init_Win_bytes_forward": 29200,
  "Init_Win_bytes_backward": 227,
  "act_data_pkt_fwd": 2,
  "min_seg_size_forward": 32,
  "Active Mean": 0,
  "Active Std": 0,
  "Active Max": 0,
  "Active Min": 0,
  "Idle Mean": 0,
  "Idle Std": 0,
  "Idle Max": 0,
  "Idle Min": 0
};

  const webAttackSample = {
  "Destination Port": 80,
  "Flow Duration": 5006127,
  "Total Fwd Packets": 4,
  "Total Backward Packets": 4,
  "Total Length of Fwd Packets": 447,
  "Total Length of Bwd Packets": 530,
  "Fwd Packet Length Max": 447,
  "Fwd Packet Length Min": 0,
  "Fwd Packet Length Mean": 111.75,
  "Fwd Packet Length Std": 223.5,
  "Bwd Packet Length Max": 530,
  "Bwd Packet Length Min": 0,
  "Bwd Packet Length Mean": 132.5,
  "Bwd Packet Length Std": 265,
  "Flow Bytes/s": 195.1608499,
  "Flow Packets/s": 1.59804176,
  "Flow IAT Mean": 715161,
  "Flow IAT Std": 1889619.815,
  "Flow IAT Max": 5000415,
  "Flow IAT Min": 4,
  "Fwd IAT Total": 5712,
  "Fwd IAT Mean": 1904,
  "Fwd IAT Std": 2168.235227,
  "Fwd IAT Max": 4266,
  "Fwd IAT Min": 4,
  "Bwd IAT Total": 5005996,
  "Bwd IAT Mean": 1668665.333,
  "Bwd IAT Std": 2885896.206,
  "Bwd IAT Max": 5001011,
  "Bwd IAT Min": 1407,
  "Fwd PSH Flags": 0,
  "Fwd URG Flags": 0,
  "Fwd Header Length": 136,
  "Bwd Header Length": 136,
  "Fwd Packets/s": 0.79902088,
  "Bwd Packets/s": 0.79902088,
  "Min Packet Length": 0,
  "Max Packet Length": 530,
  "Packet Length Mean": 108.5555556,
  "Packet Length Std": 216.4053552,
  "Packet Length Variance": 46831.27778,
  "FIN Flag Count": 0,
  "SYN Flag Count": 0,
  "RST Flag Count": 0,
  "PSH Flag Count": 1,
  "ACK Flag Count": 0,
  "URG Flag Count": 0,
  "CWE Flag Count": 0,
  "ECE Flag Count": 0,
  "Down/Up Ratio": 1,
  "Average Packet Size": 122.125,
  "Avg Fwd Segment Size": 111.75,
  "Avg Bwd Segment Size": 132.5,
  "Fwd Header Length.1": 136,
  "Subflow Fwd Packets": 4,
  "Subflow Fwd Bytes": 447,
  "Subflow Bwd Packets": 4,
  "Subflow Bwd Bytes": 530,
  "Init_Win_bytes_forward": 29200,
  "Init_Win_bytes_backward": 235,
  "act_data_pkt_fwd": 1,
  "min_seg_size_forward": 32,
  "Active Mean": 0,
  "Active Std": 0,
  "Active Max": 0,
  "Active Min": 0,
  "Idle Mean": 0,
  "Idle Std": 0,
  "Idle Max": 0,
  "Idle Min": 0
};

 const normalTrafficSample = {
  "Destination Port": 80,
  "Flow Duration": 9605093,
  "Total Fwd Packets": 10,
  "Total Backward Packets": 9,
  "Total Length of Fwd Packets": 1473,
  "Total Length of Bwd Packets": 8558,
  "Fwd Packet Length Max": 397,
  "Fwd Packet Length Min": 0,
  "Fwd Packet Length Mean": 147.3,
  "Fwd Packet Length Std": 190.5868423,
  "Bwd Packet Length Max": 2175,
  "Bwd Packet Length Min": 0,
  "Bwd Packet Length Mean": 950.8888889,
  "Bwd Packet Length Std": 889.3981735,
  "Flow Bytes/s": 1044.341788,
  "Flow Packets/s": 1.978117234,
  "Flow IAT Mean": 533616.2778,
  "Flow IAT Std": 1537840.278,
  "Flow IAT Max": 4966459,
  "Flow IAT Min": 18,
  "Fwd IAT Total": 4638634,
  "Fwd IAT Mean": 515403.7778,
  "Fwd IAT Std": 1511347.68,
  "Fwd IAT Max": 4545469,
  "Fwd IAT Min": 244,
  "Bwd IAT Total": 9605075,
  "Bwd IAT Mean": 1200634.375,
  "Bwd IAT Std": 2210359.025,
  "Bwd IAT Max": 5005149,
  "Bwd IAT Min": 50,
  "Fwd PSH Flags": 0,
  "Fwd URG Flags": 0,
  "Fwd Header Length": 328,
  "Bwd Header Length": 296,
  "Fwd Packets/s": 1.041114334,
  "Bwd Packets/s": 0.9370029,
  "Min Packet Length": 0,
  "Max Packet Length": 2175,
  "Packet Length Mean": 501.55,
  "Packet Length Std": 724.7059277,
  "Packet Length Variance": 525198.6816,
  "FIN Flag Count": 0,
  "SYN Flag Count": 0,
  "RST Flag Count": 0,
  "PSH Flag Count": 1,
  "ACK Flag Count": 0,
  "URG Flag Count": 0,
  "CWE Flag Count": 0,
  "ECE Flag Count": 0,
  "Down/Up Ratio": 0,
  "Average Packet Size": 527.9473684,
  "Avg Fwd Segment Size": 147.3,
  "Avg Bwd Segment Size": 950.8888889,
  "Fwd Header Length.1": 328,
  "Subflow Fwd Packets": 10,
  "Subflow Fwd Bytes": 1473,
  "Subflow Bwd Packets": 9,
  "Subflow Bwd Bytes": 8558,
  "Init_Win_bytes_forward": 29200,
  "Init_Win_bytes_backward": 260,
  "act_data_pkt_fwd": 4,
  "min_seg_size_forward": 32,
  "Active Mean": 0,
  "Active Std": 0,
  "Active Max": 0,
  "Active Min": 0,
  "Idle Mean": 0,
  "Idle Std": 0,
  "Idle Max": 0,
  "Idle Min": 0
};

  const ddosSample = {
  "Destination Port": 80,
  "Flow Duration": 1293792,
  "Total Fwd Packets": 3,
  "Total Backward Packets": 7,
  "Total Length of Fwd Packets": 26,
  "Total Length of Bwd Packets": 11607,
  "Fwd Packet Length Max": 20,
  "Fwd Packet Length Min": 0,
  "Fwd Packet Length Mean": 8.666666667,
  "Fwd Packet Length Std": 10.26320288,
  "Bwd Packet Length Max": 5840,
  "Bwd Packet Length Min": 0,
  "Bwd Packet Length Mean": 1658.142857,
  "Bwd Packet Length Std": 2137.29708,
  "Flow Bytes/s": 8991.398927,
  "Flow Packets/s": 7.72921768,
  "Flow IAT Mean": 143754.6667,
  "Flow IAT Std": 430865.8067,
  "Flow IAT Max": 1292730,
  "Flow IAT Min": 2,
  "Fwd IAT Total": 747,
  "Fwd IAT Mean": 373.5,
  "Fwd IAT Std": 523.9661249,
  "Fwd IAT Max": 744,
  "Fwd IAT Min": 3,
  "Bwd IAT Total": 1293746,
  "Bwd IAT Mean": 215624.3333,
  "Bwd IAT Std": 527671.9348,
  "Bwd IAT Max": 1292730,
  "Bwd IAT Min": 2,
  "Fwd PSH Flags": 0,
  "Fwd URG Flags": 0,
  "Fwd Header Length": 72,
  "Bwd Header Length": 152,
  "Fwd Packets/s": 2.318765304,
  "Bwd Packets/s": 5.410452376,
  "Min Packet Length": 0,
  "Max Packet Length": 5840,
  "Packet Length Mean": 1057.545455,
  "Packet Length Std": 1853.437529,
  "Packet Length Variance": 3435230.673,
  "FIN Flag Count": 0,
  "SYN Flag Count": 0,
  "RST Flag Count": 0,
  "PSH Flag Count": 1,
  "ACK Flag Count": 0,
  "URG Flag Count": 0,
  "CWE Flag Count": 0,
  "ECE Flag Count": 0,
  "Down/Up Ratio": 2,
  "Average Packet Size": 1163.3,
  "Avg Fwd Segment Size": 8.666666667,
  "Avg Bwd Segment Size": 1658.142857,
  "Fwd Header Length.1": 72,
  "Subflow Fwd Packets": 3,
  "Subflow Fwd Bytes": 26,
  "Subflow Bwd Packets": 7,
  "Subflow Bwd Bytes": 11607,
  "Init_Win_bytes_forward": 8192,
  "Init_Win_bytes_backward": 229,
  "act_data_pkt_fwd": 2,
  "min_seg_size_forward": 20,
  "Active Mean": 0,
  "Active Std": 0,
  "Active Max": 0,
  "Active Min": 0,
  "Idle Mean": 0,
  "Idle Std": 0,
  "Idle Max": 0,
  "Idle Min": 0
};

  const botnetSample = {
  "Destination Port": 8080,
  "Flow Duration": 134812,
  "Total Fwd Packets": 4,
  "Total Backward Packets": 3,
  "Total Length of Fwd Packets": 206,
  "Total Length of Bwd Packets": 134,
  "Fwd Packet Length Max": 194,
  "Fwd Packet Length Min": 0,
  "Fwd Packet Length Mean": 51.5,
  "Fwd Packet Length Std": 95.04209594,
  "Bwd Packet Length Max": 128,
  "Bwd Packet Length Min": 0,
  "Bwd Packet Length Mean": 44.66666667,
  "Bwd Packet Length Std": 72.23111056,
  "Flow Bytes/s": 2522.03068,
  "Flow Packets/s": 51.92416105,
  "Flow IAT Mean": 22468.66667,
  "Flow IAT Std": 53230.91125,
  "Flow IAT Max": 131123,
  "Flow IAT Min": 123,
  "Fwd IAT Total": 134812,
  "Fwd IAT Mean": 44937.33333,
  "Fwd IAT Std": 76126.81717,
  "Fwd IAT Max": 132841,
  "Fwd IAT Min": 949,
  "Bwd IAT Total": 132783,
  "Bwd IAT Mean": 66391.5,
  "Bwd IAT Std": 91544.16521,
  "Bwd IAT Max": 131123,
  "Bwd IAT Min": 1660,
  "Fwd PSH Flags": 0,
  "Fwd URG Flags": 0,
  "Fwd Header Length": 92,
  "Bwd Header Length": 72,
  "Fwd Packets/s": 29.67094917,
  "Bwd Packets/s": 22.25321188,
  "Min Packet Length": 0,
  "Max Packet Length": 194,
  "Packet Length Mean": 42.5,
  "Packet Length Std": 75.2880184,
  "Packet Length Variance": 5668.285714,
  "FIN Flag Count": 0,
  "SYN Flag Count": 0,
  "RST Flag Count": 0,
  "PSH Flag Count": 1,
  "ACK Flag Count": 0,
  "URG Flag Count": 0,
  "CWE Flag Count": 0,
  "ECE Flag Count": 0,
  "Down/Up Ratio": 0,
  "Average Packet Size": 48.57142857,
  "Avg Fwd Segment Size": 51.5,
  "Avg Bwd Segment Size": 44.66666667,
  "Fwd Header Length.1": 92,
  "Subflow Fwd Packets": 4,
  "Subflow Fwd Bytes": 206,
  "Subflow Bwd Packets": 3,
  "Subflow Bwd Bytes": 134,
  "Init_Win_bytes_forward": 8192,
  "Init_Win_bytes_backward": 237,
  "act_data_pkt_fwd": 3,
  "min_seg_size_forward": 20,
  "Active Mean": 0,
  "Active Std": 0,
  "Active Max": 0,
  "Active Min": 0,
  "Idle Mean": 0,
  "Idle Std": 0,
  "Idle Max": 0,
  "Idle Min": 0
};

  const initialRows = [
    {
      id: 1,
      time: "12:30",
      src: "192.168.1.5",
      type: "ddos",
      attack: "DDoS",
      result: null,
      severity: "High",
    },
    {
      id: 2,
      time: "12:31",
      src: "122.172.0.1",
      type: "brute",
      attack: "Brute Force",
      result: null,
      severity: "High",
    },
    {
      id: 3,
      time: "12:32",
      src: "172.16.0.5",
      type: "normal",
      attack: "Normal",
      result: null,
      severity: "Medium",
    },
    {
      id: 4,
      time: "12:33",
      src: "203.91.44.10",
      type: "dos",
      attack: "DoS",
      result: null,
      severity: "Medium",
    },
    {
      id: 5,
      time: "12:34",
      src: "185.203.116.52",
      type: "botnet",
      attack: "Botnet",
      result: null,
      severity: "High",
    },
    {
      id: 6,
      time: "12:35",
      src: "8.8.8.8",
      type: "webattack",
      attack: "Web Attack",
      result: null,
      severity: "Low",
    },
  ];

  const [rows, setRows] = useState(initialRows);
  const [modal, setModal] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  function showNotification(message) {
      const audio = new Audio("/alert.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {}); // prevent crash if blocked
  const notif = document.createElement("div");

  notif.innerText = message;

  notif.style.position = "fixed";
  notif.style.top = "20px";
  notif.style.right = "20px";
  notif.style.background = "rgba(239,68,68,0.9)";
  notif.style.color = "white";
  notif.style.padding = "12px 18px";
  notif.style.borderRadius = "8px";
  notif.style.fontSize = "14px";
  notif.style.zIndex = "9999";
  notif.style.boxShadow = "0 0 20px rgba(239,68,68,0.6)";
  notif.style.transition = "all 0.4s ease";

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(50px)";
  }, 2500);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}

  const handleValidate = async (row) => {
    try {
      setModal(true);
      setLoadingId(row.id);

      setLoadingText("Injecting dataset sample...");
      await new Promise((r) => setTimeout(r, 600));

let features;

switch (row.type) {
  case "dos":
    features = dosSample;
    break;

  case "brute":
    features = bruteSample;
    break;

  case "webattack":
    features = webAttackSample;
    break;

  case "normal":
  features = normalTrafficSample;
  break;

  case "ddos":
  features = ddosSample;
  break;

  case "botnet":
  features = botnetSample;
  break;

  default:
    features = dosSample; // fallback (safe)
}

      setLoadingText("Running AI...");
      const prediction = await window.mlAPI.predict(features);
      if (prediction !== "BENIGN") {
  showNotification(`🚨 Attack Detected: ${prediction}`);
}

      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, result: prediction } : r)),
      );

      await sendToBackend(row, prediction);

      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(err);
    } finally {
      setModal(false);
      setLoadingId(null);
    }
  };

  const handleSeverityChange = (id, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, severity: value } : r)),
    );
  };

  const getSeverityClass = (s) => {
    if (s === "High")
      return "bg-red-500/15 text-red-400 border border-red-500/40";
    if (s === "Medium")
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/40";
    return "bg-green-500/15 text-green-400 border border-green-500/40";
  };

  async function sendToBackend(row, label) {
  try {
    await authFetch("http://localhost:5000/api/threats", {
      method: "POST",
      body: JSON.stringify({
        time: row.time,
        src: row.src,
        dest: "192.168.1.1", // dummy or keep same
        attack: label,
        severity: row.severity || "Medium",
        status: "Detected",
      }),
    });
  } catch (err) {
    console.error("Failed to log validation result", err);
  }
}



  return (
    <div className="space-y-8 text-gray-200 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Shield className="w-7 h-7" />
          Attack Validation
        </h1>
      </div>

      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
        p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
        overflow-x-auto custom-scrollbar"
      >
        <table className="w-full text-sm text-gray-300 table-auto">
          <thead className="bg-[#0c0f13]">
            <tr className="text-cyan-400 border-b border-cyan-500/30 uppercase text-xs">
              <th className="py-3 px-2 text-left">Time</th>
              <th className="py-3 px-2 text-left">Source</th>
              <th className="py-3 px-2 text-left">Attack</th>
              <th className="py-3 px-2 text-left">Result</th>
              <th className="py-3 px-2 text-left">Action</th>
              <th className="py-3 px-2 text-left w-[140px]">Severity</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-white/5 transition
                ${i % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"}`}
              >
                <td className="py-3 px-2">{row.time}</td>
                <td className="py-3 px-2 font-mono text-xs text-cyan-200">
                  {row.src}
                </td>
                <td className="py-3 px-2 text-yellow-300 font-semibold">
                  {row.attack}
                </td>

                <td className="py-3 px-2">
                  {row.result ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/40">
                      {row.result}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">Pending</span>
                  )}
                </td>

                <td className="py-3 px-2">
                  <button
                    onClick={() => handleValidate(row)}
                    className="px-3 py-1 rounded-full text-xs font-semibold
                    bg-blue-500/15 text-blue-300 border border-blue-500/40
                    hover:bg-blue-500/25 transition"
                  >
                    {loadingId === row.id ? "Running..." : "Validate"}
                  </button>
                </td>

                <td className="py-3 px-2">
                  <select
                    value={row.severity}
                    onChange={(e) =>
                      handleSeverityChange(row.id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    bg-[#0c0f13] border outline-none cursor-pointer
                    ${getSeverityClass(row.severity)}
                    hover:brightness-110 transition`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0c0f13] p-8 rounded-xl border border-cyan-500/20 w-96 text-center">
            <div className="text-3xl mb-3 animate-bounce">🚀</div>
            <p className="text-cyan-400 text-sm mb-4">{loadingText}</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-loader"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loader {
          0% { width: 0% }
          50% { width: 70% }
          100% { width: 100% }
        }
        .animate-loader {
          animation: loader 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
