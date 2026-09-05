import { useRef, useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import jsPDF from "jspdf";
import Plotly from "plotly.js-dist";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import authFetch from "../utils/authFetch";

export default function Reports() {
  const [range, setRange] = useState("24h");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const reportRef = useRef(null);
  const attackChartRef = useRef(null);
  const severityChartRef = useRef(null);

  const handleExportPDF = async () => {
  if (!summary) return;

  const pdf = new jsPDF();
  const metrics = summary.metrics;

  let y = 20;

  // ================= HEADER =================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("ShieldEye IDS Report", 105, y, { align: "center" });

  y += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, y, {
    align: "center",
  });

  y += 15;

  // ================= SUMMARY BOX =================
  pdf.setDrawColor(200);
  pdf.rect(14, y, 180, 35);

  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text("Summary", 18, y + 8);

  pdf.setFontSize(10);

  pdf.text(`Total Packets: ${metrics.totalPackets}`, 18, y + 16);
  pdf.text(`Total Threats: ${metrics.totalThreats}`, 18, y + 22);

  pdf.text(`Blocked: ${metrics.blocked}`, 100, y + 16);
  pdf.text(`Manual: ${metrics.manual}`, 100, y + 22);

  y += 45;

  // ================= ATTACK CHART =================
  pdf.setFontSize(12);
  pdf.text("Attack Categories", 14, y);

  y += 5;

  const attackImg = await Plotly.toImage(
    attackChartRef.current?.el || attackChartRef.current,
    { format: "png", width: 600, height: 300 }
  );

  pdf.addImage(attackImg, "PNG", 20, y, 170, 80);

  y += 90;

  // ================= PAGE BREAK =================
  pdf.addPage();
  y = 20;

  // ================= SEVERITY CHART =================
  pdf.setFontSize(12);
  pdf.text("Severity Distribution", 14, y);

  y += 5;

  const severityImg = await Plotly.toImage(
    severityChartRef.current?.el || severityChartRef.current,
    { format: "png", width: 600, height: 300 }
  );

  pdf.addImage(severityImg, "PNG", 30, y, 150, 90);

  y += 110;

  // ================= TABLE =================
  pdf.setFontSize(12);
  pdf.text("Top Malicious IPs", 14, y);

  y += 8;

  // Table Header
  pdf.setFont("helvetica", "bold");
  pdf.text("IP", 14, y);
  pdf.text("Country", 70, y);
  pdf.text("Attack", 120, y);
  pdf.text("Count", 170, y);

  y += 5;
  pdf.setLineWidth(0.3);
  pdf.line(14, y, 195, y);

  y += 5;

  pdf.setFont("helvetica", "normal");

  summary.topIps.forEach((row) => {
    pdf.text(row.ip, 14, y);
    pdf.text(row.country || "Unknown", 70, y);
    pdf.text(row.attacks, 120, y);
    pdf.text(String(row.count), 170, y);

    y += 7;

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
  });

  // ================= FOOTER =================
  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(150);
    pdf.text(
      `ShieldEye IDS • Page ${i} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  pdf.save("ShieldEye_Report.pdf");
};

  // --- LOAD SUMMARY FROM BACKEND ---
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await authFetch(
          `http://localhost:5000/api/reports/summary?range=${range}`
        );
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [range]);

  // --- DERIVED VALUES FROM SUMMARY ---
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

  const topIps = summary?.topIps || [];

  // --- PLOTLY LAYOUT CONFIGURATION ---
  const sharedPlotLayout = {
    margin: { l: 40, r: 10, t: 10, b: 50 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    font: { color: "#e5e7eb", family: "Inter, sans-serif" },
    responsive: true,
  };

  const axisStyle = {
    color: "#a0a0a0",
    gridcolor: "rgba(255,255,255,0.05)",
    zerolinecolor: "rgba(255,255,255,0.05)",
  };

  // --- CHART DATA (DYNAMIC) ---
  const attackCategoriesData = useMemo(() => {
    if (!summary || !summary.attackCategories) return [];

    return [
      {
        x: summary.attackCategories.map((c) => c.attack),
        y: summary.attackCategories.map((c) => c.count),
        type: "bar",
        marker: {
          color: [
            "#ef4444",
            "#fb923c",
            "#facc15",
            "#84cc16",
            "#06b6d4",
            "#a855f7",
          ],
          line: {
            width: 1.5,
            color: "rgba(255, 255, 255, 0.4)",
          },
          opacity: 0.9,
        },
      },
    ];
  }, [summary]);

  const severityDistributionData = useMemo(() => {
    return [
      {
        labels: ["High", "Medium", "Low"],
        values: [severity.High || 0, severity.Medium || 0, severity.Low || 0],
        type: "pie",
        hole: 0.65,
        marker: {
          colors: ["#ef4444", "#facc15", "#4ade80"],
          line: {
            width: 3,
            color: "#0c0f13",
          },
        },
        textinfo: "percent",
        hoverinfo: "label+value+percent",
        textfont: {
          color: "#0c0f13",
          size: 14,
        },
      },
    ];
  }, [severity]);

  const severityLayout = {
    ...sharedPlotLayout,
    margin: { l: 10, r: 10, t: 30, b: 10 },
    showlegend: true,
    legend: {
      font: { color: "#a0a0a0", size: 12 },
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.1,
    },
  };

  return (
    <div className="space-y-8 text-gray-200 font-sans">
      {/* --- HEADER AND CONTROLS --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-1 flex items-center gap-2 tracking-wide">
            <FileText className="w-7 h-7" />
            Reports
          </h1>
          <p className="text-m font-semibold text-gray-400 tracking-wide">
            Summary of detected threats, trends, and top malicious sources
          </p>
          {loading && (
            <p className="text-xs text-cyan-300 mt-1">Loading report data...</p>
          )}
          {error && (
            <p className="text-xs text-red-400 mt-1">{error}</p>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-[#111827] border border-cyan-500/50 text-sm font-semibold pl-10 pr-4 py-3 rounded-xl
              outline-none hover:border-cyan-500 transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>


        </div>
      </div>

      {/* --- REPORT CONTENT (PDF Export Area) --- */}
      <div ref={reportRef} className="space-y-6">
        {/* --- METRIC CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Packets Analyzed"
            value={metrics.totalPackets.toLocaleString()}
            trend="+12.5%"
            trendColor="text-green-400"
            color="cyan"
            delay="0.5s"
          />
          <MetricCard
            title="Total Threats Detected"
            value={metrics.totalThreats.toString()}
            trend="+8.3%"
            trendColor="text-red-400"
            color="red"
            delay="0.6s"
          />
          <MetricCard
            title="Blocked Automatically"
            value={metrics.blocked.toString()}
            trend="+5.2%"
            trendColor="text-green-400"
            color="green"
            delay="0.7s"
          />
          <MetricCard
            title="Manual Interventions"
            value={metrics.manual.toString()}
            trend="-5.2%"
            trendColor="text-yellow-400"
            color="yellow"
            delay="0.8s"
          />
        </div>

        {/* --- CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
            p-5 rounded-xl border border-cyan-500/10 backdrop-blur-xl
            h-96 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
            style={{ animation: "fadeInUp 0.9s ease-out 0.9s both" }}
          >
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 tracking-wider">
              Attack Categories ({range})
            </h3>
            <Plot
              ref={attackChartRef}
              data={attackCategoriesData}
              layout={{
                ...sharedPlotLayout,
                xaxis: { ...axisStyle, tickangle: -20 },
                yaxis: { ...axisStyle },
              }}
              config={{ displayModeBar: false, responsive: true }}
              useResizeHandler
              style={{ width: "100%", height: "calc(100% - 40px)" }}
            />
          </div>

          <div
            className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
            p-5 rounded-xl border border-cyan-500/10 backdrop-blur-xl
            h-96 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
            style={{ animation: "fadeInUp 0.9s ease-out 1.0s both" }}
          >
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 tracking-wider">
              Severity Distribution ({range})
            </h3>
            <div className="relative h-full w-full flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                <p className="text-xs text-gray-500 uppercase">Total Threats</p>
                <p className="text-2xl font-bold text-cyan-300">
                  {metrics.totalThreats}
                </p>
              </div>
              <Plot
                ref={severityChartRef}
                data={severityDistributionData}
                layout={severityLayout}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "calc(100% - 40px)" }}
              />
            </div>
          </div>
        </div>

        {/* --- TOP IPS TABLE --- */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          overflow-x-auto hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
          style={{ animation: "fadeInUp 0.9s ease-out 1.1s both" }}
        >
          <h3 className="text-lg font-semibold text-cyan-300 mb-5 tracking-wider">
            Top Malicious IP Addresses
          </h3>
          <table className="w-full text-sm text-gray-300 min-w-[700px]">
            <thead>
              <tr className="text-cyan-400 border-b border-cyan-500/30 uppercase text-left tracking-wider">
                <th className="py-4 px-4">IP Address</th>
                <th className="py-4 px-4">Country</th>
                <th className="py-4 px-4">Primary Attack Type</th>
                <th className="py-4 px-4">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {topIps.map((row, i) => (
                <tr
                  key={row.ip}
                  className={`border-b border-white/5 transition-colors duration-200
                  ${i % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"}`}
                >
                  <td className="py-4 px-4 text-xs font-mono text-cyan-200">
                    {row.ip}
                  </td>
                  <td className="py-4 px-4 text-xs">
                    {row.country || "Unknown"}
                  </td>
                  <td className="py-4 px-4 text-xs text-red-300 font-medium">
                    {row.attacks}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/40 text-xs font-semibold min-w-[40px] inline-block text-center">
                      {row.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- SUMMARY INSIGHTS (still descriptive text) --- */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
          style={{ animation: "fadeInUp 0.9s ease-out 1.2s both" }}
        >
          <h3 className="text-lg font-semibold text-cyan-300 mb-3 tracking-wider">
            Summary Insight ({range})
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            ShieldEye observed higher activity from{" "}
            <span className="font-semibold">brute-force</span> and{" "}
            <span className="font-semibold">DDoS-related attacks</span> in the
            selected period. Most threats were automatically blocked, with a
            smaller number of manual interventions required. Overall risk level
            is{" "}
            <span className="text-yellow-300 font-bold">moderate</span>;
            recommended actions include tightening SSH access, rate limiting on
            public endpoints, and continuous monitoring of top malicious IPs.
          </p>
        </div>
      </div>

      {/* --- CUSTOM STYLES (Animations and Metric Card component) --- */}
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
        .metric-card-base {
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
        }
        .metric-card-base:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

// --- Reusable Metric Card Component ---
const colorMap = {
  cyan: {
    from: "#1b2227",
    to: "#12181b",
    border: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400/40",
    text: "text-cyan-400",
  },
  red: {
    from: "#211818",
    to: "#171010",
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-400/40",
    text: "text-red-400",
  },
  green: {
    from: "#16211b",
    to: "#0f1a13",
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-400/40",
    text: "text-green-400",
  },
  yellow: {
    from: "#2a2317",
    to: "#1b1710",
    border: "border-yellow-500/20",
    hoverBorder: "hover:border-yellow-400/40",
    text: "text-yellow-400",
  },
};

const MetricCard = ({ title, value, trend, trendColor, color, delay }) => {
  const c = colorMap[color] || colorMap.cyan;
  const isNegative = trend.startsWith("-");
  const Icon = TrendingUp;

  return (
    <div
      className={`group bg-gradient-to-br from-[${c.from}] to-[${c.to}] p-5 rounded-xl border ${c.border}
      ${c.hoverBorder} hover:shadow-2xl hover:shadow-[${color}-500/20] metric-card-base
      cursor-pointer relative overflow-hidden`}
      style={{ animation: `fadeInUp 0.5s ease-out ${delay} both` }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
        opacity-0 group-hover:opacity-40 translate-x-[-100%] group-hover:translate-x-[100%]
        transition-all duration-700"
      ></div>

      <div className="relative">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {title}
        </p>
        <h3 className={`text-4xl font-extrabold ${c.text} mt-2 tracking-tight`}>
          {value}
        </h3>

        <div
          className={`flex items-center gap-1 mt-3 text-sm font-semibold ${trendColor}`}
        >
          <Icon
            className={`w-4 h-4 ${isNegative ? "transform rotate-180" : ""}`}
          />
          <span>{trend}</span>
          <span className="text-gray-500 ml-2 text-xs font-normal">
            vs. previous period
          </span>
        </div>
      </div>
    </div>
  );
};
