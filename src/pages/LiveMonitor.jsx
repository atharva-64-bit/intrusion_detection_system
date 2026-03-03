import ThreatMap from "../components/ThreatMap";
import { useEffect, useRef, useState } from "react";
import { Globe, Activity, Cpu, AlertTriangle } from "lucide-react";
import { useLivePackets } from "../context/LivePacketContext";

export default function LiveMonitor() {
  const tableRef = useRef(null);
  const { packets, packetsPerSec } = useLivePackets();



  // Auto-scroll table
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [packets]);

  return (
    <div className="space-y-8 text-gray-200 font-sans">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Activity className="w-7 h-7" />
          Live Monitor
        </h1>
        <p className="text-gray-400 font-semibold">
          Real-time network activity and threat detection feed
        </p>
      </div>

      {/* MAP */}
      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
        p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
        h-[500px]"
      >
        <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Global Traffic Map
        </h2>
        <ThreatMap />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Packets / sec" value={packetsPerSec} type="cyan" icon={Activity} />
        <StatCard title="Threats / sec" value={0} type="red" icon={AlertTriangle} />
        <StatCard title="CPU Usage" value={`${0}%`} type="green" icon={Cpu} />
      </div>

      {/* 🔵 LIVE PACKET TABLE (SAME STYLE AS BEFORE) */}
      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
        p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
        h-96 flex flex-col"
      >
        <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Packet Stream
        </h2>

        <div ref={tableRef} className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-sm text-gray-300">
            <thead className="sticky top-0 bg-[#0c0f13] z-10">
              <tr className="text-cyan-400 border-b border-cyan-500/30 uppercase tracking-wider">
                <th className="py-3 px-2 text-left">Time</th>
                <th className="py-3 px-2 text-left">Source IP</th>
                <th className="py-3 px-2 text-left">Destination IP</th>
                <th className="py-3 px-2 text-left">Protocol</th>
                <th className="py-3 px-2 text-left">Port</th>
                <th className="py-3 px-2 text-left">Size</th>
                <th className="py-3 px-2 text-left">Threat</th>
              </tr>
            </thead>

            <tbody>
              {packets.map((p, index) => (
                <tr
                  key={index}
                  className={`border-b border-white/5 transition-colors duration-200
                  ${index % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"}`}
                >
                  <td className="py-3 px-2 font-mono text-xs">{new Date(p.time).toLocaleTimeString()}</td>
                  <td className="py-3 px-2 font-mono text-xs text-cyan-200">{p.src}</td>
                  <td className="py-3 px-2 font-mono text-xs text-gray-400">{p.dest}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/30">
                      {p.proto}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs font-semibold">{p.port}</td>
                  <td className="py-3 px-2 text-xs font-semibold">{p.size} B</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-md text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
                      Normal
                    </span>
                  </td>
                </tr>
              ))}

              {packets.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-sm text-gray-500">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    Waiting for packets…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Stat card (fixed: no dynamic Tailwind class names) */
function StatCard({ title, value, icon: Icon, type }) {
  const colors = {
    cyan: "text-cyan-400 border-cyan-500/20",
    red: "text-red-400 border-red-500/20",
    green: "text-green-400 border-green-500/20",
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[type]} bg-[#12181b]`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">{title}</p>
          <h3 className={`text-3xl font-bold ${colors[type].split(" ")[0]} mt-2`}>
            {value}
          </h3>
        </div>
        <Icon className={`${colors[type].split(" ")[0]}/50 w-10 h-10`} />
      </div>
    </div>
  );
}
