import { useEffect, useState } from "react";
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  LayoutDashboard,
} from "lucide-react";

import TrafficChart from "../components/TrafficChart";
import RecentThreats from "../components/RecentThreats";
import authFetch from "../utils/authFetch";

// DASHBOARD
export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentThreats, setRecentThreats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load summary + recent threats once on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [reportData, threats] = await Promise.all([
          authFetch("http://localhost:5000/api/reports/summary?range=24h"),
          authFetch("http://localhost:5000/api/threats"),
        ]);

        setSummary(reportData);
        // backend already sorted desc by createdAt, so take latest 5
        setRecentThreats(threats.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const metrics = summary?.metrics || {
    totalPackets: 0,
    totalThreats: 0,
    blocked: 0,
    manual: 0,
  };

  const severity = summary?.severityDistribution || {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  const stats = [
    {
      label: "Packets Analyzed",
      value: metrics.totalPackets.toLocaleString(),
      icon: Activity,
      color: "cyan",
      gradient: "from-[#1b2227] to-[#12181b]",
      border: "border-cyan-500/20",
      textColor: "text-cyan-400",
      hoverBorder: "hover:border-cyan-400/40",
      hoverShadow: "hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]",
      trend: "+12.5%", // cosmetic placeholder
      trendUp: true,
      delay: "0.1s",
    },
    {
      label: "Threats Detected",
      value: metrics.totalThreats.toString(),
      icon: AlertTriangle,
      color: "red",
      gradient: "from-[#211818] to-[#171010]",
      border: "border-red-500/20",
      textColor: "text-red-400",
      hoverBorder: "hover:border-red-400/40",
      hoverShadow: "hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]",
      trend: "+8.3%", // cosmetic placeholder
      trendUp: true,
      delay: "0.2s",
    },
    {
      label: "AI Accuracy",
      value: "98.7%", // will be wired to ML later
      icon: Zap,
      color: "green",
      gradient: "from-[#16211b] to-[#0f1a13]",
      border: "border-green-500/20",
      textColor: "text-green-400",
      hoverBorder: "hover:border-green-400/40",
      hoverShadow: "hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]",
      trend: "+2.1%",
      trendUp: true,
      delay: "0.3s",
    },
    {
      label: "Real-Time Alerts",
      value: severity.High.toString(), // treat High as active alerts
      icon: Shield,
      color: "yellow",
      gradient: "from-[#2a2317] to-[#1b1710]",
      border: "border-yellow-500/20",
      textColor: "text-yellow-400",
      hoverBorder: "hover:border-yellow-400/40",
      hoverShadow: "hover:shadow-[0_0_20px_rgba(255,255,0,0.2)]",
      trend: "-5.2%", // cosmetic placeholder
      trendUp: false,
      delay: "0.4s",
    },
  ];

  return (
    <div className="space-y-6 text-gray-200 relative font-sans">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-1 flex items-center gap-2 tracking-wide">
            <LayoutDashboard className="w-7 h-7" />
            Dashboard
          </h1>
          <p className="text-m font-semibold text-gray-400">
            Real-time overview of network security status
          </p>
          {loading && (
            <p className="text-xs text-cyan-300 mt-1">
              Loading dashboard data...
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 border border-emerald-500/30 p-2 rounded-full px-4 bg-emerald-900/10 relative">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative"></div>
          <span className="relative z-10">Live Feed</span>
        </div>
      </div>

      {/* --- METRIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const trendClass = stat.trendUp ? "text-green-400" : "text-red-400";
          const shadowColor =
            stat.color === "cyan"
              ? "rgba(0,255,255,0.2)"
              : stat.color === "red"
              ? "rgba(255,0,0,0.2)"
              : stat.color === "green"
              ? "rgba(0,255,0,0.2)"
              : "rgba(255,255,0,0.2)";

          return (
            <div
              key={stat.label}
              className={`group bg-gradient-to-br ${stat.gradient}
                p-6 rounded-xl border ${stat.border} backdrop-blur-xl
                hover:border-${stat.color}-400/40 hover:shadow-[0_0_20px_${shadowColor}]
                transition-all duration-300 relative overflow-hidden cursor-pointer
                hover:scale-[1.03]`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${
                  stat.delay || index * 0.1 + "s"
                } both`,
              }}
            >
              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                opacity-0 group-hover:opacity-40 translate-x-[-100%] group-hover:translate-x-[100%]
                transition-all duration-700"
              ></div>

              <div className="relative flex justify-between items-start">
                {/* Value and Label Section (Left side) */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <h2
                    className={`text-4xl font-extrabold ${stat.textColor} mt-1 tracking-tight`}
                  >
                    {stat.value}
                  </h2>
                </div>

                {/* Icon and Trend Section (Right side) */}
                <div className="flex flex-col items-end">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient} border ${stat.border}`}
                  >
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {/* Trend */}
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold mt-3 ${trendClass}`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${!stat.trendUp && "rotate-180"}`}
                    />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- TRAFFIC CHART (still dummy until packet sniffer) --- */}
      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          h-96 hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
        style={{
          animation: "fadeInUp 0.5s ease-out 0.5s both",
        }}
      >
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 tracking-wide flex items-center gap-2">
          Network Traffic Overview
        </h3>
        <TrafficChart />
      </div>

      {/* --- RECENT THREATS --- */}
      <div
        className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
        style={{
          animation: "fadeInUp 0.5s ease-out 0.6s both",
        }}
      >
        <h3 className="text-lg font-semibold text-red-400 mb-4 tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Recent Threats
        </h3>
        <RecentThreats items={recentThreats} />
      </div>

      {/* --- CUSTOM STYLES --- */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
