import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useLivePackets } from "../context/LivePacketContext";

export default function TrafficChart() {
  const { packetsPerSec } = useLivePackets();
  const [data, setData] = useState({ x: [], y: [] });

  useEffect(() => {
    const now = new Date().toLocaleTimeString();

    setData((prev) => ({
      x: [...prev.x, now].slice(-20),
      y: [...prev.y, packetsPerSec].slice(-20),
    }));
  }, [packetsPerSec]);

  return (
    <div className="h-full w-full">
      <Plot
        data={[
          {
            x: data.x,
            y: data.y,
            type: "scatter",
            mode: "lines+markers",
            fill: "tozeroy",
            marker: { color: "#22d3ee", size: 6 },
            line: { color: "#22d3ee", width: 3, shape: "spline" },
            fillcolor: "rgba(34,211,238,0.15)",
          },
        ]}
        layout={{
          margin: { l: 40, r: 20, t: 10, b: 40 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: { color: "#9ca3af", gridcolor: "rgba(148,163,184,0.1)" },
          yaxis: {
            color: "#9ca3af",
            gridcolor: "rgba(148,163,184,0.1)",
            title: { text: "Packets/sec", font: { size: 11 } },
          },
          showlegend: false,
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
