import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function TrafficChart() {
  const [data, setData] = useState({
    x: [],
    y: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const value = Math.floor(Math.random() * 100) + 50;

      setData((prev) => {
        const newX = [...prev.x, timeStr].slice(-20);
        const newY = [...prev.y, value].slice(-20);
        return { x: newX, y: newY };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full">
      <h3 className="text-base font-semibold text-cyan-400 mb-3 tracking-wide flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
        Live Network Traffic
      </h3>
      <Plot
        data={[
          {
            x: data.x,
            y: data.y,
            type: "scatter",
            mode: "lines+markers",
            fill: "tozeroy",
            marker: {
              color: "#22d3ee",
              size: 8, // Slightly larger markers
              line: {
                color: "#06b6d4",
                width: 2
              }
            },
            line: {
              color: "#22d3ee",
              width: 4, // Thicker line for better visibility/smoothness
              shape: "spline",
              smoothing: 1.3
            },
            fillcolor: "rgba(34, 211, 238, 0.15)",
          },
        ]}
        layout={{
          margin: { l: 50, r: 20, t: 10, b: 50 }, // Increased margins for labels
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#e5e7eb", family: 'Inter, sans-serif' }, // Consistent font color
          xaxis: {
            color: "#a0a0a0",
            gridcolor: "rgba(255,255,255,0.1)", // Slightly brighter grid lines
            showgrid: true,
            tickfont: { size: 10 }
          },
          yaxis: {
            color: "#a0a0a0",
            gridcolor: "rgba(255,255,255,0.1)",
            showgrid: true,
            // Fixed range to reduce jitter and improve perceived smoothness
            range: [40, 160], 
            title: { 
              text: "Packets/sec (Live)", 
              font: { color: "#06b6d4", size: 12, weight: 'bold' } // Prominent Y-axis title
            },
            automargin: true,
          },
          showlegend: false,
          hovermode: 'x unified', // Clean, unified tooltip
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "calc(100% - 50px)" }} // Adjusted height calculation
      />
    </div>
  );
}