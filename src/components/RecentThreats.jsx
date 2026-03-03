// Dummy fallback data (used only if backend does not send items)
const recentThreatsFallback = [
  {
    time: "12:45 PM",
    src: "192.168.1.24",
    dest: "10.0.0.5",
    attack: "Port Scan",
    severity: "High",
    status: "Blocked",
  },
  {
    time: "11:32 AM",
    src: "203.44.12.8",
    dest: "192.168.1.10",
    attack: "DDoS Attempt",
    severity: "Medium",
    status: "Monitored",
  },
  {
    time: "10:15 AM",
    src: "45.117.22.5",
    dest: "10.0.0.12",
    attack: "Brute Force",
    severity: "High",
    status: "Blocked",
  },
  {
    time: "09:48 AM",
    src: "152.67.34.1",
    dest: "192.168.1.7",
    attack: "Malware Activity",
    severity: "Low",
    status: "Allowed",
  },
];

export default function RecentThreats({ items }) {
  const data = items && items.length > 0 ? items : recentThreatsFallback;

  const getSeverityClass = (severity) => {
    if (severity === "High")
      return "bg-red-500/15 text-red-400 border border-red-500/40";
    if (severity === "Medium")
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/40";
    return "bg-green-500/15 text-green-400 border border-green-500/40";
  };

  const getStatusClass = (status) => {
    if (status === "Blocked")
      return "bg-red-500/15 text-red-400 border border-red-500/40";
    if (status === "Monitored")
      return "bg-blue-500/15 text-blue-300 border border-blue-500/40";
    return "bg-green-500/15 text-green-400 border border-green-500/40";
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-gray-300">
        <thead className="border-b border-white/10 text-cyan-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 text-left">Time</th>
            <th className="py-3 text-left">Source</th>
            <th className="py-3 text-left">Destination</th>
            <th className="py-3 text-left">Attack</th>
            <th className="py-3 text-left">Severity</th>
            <th className="py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t, index) => (
            <tr
              key={index}
              className={`border-b border-white/5 transition-colors duration-200
                ${index % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"}`}
            >
              <td className="py-3 text-gray-300">{t.time}</td>
              <td className="py-3 text-cyan-300 font-mono">{t.src}</td>
              <td className="py-3 text-gray-400 font-mono">{t.dest}</td>
              <td className="py-3 font-medium">{t.attack}</td>

              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold min-w-[60px] inline-block text-center ${getSeverityClass(
                    t.severity
                  )}`}
                >
                  {t.severity}
                </span>
              </td>

              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold min-w-[70px] inline-block text-center ${getStatusClass(
                    t.status
                  )}`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">
                No recent threats found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34,211,238,0.35);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34,211,238,0.5);
        }
      `}</style>
    </div>
  );
}
