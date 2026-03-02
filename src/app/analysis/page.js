"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  FaExclamationTriangle,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import {
  ArrowLeft,
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  CircleDot,
  AlertTriangle,
  CheckCircle,
  Info,
  Minus,
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
  red:    "#f87171",
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

  const cx = 450;
  const cy = 260;

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

      {/* Green line → bottom left → projection 1yr */}
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

      {/* Legend */}
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

// ── Mini Sparkline SVG ────────────────────────────────────────────────────
function Sparkline({ data, color = COLORS.cyan, height = 56 }) {
  if (!data || data.length < 2) return null;
  const w = 300;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="spark-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L ${(data.length - 1) / (data.length - 1) * w},${h} L 0,${h} Z`}
        fill="url(#spark-g)"
      />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
    </svg>
  );
}

// ── Derive analytics from predictions[] ──────────────────────────────────
function deriveAnalytics(predictions) {
  if (!predictions || predictions.length === 0) return null;
  const n        = predictions.length;
  const months   = n - 1;
  const baseline = predictions[0];
  const final    = predictions[n - 1];
  const peak     = Math.max(...predictions);
  const diffs    = predictions.slice(1).map((v, i) => v - predictions[i]);
  const monthlyRate = months > 0 ? (final - baseline) / months : 0;
  const diffs2   = diffs.slice(1).map((v, i) => v - diffs[i]);
  const acceleration = diffs2.length > 0 ? diffs2.reduce((a, b) => a + b, 0) / diffs2.length : 0;
  const idx12    = Math.min(12, n - 1);
  const at12     = predictions[idx12];
  const riskTier = at12 < 10 ? "Low" : at12 < 25 ? "Moderate" : "High";
  const riskColor = at12 < 10 ? COLORS.green : at12 < 25 ? COLORS.yellow : COLORS.red;
  const criticalMonth = predictions.findIndex((v) => v >= 20);
  const severeMonth   = predictions.findIndex((v) => v >= 40);
  return { n, months, baseline, final, peak, monthlyRate, acceleration, riskTier, riskColor, at12, criticalMonth, severeMonth, predictions };
}

// ── Rule-based clinical recommendations ──────────────────────────────────
function getRecommendations(a) {
  const recs = [];
  if (a.riskTier === "High")
    recs.push({ text: "High-risk trajectory — consider neurology referral and DBS evaluation.", color: COLORS.red, icon: AlertTriangle });
  if (a.riskTier === "Moderate")
    recs.push({ text: "Moderate progression — continue current therapy and reassess in 6 months.", color: COLORS.yellow, icon: Info });
  if (a.riskTier === "Low")
    recs.push({ text: "Low-risk trajectory — maintain current management and monitor annually.", color: COLORS.green, icon: CheckCircle });
  if (a.monthlyRate > 0.6)
    recs.push({ text: `Rapid progression (+${a.monthlyRate.toFixed(2)}/mo) — therapy intensification warranted.`, color: COLORS.orange, icon: AlertTriangle });
  if (a.acceleration > 0.05)
    recs.push({ text: "Disease is accelerating — more frequent follow-up recommended.", color: COLORS.orange, icon: AlertTriangle });
  if (a.criticalMonth !== -1)
    recs.push({ text: `Moderate threshold (≥20) projected at month ${a.criticalMonth}.`, color: COLORS.orange, icon: Info });
  if (a.severeMonth !== -1)
    recs.push({ text: `Severe threshold (≥40) projected at month ${a.severeMonth} — proactive care planning.`, color: COLORS.red, icon: AlertTriangle });
  if (a.criticalMonth === -1)
    recs.push({ text: "No threshold crossing within the prediction window — favorable outlook.", color: COLORS.green, icon: CheckCircle });
  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════
export default function AnalysisPage() {
  const router = useRouter();
  const [prediction, setPrediction] = useState(null);
  const [analytics,  setAnalytics]  = useState(null);
  const [bioFeatures, setBioFeatures] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/");
      setLoading(false);
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.push("/");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neurocron_prediction");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrediction(parsed);
        setAnalytics(deriveAnalytics(parsed.predictions));
      }
      const storedBio = localStorage.getItem("neurocron_bio_features");
      if (storedBio) setBioFeatures(JSON.parse(storedBio));
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

  // ── DaTscan values — use real inputs if available, else sensible defaults
  const caudateR  = bioFeatures?.datscan_right_caudate  ?? 2.8;
  const caudateL  = bioFeatures?.datscan_left_caudate   ?? 2.6;
  const putamenR  = bioFeatures?.datscan_right_putamen  ?? 2.1;
  const putamenL  = bioFeatures?.datscan_left_putamen   ?? 1.9;

  const avgUptake     = (caudateR + caudateL + putamenR + putamenL) / 4;
  const asymmetry     = Math.abs(caudateR - caudateL) + Math.abs(putamenR - putamenL);

  // Contextual projections: if we have predictions, derive from them; else use biological approximation
  const a = analytics;
  const projection1yr = a ? a.predictions[Math.min(12, a.n - 1)] : avgUptake - 0.2;
  const projection2yr = a ? a.predictions[Math.min(24, a.n - 1)] : avgUptake - 0.5;
  const riskScore     = a
    ? Math.max(0, Math.min(100, (a.at12 / 60) * 100))
    : Math.max(0, Math.min(100, (1 - avgUptake / 5) * 100));

  let healthLevel, healthLabel, healthColor;
  if (avgUptake > 3.5) {
    healthLevel = "good";     healthLabel = "Excellent dopaminergic integrity";  healthColor = COLORS.green;
  } else if (avgUptake > 2.5) {
    healthLevel = "moderate"; healthLabel = "Mild reduction — monitor regularly"; healthColor = COLORS.yellow;
  } else {
    healthLevel = "low";      healthLabel = "Noticeable decline — follow-up rec."; healthColor = COLORS.orange;
  }

  const mapData = { caudateR, caudateL, putamenR, putamenL, avgUptake, asymmetry, projection1yr, projection2yr, riskScore, healthLevel, healthLabel, healthColor };

  const recs = a ? getRecommendations(a) : [];

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
                if (prediction) {
                  const blob = new Blob([JSON.stringify(prediction, null, 2)], { type: "application/json" });
                  const url  = URL.createObjectURL(blob);
                  const el   = document.createElement("a"); el.href = url;
                  el.download = "neuro_analysis.json"; el.click();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
            >
              <FaFileAlt size={12} /> Export
            </button>
            <button
              onClick={() => router.push("/pd-predictor")}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <FaRedoAlt size={12} /> New Analysis
            </button>
          </div>
        </motion.header>

        {/* ── Main 3-column grid (original layout) ── */}
        <div className="flex-1 grid grid-cols-12 gap-0 p-6 gap-6">

          {/* LEFT PANEL — DaTscan Metrics + Prediction Summary */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-3 flex flex-col gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl overflow-y-auto"
          >
            {/* DaTscan hemisphere metrics */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Right Hemisphere</p>
              <MetricCard label="Caudate R" value={caudateR} unit="SBR" color={COLORS.cyan} barPercent={caudateR / 5 * 100} delay={0.4} />
              <div className="mt-3">
                <MetricCard label="Putamen R" value={putamenR} unit="SBR" color={COLORS.cyan} barPercent={putamenR / 5 * 100} delay={0.5} />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Left Hemisphere</p>
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

            {/* ── Prediction summary (only when data present) ── */}
            {a && (
              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-500">Progression Model</p>
                <MetricCard label="Baseline UPDRS" value={a.baseline.toFixed(2)} unit="" color={COLORS.cyan} delay={1.3} />
                <MetricCard label={`Final (${a.months}m)`} value={a.final.toFixed(2)} unit="" color={COLORS.purple} barPercent={(a.final / 60) * 100} delay={1.4} />
                <MetricCard label="Monthly Rate" value={`+${a.monthlyRate.toFixed(3)}`} unit="/mo" color={COLORS.yellow} delay={1.5} />
              </div>
            )}
          </motion.aside>

          {/* CENTER — Metro Map + sparkline */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-6 flex flex-col gap-4"
          >
            {/* Title band */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                Dopaminergic Connectivity Map
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            {/* SVG container */}
            <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-4 min-h-[380px] relative overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-purple-500/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-yellow-500/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-orange-500/20 rounded-br-2xl" />
              <MetroMap data={mapData} />
            </div>

            {/* ── Predictions Sparkline (only when data present) ── */}
            {a && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    UPDRS Progression Forecast · {a.months} months
                  </span>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Start: <span className="text-cyan-400 font-bold">{a.baseline.toFixed(1)}</span></span>
                    <span>Peak: <span className="text-orange-400 font-bold">{a.peak.toFixed(1)}</span></span>
                    <span>End: <span className="text-purple-400 font-bold">{a.final.toFixed(1)}</span></span>
                  </div>
                </div>
                <Sparkline data={a.predictions} color={COLORS.cyan} height={64} />
                {/* Threshold markers legend */}
                <div className="flex gap-6 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-yellow-400" />
                    <span>Moderate ≥20</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-red-400" />
                    <span>Severe ≥40</span>
                  </div>
                  {a.criticalMonth !== -1 && (
                    <span className="text-yellow-400">Moderate at m{a.criticalMonth}</span>
                  )}
                  {a.severeMonth !== -1 && (
                    <span className="text-red-400">Severe at m{a.severeMonth}</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Legend row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"
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

          {/* RIGHT PANEL — Contextual Projections + Clinical Recommendations */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-3 flex flex-col gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl overflow-y-auto"
          >
            {/* Progression Projections */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Progression Projections
              </p>
              <MetricCard label="Baseline Avg" value={avgUptake} unit="SBR" color={COLORS.white} delay={0.8} />
              <div className="mt-3">
                <MetricCard label="+1 Year Projection" value={projection1yr} unit={a ? "UPDRS" : "SBR"} color={COLORS.green} barPercent={projection1yr / (a ? 60 : 5) * 100} delay={0.9} />
              </div>
              <div className="mt-3">
                <MetricCard label="+2 Year Projection" value={projection2yr} unit={a ? "UPDRS" : "SBR"} color={COLORS.green} barPercent={projection2yr / (a ? 60 : 5) * 100} delay={1.0} />
              </div>
            </div>

            {/* Risk Classification Badge */}
            {a && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="rounded-2xl p-4 text-center border"
                style={{
                  backgroundColor: `${a.riskColor}18`,
                  borderColor: `${a.riskColor}44`,
                  color: a.riskColor,
                }}
              >
                <FaShieldAlt className="text-2xl mx-auto mb-2" />
                <p className="font-bold text-lg">{a.riskTier} Risk</p>
                <p className="text-xs text-slate-400 mt-1">
                  Score at 12 m: <span className="font-semibold text-white">{a.at12.toFixed(1)}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {a.riskTier === "Low"      && "Below 10 — benign early trajectory."}
                  {a.riskTier === "Moderate" && "10–25 — moderate impact, monitor closely."}
                  {a.riskTier === "High"     && "Above 25 — significant impairment projected."}
                </p>
              </motion.div>
            )}

            {/* Clinical Recommendations — rule-based */}
            {a && recs.length > 0 && (
              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                  Clinical Recommendations
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="space-y-2"
                >
                  {recs.map(({ text, color, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + i * 0.12 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={13} style={{ color }} className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Static clinical context (always visible) */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Clinical Context</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: a ? 2.0 : 1.4 }}
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
                    desc: "LSSM-predicted UPDRS trajectory. Higher values indicate more severe motor impairment.",
                  },
                  {
                    icon: Info,
                    color: COLORS.purple,
                    title: "Research Use Only",
                    desc: "This tool is for research and educational purposes. Not for clinical diagnosis.",
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <Icon size={14} style={{ color }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-300 mb-1">{title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
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
