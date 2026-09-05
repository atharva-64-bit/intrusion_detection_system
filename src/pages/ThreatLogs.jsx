import { useMemo, useState, useEffect } from "react";
import { Search, Filter, Download, FileText, AlertCircle } from "lucide-react";
import authFetch from "../utils/authFetch"; // ⭐ added

// remove THREATS (replaced by real backend data)

const severities = ["All", "High", "Medium", "Low"];

// --- Helper component for the Metric/Severity Cards ---
const SeverityCard = ({ title, count, color, delay, gradient, hoverShadow }) => (
  <div 
    className={`group bg-gradient-to-br ${gradient} p-5 rounded-xl border border-${color}-500/20 
    hover:border-${color}-400/40 ${hoverShadow} transition-all duration-300 cursor-pointer relative overflow-hidden 
    hover:scale-[1.02]`}
    style={{ animation: `fadeInUp 0.5s ease-out ${delay} both` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
        opacity-0 group-hover:opacity-40 translate-x-[-100%] group-hover:translate-x-[100%]
        transition-all duration-700"></div>

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
        <h3 className={`text-4xl font-extrabold text-${color}-400 mt-2`}>
          {count}
        </h3>
      </div>
      <AlertCircle className={`w-10 h-10 text-${color}-400/30 group-hover:text-${color}-400/50 transition-colors`} />
    </div>
  </div>
);


export default function ThreatLogs() {
  const [logs, setLogs] = useState([]); // ⭐ real backend logs
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ⭐ Load logs from backend (refresh every 5 seconds)
  const loadLogs = async () => {
    try {
      const data = await authFetch("http://localhost:5000/api/threats");
      setLogs(data);
    } catch (err) {
      console.error("Failed loading logs", err);
    }
  };

  const handleExportCSV = () => {
  if (!logs || logs.length === 0) return;

  const headers = [
    "Time",
    "Source IP",
    "Destination IP",
    "Attack",
    "Severity",
    "Status",
  ];

  const rows = logs.map((log) => [
    log.time,
    log.src,
    log.dest,
    log.attack,
    log.severity,
    log.status,
  ]);

  const csvContent =
    [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "threat_logs.csv";
  link.click();

  URL.revokeObjectURL(url);
};

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // ⭐ filtering now uses backend logs
  const filtered = useMemo(() => {
    return logs.filter((t) => {
      const matchesSeverity =
        severityFilter === "All" || t.severity === severityFilter;

      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        t.src.toLowerCase().includes(term) ||
        t.dest.toLowerCase().includes(term) ||
        t.attack.toLowerCase().includes(term);

      return matchesSeverity && matchesSearch;
    });
  }, [severityFilter, search, logs]);


  

  // ⭐ severity counts now dynamic
  const highCount = logs.filter((t) => t.severity === "High").length;
  const mediumCount = logs.filter((t) => t.severity === "Medium").length;
  const lowCount = logs.filter((t) => t.severity === "Low").length;


  return (
    <div className="space-y-8 text-gray-200 font-sans">

      {/* HEADER */}
      <div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-1 flex items-center gap-2 tracking-wide">
            <FileText className="w-7 h-7" />
            Threat Logs
          </h1>
          <p className="text-m font-semibold text-gray-400">
            Historical records of detected threats and actions taken
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Severity Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#111827] border border-cyan-500/50 text-sm pl-10 pr-4 py-3 rounded-xl
              outline-none hover:border-cyan-500 transition-all duration-300 appearance-none cursor-pointer"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Severities" : s}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by IP / attack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#111827] border border-gray-700 text-sm pl-10 pr-4 py-3 rounded-xl
              outline-none w-64 hover:border-gray-600 focus:border-cyan-500 transition-all duration-300"
            />
          </div>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="group bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-sm font-semibold px-5 py-3
            rounded-xl hover:bg-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300
            flex items-center gap-2 relative overflow-hidden"
          >
            <Download className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Export CSV</span>
          </button>
        </div>
      </div>

      {/* SEVERITY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SeverityCard 
          title="High Severity Threats" 
          count={highCount} 
          color="red" 
          gradient="from-[#211818] to-[#171010]" 
          hoverShadow="hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          delay="0.3s" 
        />
        <SeverityCard 
          title="Medium Severity Threats" 
          count={mediumCount} 
          color="yellow" 
          gradient="from-[#2a2317] to-[#1b1710]" 
          hoverShadow="hover:shadow-[0_0_20px_rgba(255,255,0,0.2)]"
          delay="0.4s" 
        />
        <SeverityCard 
          title="Low Severity Threats" 
          count={lowCount} 
          color="green" 
          gradient="from-[#16211b] to-[#0f1a13]" 
          hoverShadow="hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
          delay="0.5s" 
        />
      </div>

      {/* TABLE */}
      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
        p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
        hover:border-cyan-500/30 transition-all duration-300
        hover:shadow-lg hover:shadow-cyan-500/10 overflow-auto custom-scrollbar"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.7s both' }}
      >
        <table className="w-full text-sm text-gray-300 min-w-[800px]">
          <thead className="sticky top-0 bg-[#0c0f13] z-10">
            <tr className="text-cyan-400 text-sm border-b border-cyan-500/30 uppercase tracking-wider">
              <th className="py-4 px-4 text-left">Time</th>
              <th className="py-4 px-4 text-left">Source IP</th>
              <th className="py-4 px-4 text-left">Destination IP</th>
              <th className="py-4 px-4 text-left">Attack Type</th>
              <th className="py-4 px-4 text-left">Severity</th>
              <th className="py-4 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, index) => (
              <tr
                key={t.id || t._id || index}
                className={`border-b border-white/5 transition-colors duration-200
                ${index % 2 === 0 ? 'bg-white/5 hover:bg-white/10' : 'hover:bg-white/5'}`}
              >
                <td className="py-4 px-4 font-mono text-xs text-gray-300">{t.time}</td>
                <td className="py-4 px-4 font-mono text-xs text-cyan-200">{t.src}</td>
                <td className="py-4 px-4 font-mono text-xs text-gray-400">{t.dest}</td>
                <td className="py-4 px-4 font-semibold text-sm">{t.attack}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border min-w-[70px] inline-block text-center
                    ${
                      t.severity === "High"
                        ? "bg-red-500/15 text-red-400 border-red-500/40"
                        : t.severity === "Medium"
                        ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/40"
                        : "bg-green-500/15 text-green-400 border-green-500/40"
                    }`}
                  >
                    {t.severity}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold min-w-[80px] inline-block text-center
                    ${
                        t.status === "Blocked"
                          ? "bg-red-500/15 text-red-400 border border-red-500/40"
                          : t.status === "Allowed"
                          ? "bg-green-500/15 text-green-400 border border-green-500/40"
                          : "bg-blue-500/15 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-sm text-gray-500"
                >
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  No threats matched the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ANIMATIONS + SCROLLBAR */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
      `}</style>
    </div>
  );
}
