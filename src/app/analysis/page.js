"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView } from "framer-motion";
import Sidebar from "../../components/SideBar";
import { supabase } from "../../lib/supabaseClient";
import {
  FaSnowflake,
  FaBrain,
  FaRedoAlt,
  FaFileAlt,
  FaHeartbeat,
  FaBalanceScale,
  FaMicroscope,
} from "react-icons/fa";
import {
  ArrowLeft,
  Activity,
  Zap,
  TrendingDown,
  CircleDot,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

// ── Metro Line colors ──────────────────────────────────────────────────────
const COLORS = {
  cyan:   "#00d4ff",
  yellow: "#f5c518",
  purple: "#a855f7",
  green:  "#22d3a5",
  orange: "#f97316",
  pink:   "#ec4899",
  white:  "#e2e8f0",
};

// ── Animated SVG Metro Line ───────────────────────────────────────────────
function MetroLine({ d, color, delay = 0, duration = 1.4, strokeWidth = 3 }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  return (
    <motion.path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={length}
      animate={{ strokeDashoffset: 0 }}
      transition={{ delay, duration, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
    />
  );
}

// ── Animated Node ─────────────────────────────────────────────────────────
function Node({ cx, cy, r = 8, color, delay = 0, children }) {
  return (
    <g>
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4, ease: "backOut" }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <motion.circle
        cx={cx} cy={cy} r={r * 1.8}
        fill={`${color}20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.6 }}
      />
      {children}
    </g>
  );
}

// ── SVG Text helper ───────────────────────────────────────────────────────
function SvgLabel({ x, y, text, subtext, color, anchor = "start", delay = 0.8 }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <text
        x={x} y={y}
        fill={color}
        fontSize="11"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
        textAnchor={anchor}
      >
        {text}
      </text>
      {subtext && (
        <text
          x={x} y={y + 14}
          fill="#94a3b8"
          fontSize="9"
          fontFamily="Inter, sans-serif"
          textAnchor={anchor}
        >
          {subtext}
        </text>
      )}
    </motion.g>
  );
}

// ── Main Metro Map SVG ────────────────────────────────────────────────────
function MetroMap({ data }) {
  const {
    caudateR, caudateL, putamenR, putamenL,
    healthLevel, healthLabel, healthColor,
    avgUptake, asymmetry, projection1yr, projection2yr,
    riskScore,
  } = data;

  // SVG viewBox: 0 0 900 520
  const cx = 450; // center x
  const cy = 260; // center y

  return (
    <svg
      viewBox="0 0 900 520"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      {/* Grid dots */}
      {Array.from({ length: 20 }, (_, i) =>
        Array.from({ length: 12 }, (_, j) => (
          <circle
            key={`${i}-${j}`}
            cx={i * 47 + 10} cy={j * 47 + 10}
            r="1" fill="#1e293b"
          />
        ))
      )}

      {/* ── METRO LINES ── */}

      {/* Cyan line → right → CAUDATE R */}
      <MetroLine d={`M${cx},${cy} L${cx+120},${cy} L${cx+180},${cy-60} L${cx+260},${cy-60}`} color={COLORS.cyan} delay={0.2} />
      {/* Cyan line → right → CAUDATE L */}
      <MetroLine d={`M${cx+120},${cy} L${cx+180},${cy+60} L${cx+260},${cy+60}`} color={COLORS.cyan} delay={0.4} />

      {/* Yellow line → left → PUTAMEN R */}
      <MetroLine d={`M${cx},${cy} L${cx-120},${cy} L${cx-180},${cy-60} L${cx-260},${cy-60}`} color={COLORS.yellow} delay={0.3} />
      {/* Yellow line → left → PUTAMEN L */}
      <MetroLine d={`M${cx-120},${cy} L${cx-180},${cy+60} L${cx-260},${cy+60}`} color={COLORS.yellow} delay={0.5} />

      {/* Purple line → top → Overall health */}
      <MetroLine d={`M${cx},${cy} L${cx},${cy-100} L${cx-60},${cy-160} L${cx-60},${cy-200}`} color={COLORS.purple} delay={0.6} />
      {/* Purple branch → asymmetry */}
      <MetroLine d={`M${cx},${cy-100} L${cx+80},${cy-160} L${cx+80},${cy-210}`} color={COLORS.purple} strokeWidth={2} delay={0.8} />

      {/* Green line → bottom left → progression */}
      <MetroLine d={`M${cx},${cy} L${cx-80},${cy+100} L${cx-160},${cy+140} L${cx-220},${cy+180}`} color={COLORS.green} delay={0.7} />
      {/* Green branch 2yr */}
      <MetroLine d={`M${cx-160},${cy+140} L${cx-100},${cy+180} L${cx-60},${cy+220}`} color={COLORS.green} strokeWidth={2} delay={0.9} />

      {/* Orange line → bottom right → risk score */}
      <MetroLine d={`M${cx},${cy} L${cx+80},${cy+100} L${cx+160},${cy+140} L${cx+240},${cy+180}`} color={COLORS.orange} delay={0.8} />
      {/* Pink branch → avg uptake */}
      <MetroLine d={`M${cx+80},${cy+100} L${cx+80},${cy+170} L${cx+80},${cy+220}`} color={COLORS.pink} strokeWidth={2} delay={1.0} />

      {/* ── NODES ── */}

      {/* Central Hub */}
      <Node cx={cx} cy={cy} r={18} color="#1e3a5f" delay={0}>
        <motion.circle
          cx={cx} cy={cy} r={22}
          fill="none" stroke={COLORS.white}
          strokeWidth={1.5} strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, rotate: 360 }}
          transition={{ delay: 0.2, duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </Node>

      {/* Cyan nodes — Right hemisphere */}
      <Node cx={cx+260} cy={cy-60} r={7} color={COLORS.cyan} delay={0.9} />
      <Node cx={cx+260} cy={cy+60} r={7} color={COLORS.cyan} delay={1.0} />
      <Node cx={cx+120} cy={cy}    r={5} color={COLORS.cyan} delay={0.5} />

      {/* Yellow nodes — Left hemisphere */}
      <Node cx={cx-260} cy={cy-60} r={7} color={COLORS.yellow} delay={0.9} />
      <Node cx={cx-260} cy={cy+60} r={7} color={COLORS.yellow} delay={1.0} />
      <Node cx={cx-120} cy={cy}    r={5} color={COLORS.yellow} delay={0.5} />

      {/* Purple nodes — Top */}
      <Node cx={cx-60} cy={cy-200} r={7} color={COLORS.purple} delay={1.1} />
      <Node cx={cx+80} cy={cy-210} r={6} color={COLORS.purple} delay={1.2} />

      {/* Green nodes — Bottom left */}
      <Node cx={cx-220} cy={cy+180} r={7} color={COLORS.green} delay={1.1} />
      <Node cx={cx-60}  cy={cy+220} r={6} color={COLORS.green} delay={1.2} />

      {/* Orange/Pink nodes — Bottom right */}
      <Node cx={cx+240} cy={cy+180} r={7} color={COLORS.orange} delay={1.1} />
      <Node cx={cx+80}  cy={cy+220} r={6} color={COLORS.pink}   delay={1.2} />

      {/* Intermediate nodes */}
      <Node cx={cx} cy={cy-100} r={4} color={COLORS.purple} delay={0.7} />
      <Node cx={cx-80} cy={cy+100} r={4} color={COLORS.green} delay={0.8} />
      <Node cx={cx+80} cy={cy+100} r={4} color={COLORS.orange} delay={0.8} />

      {/* ── LABELS ── */}

      {/* Center label */}
      <SvgLabel x={cx} y={cy-28} text="DATSCAN ANALYSIS" color={COLORS.white} anchor="middle" delay={0.3} />
      <SvgLabel x={cx} y={cy+42} text="NeuroCron · Flake AI" color="#64748b" anchor="middle" delay={0.4} />

      {/* Caudate R */}
      <SvgLabel x={cx+270} y={cy-68} text={`CAUDATE R`} subtext={`${caudateR.toFixed(3)} SBR`} color={COLORS.cyan} delay={1.0} />
      {/* Caudate L */}
      <SvgLabel x={cx+270} y={cy+52} text={`CAUDATE L`} subtext={`${caudateL.toFixed(3)} SBR`} color={COLORS.cyan} delay={1.1} />

      {/* Putamen R */}
      <SvgLabel x={cx-265} y={cy-68} text={`PUTAMEN R`} subtext={`${putamenR.toFixed(3)} SBR`} color={COLORS.yellow} anchor="end" delay={1.0} />
      {/* Putamen L */}
      <SvgLabel x={cx-265} y={cy+52} text={`PUTAMEN L`} subtext={`${putamenL.toFixed(3)} SBR`} color={COLORS.yellow} anchor="end" delay={1.1} />

      {/* Overall health */}
      <SvgLabel x={cx-65} y={cy-215} text="OVERALL STATUS" subtext={healthLabel} color={COLORS.purple} anchor="middle" delay={1.2} />
      {/* Asymmetry */}
      <SvgLabel x={cx+80} y={cy-225} text="ASYMMETRY" subtext={`${asymmetry.toFixed(2)} idx`} color={COLORS.purple} anchor="middle" delay={1.3} />

      {/* 1yr Projection */}
      <SvgLabel x={cx-225} y={cy+195} text="+1 YR PROJ." subtext={`${projection1yr.toFixed(3)} avg`} color={COLORS.green} anchor="end" delay={1.2} />
      {/* 2yr projection */}
      <SvgLabel x={cx-60} y={cy+236} text="+2 YR PROJ." subtext={`${projection2yr.toFixed(3)} avg`} color={COLORS.green} anchor="middle" delay={1.3} />

      {/* Risk Score */}
      <SvgLabel x={cx+245} y={cy+195} text="RISK INDEX" subtext={`${riskScore.toFixed(1)}%`} color={COLORS.orange} delay={1.2} />
      {/* Avg Uptake */}
      <SvgLabel x={cx+80} y={cy+236} text="AVG UPTAKE" subtext={`${avgUptake.toFixed(3)} SBR`} color={COLORS.pink} anchor="middle" delay={1.3} />

      {/* Legend line top-left */}
      <motion.text
        x={20} y={20}
        fill="#334155" fontSize="8" fontFamily="Inter, sans-serif"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      >
        THICKNESS = SIGNAL STRENGTH
      </motion.text>
      <MetroLine d="M20,26 L80,26" color={COLORS.cyan} delay={1.6} strokeWidth={2} duration={0.4} />
      <MetroLine d="M20,34 L60,34" color={COLORS.yellow} delay={1.7} strokeWidth={2} duration={0.3} />
      <MetroLine d="M20,42 L50,42" color={COLORS.purple} delay={1.8} strokeWidth={1.5} duration={0.3} />
    </svg>
  );
}

// ── Health Badge ──────────────────────────────────────────────────────────
function HealthBadge({ level, label, color }) {
  const icons = {
    good:     <FaHeartbeat className="text-2xl" />,
    moderate: <FaBalanceScale className="text-2xl" />,
    low:      <FaMicroscope className="text-2xl" />,
  };
  const bgColors = {
    good:     "from-green-900/60 to-green-800/30 border-green-500/40",
    moderate: "from-yellow-900/60 to-yellow-800/30 border-yellow-500/40",
    low:      "from-red-900/60 to-red-800/30 border-red-500/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className={`flex items-center gap-4 bg-gradient-to-r ${bgColors[level]} backdrop-blur-sm rounded-2xl p-5 border`}
      style={{ color }}
    >
      {icons[level]}
      <div>
        <p className="text-xs uppercase tracking-widest opacity-70">Dopaminergic Status</p>
        <p className="text-lg font-bold">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, color, icon: Icon, barPercent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-slate-400">{label}</span>
        {Icon && <Icon className="text-sm" style={{ color }} />}
      </div>
      <p className="text-2xl font-bold mb-2" style={{ color }}>
        {typeof value === "number" ? value.toFixed(3) : value}
        <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
      </p>
      {barPercent !== undefined && (
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, barPercent)}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [prediction, setPrediction] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Load user session
//     const check = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) router.push("/");
//       setLoading(false);
//     };
//     check();
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
//       if (!s) router.push("/");
//     });
//     return () => subscription.unsubscribe();
//   }, [router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neurocron_prediction");
      if (stored) setPrediction(JSON.parse(stored));
    } catch (_) {}
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut().catch(() => {});
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto" />
    </div>
  );
  if (signingOut) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-purple-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4" />
        <p>Exiting...</p>
      </div>
    </div>
  );

  // ── Derived data ────────────────────────────────────────────────────────
  const biomarkers = prediction?.predicted_biomarkers;
  const caudateR   = biomarkers?.DATSCAN_CAUDATE_R ?? 2.8;
  const caudateL   = biomarkers?.DATSCAN_CAUDATE_L ?? 2.6;
  const putamenR   = biomarkers?.DATSCAN_PUTAMEN_R ?? 2.1;
  const putamenL   = biomarkers?.DATSCAN_PUTAMEN_L ?? 1.9;

  const avgUptake     = (caudateR + caudateL + putamenR + putamenL) / 4;
  const asymmetry     = Math.abs(caudateR - caudateL) + Math.abs(putamenR - putamenL);
  const projection1yr = avgUptake - 0.2;
  const projection2yr = avgUptake - 0.5;
  const riskScore     = Math.max(0, Math.min(100, (1 - avgUptake / 5) * 100));

  let healthLevel, healthLabel, healthColor;
  if (avgUptake > 3.5) {
    healthLevel = "good";     healthLabel = "Excellent dopaminergic integrity";  healthColor = COLORS.green;
  } else if (avgUptake > 2.5) {
    healthLevel = "moderate"; healthLabel = "Mild reduction — monitor regularly"; healthColor = COLORS.yellow;
  } else {
    healthLevel = "low";      healthLabel = "Noticeable decline — follow-up rec."; healthColor = COLORS.orange;
  }

  const mapData = { caudateR, caudateL, putamenR, putamenL, avgUptake, asymmetry, projection1yr, projection2yr, riskScore, healthLevel, healthLabel, healthColor };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <Sidebar onSignOut={handleSignOut} />

      {/* Background glow orbs — same as pd-predictor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 ml-16 min-h-screen flex flex-col">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-white/5"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/pd-predictor")}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Predictor</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <FaSnowflake className="text-cyan-400 text-lg" />
              </motion.div>
              <span className="text-sm font-semibold text-slate-300 tracking-widest uppercase">
                Analysis Report
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!prediction && (
              <span className="text-xs text-orange-400 bg-orange-400/10 rounded-full px-3 py-1 border border-orange-400/20">
                Demo data — run a prediction first
              </span>
            )}
            <button
              onClick={() => {
                if (prediction && biomarkers) {
                  const blob = new Blob([JSON.stringify(prediction, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url;
                  a.download = "neuro_analysis.json"; a.click();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
            >
              <FaFileAlt size={12} />
              Export
            </button>
            <button
              onClick={() => router.push("/pd-predictor")}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <FaRedoAlt size={12} />
              New Analysis
            </button>
          </div>
        </motion.header>

        {/* Main grid */}
        <div className="flex-1 grid grid-cols-12 gap-0 p-6 gap-6">

          {/* LEFT PANEL — Metrics */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-3 flex flex-col gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Right Hemisphere
              </p>
              <MetricCard label="Caudate R" value={caudateR} unit="SBR" color={COLORS.cyan} barPercent={caudateR / 5 * 100} delay={0.4} />
              <div className="mt-3">
                <MetricCard label="Putamen R" value={putamenR} unit="SBR" color={COLORS.cyan} barPercent={putamenR / 5 * 100} delay={0.5} />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Left Hemisphere
              </p>
              <MetricCard label="Caudate L" value={caudateL} unit="SBR" color={COLORS.yellow} barPercent={caudateL / 5 * 100} delay={0.6} />
              <div className="mt-3">
                <MetricCard label="Putamen L" value={putamenL} unit="SBR" color={COLORS.yellow} barPercent={putamenL / 5 * 100} delay={0.7} />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <HealthBadge level={healthLevel} label={healthLabel} color={healthColor} />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-500">Summary Metrics</p>
              <MetricCard label="Avg Uptake" value={avgUptake} unit="SBR" color={COLORS.pink} barPercent={avgUptake / 5 * 100} delay={1.0} />
              <MetricCard label="Asymmetry Index" value={asymmetry} unit="" color={COLORS.purple} barPercent={asymmetry * 10} delay={1.1} />
              <MetricCard label="Risk Score" value={riskScore.toFixed(1)} unit="%" color={COLORS.orange} barPercent={riskScore} delay={1.2} />
            </div>
          </motion.aside>

          {/* CENTER — Metro Map */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-6 flex flex-col"
          >
            {/* Title band */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                Dopaminergic Connectivity Map
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            {/* SVG container */}
            <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-4 min-h-[440px] relative overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-purple-500/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-yellow-500/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-orange-500/20 rounded-br-2xl" />

              <MetroMap data={mapData} />
            </div>

            {/* Legend row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"
            >
              {[
                { color: COLORS.cyan,   label: "Caudate" },
                { color: COLORS.yellow, label: "Putamen" },
                { color: COLORS.purple, label: "Health / Asymmetry" },
                { color: COLORS.green,  label: "Progression" },
                { color: COLORS.orange, label: "Risk" },
                { color: COLORS.pink,   label: "Avg Uptake" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="h-2 w-6 rounded-full" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.main>

          {/* RIGHT PANEL — Projections & info */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-3 flex flex-col gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Progression Projections
              </p>
              <MetricCard label="Baseline Avg" value={avgUptake} unit="SBR" color={COLORS.white} delay={0.8} />
              <div className="mt-3">
                <MetricCard label="+1 Year Projection" value={projection1yr} unit="SBR" color={COLORS.green} barPercent={projection1yr / 5 * 100} delay={0.9} />
              </div>
              <div className="mt-3">
                <MetricCard label="+2 Year Projection" value={projection2yr} unit="SBR" color={COLORS.green} barPercent={projection2yr / 5 * 100} delay={1.0} />
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Clinical Context
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="space-y-3"
              >
                {[
                  {
                    icon: Activity,
                    color: COLORS.cyan,
                    title: "Striatal Binding Ratio (SBR)",
                    desc: "Measures dopamine transporter density. Normal range 2.5–5.0 SBR.",
                  },
                  {
                    icon: CircleDot,
                    color: COLORS.yellow,
                    title: "Hemispheric Asymmetry",
                    desc: "Difference between right and left dopaminergic activity. PD often shows asymmetric onset.",
                  },
                  {
                    icon: TrendingDown,
                    color: COLORS.orange,
                    title: "Progression Model",
                    desc: "Linear approximation of dopaminergic decline over time based on current biomarkers.",
                  },
                  {
                    icon: Info,
                    color: COLORS.purple,
                    title: "Research Use Only",
                    desc: "This tool is for research and educational purposes. Not for clinical diagnosis.",
                  },
                ].map(({ icon: Icon, color, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.15 }}
                    className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <Icon size={14} style={{ color }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-300 mb-1">{title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Footer stamp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-auto pt-4 border-t border-white/5 text-center"
            >
              <p className="text-xs text-slate-600">© 2026 SnowFlake Research Laboratory</p>
              <p className="text-xs text-slate-700">NeuroCron · Advanced Neuro-Imaging Analytics</p>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
