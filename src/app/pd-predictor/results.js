'use client';
import { useEffect, useState } from "react";
import { Line, Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler
} from "chart.js";
import { FaBrain, FaBalanceScale, FaChartLine, FaMicroscope, FaHeartbeat } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler
);

export default function Results({ prediction }) {
  const biomarkers = prediction.predicted_biomarkers;
  const [animated, setAnimated] = useState({
    caudateR: 0,
    caudateL: 0,
    putamenR: 0,
    putamenL: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated({
        caudateR: biomarkers.DATSCAN_CAUDATE_R,
        caudateL: biomarkers.DATSCAN_CAUDATE_L,
        putamenR: biomarkers.DATSCAN_PUTAMEN_R,
        putamenL: biomarkers.DATSCAN_PUTAMEN_L,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [biomarkers]);

  // ---- Chart Data ----
  const barData = {
    labels: ["Caudate R", "Caudate L", "Putamen R", "Putamen L"],
    datasets: [
      {
        label: "DaTscan Uptake",
        data: [
          animated.caudateR,
          animated.caudateL,
          animated.putamenR,
          animated.putamenL,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(236, 72, 153)",
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: ["Right Hemisphere", "Left Hemisphere", "Balance", "Motor Correlates", "Cognitive Correlates"],
    datasets: [
      {
        label: "Dopaminergic Integrity",
        data: [
          (animated.caudateR + animated.putamenR) / 2,
          (animated.caudateL + animated.putamenL) / 2,
          Math.abs(animated.caudateR - animated.caudateL) +
            Math.abs(animated.putamenR - animated.putamenL),
          animated.putamenR,
          animated.caudateL,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderColor: "rgb(59, 130, 246)",
        pointBackgroundColor: "rgb(59, 130, 246)",
      },
    ],
  };

  const lineData = {
    labels: ["Baseline", "Projection +1yr", "Projection +2yr"],
    datasets: [
      {
        label: "Average Uptake",
        data: [
          (animated.caudateR + animated.caudateL + animated.putamenR + animated.putamenL) / 4,
          (animated.caudateR + animated.caudateL + animated.putamenR + animated.putamenL) / 4 - 0.2,
          (animated.caudateR + animated.caudateL + animated.putamenR + animated.putamenL) / 4 - 0.5,
        ],
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(236, 72, 153)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        bodyColor: "#fff",
      },
    },
    scales: {
      r: { pointLabels: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  // ---- Imaginative Narrative ----
  const healthLevel =
    (animated.caudateR + animated.caudateL + animated.putamenR + animated.putamenL) / 4;
  let healthMessage, icon, color;
  if (healthLevel > 3.5) {
    healthMessage = "Excellent dopaminergic integrity 🌟 — minimal degeneration signs.";
    icon = <FaHeartbeat className="text-green-400 text-3xl animate-pulse" />;
    color = "bg-green-500/20 border-green-500/40";
  } else if (healthLevel > 2.5) {
    healthMessage = "Mild reduction in dopaminergic activity ⚖️ — keep monitoring regularly.";
    icon = <FaBalanceScale className="text-yellow-400 text-3xl animate-bounce" />;
    color = "bg-yellow-500/20 border-yellow-500/40";
  } else {
    healthMessage = "Noticeable dopaminergic decline 🧠 — clinical follow-up recommended.";
    icon = <FaMicroscope className="text-red-400 text-3xl animate-pulse" />;
    color = "bg-red-500/20 border-red-500/40";
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Summary Card */}
      <div className={`${color} backdrop-blur-xl rounded-3xl p-8 border shadow-xl transition-all duration-500`}>
        <div className="flex items-center gap-6">
          {icon}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Neuro-Imaging Insight</h3>
            <p className="text-white/80">{healthMessage}</p>
          </div>
        </div>
      </div>

      {/* Biomarker Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white/10 rounded-3xl p-6 border border-white/20 h-96">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaBrain /> Regional Uptake Distribution
          </h3>
          <Bar data={barData} options={chartOptions} />
        </div>

        {/* Radar Chart */}
        <div className="bg-white/10 rounded-3xl p-6 border border-white/20 h-96">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaChartLine /> Hemispheric & Cognitive Balance
          </h3>
          <Radar data={radarData} options={chartOptions} />
        </div>
      </div>

      {/* Line Projection */}
      <div className="bg-white/10 rounded-3xl p-6 border border-white/20 h-96">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaChartLine /> 2-Year Projection of Dopaminergic Integrity
        </h3>
        <Line data={lineData} options={chartOptions} />
      </div>
    </div>
  );
}
