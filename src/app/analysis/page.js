
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

// ── Design Tokens (aligned with homepage) ────────────────────────────────
const GOLD    = "#c8a96e";
const CHARCOAL = "#08090d";

// ── Metro Line signal colors ──────────────────────────────────────────────
const COLORS = {
  cyan:   "#4a90d9",   // desaturated blue — more formal
  yellow: "#c8a96e",   // repurposed to gold
  purple: "#7b8fa8",
  green:  "#5a9e8a",
  orange: "#b87c50",
  pink:   "#9e7a9e",
  white:  "#d1dce8",
  red:    "#b05a5a",
};

// ── Animated SVG Metro Line ───────────────────────────────────────────────
function MetroLine({ d, color, delay = 0, duration = 1.4, strokeWidth = 2 }) {
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
      style={{ filter: `drop-shadow(0 0 4px ${color}55)` }}
    />
  );
}

// ── Animated Node ─────────────────────────────────────────────────────────
function Node({ cx, cy, r = 6, color, delay = 0, children }) {
  return (
    <g>
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4, ease: "backOut" }}
        style={{ filter: `drop-shadow(0 0 5px ${color}88)` }}
      />
      <motion.circle
        cx={cx} cy={cy} r={r * 2}
        fill={`${color}15`}
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
      <text x={x} y={y} fill={color} fontSize="10" fontWeight="600"
        fontFamily="'DM Sans', sans-serif" textAnchor={anchor} letterSpacing="0.08em">
        {text}
      </text>
      {subtext && (
        <text x={x} y={y + 13} fill="#4a5568" fontSize="9"
          fontFamily="'DM Sans', sans-serif" textAnchor={anchor}>
          {subtext}
        </text>
      )}
    </motion.g>
  );
}

// ── Main Metro Map SVG ────────────────────────────────────────────────────
function MetroMap({ data }) {
  const { caudateR, caudateL, putamenR, putamenL, healthLabel, avgUptake, asymmetry, projection1yr, projection2yr, riskScore } = data;
  const cx = 450, cy = 260;

  return (
    <svg viewBox="0 0 900 520" className="w-full h-full" style={{ overflow: "visible" }}>
      {/* Subtle dot grid */}
      {Array.from({ length: 20 }, (_, i) =>
        Array.from({ length: 12 }, (_, j) => (
          <circle key={`${i}-${j}`} cx={i * 47 + 10} cy={j * 47 + 10} r="1" fill="#1a2030" />
        ))
      )}

      {/* ── LINES ── */}
      <MetroLine d={`M${cx},${cy} L${cx+120},${cy} L${cx+180},${cy-60} L${cx+260},${cy-60}`} color={COLORS.cyan}   delay={0.2} />
      <MetroLine d={`M${cx+120},${cy} L${cx+180},${cy+60} L${cx+260},${cy+60}`}              color={COLORS.cyan}   delay={0.4} />
      <MetroLine d={`M${cx},${cy} L${cx-120},${cy} L${cx-180},${cy-60} L${cx-260},${cy-60}`} color={COLORS.yellow} delay={0.3} />
      <MetroLine d={`M${cx-120},${cy} L${cx-180},${cy+60} L${cx-260},${cy+60}`}              color={COLORS.yellow} delay={0.5} />
      <MetroLine d={`M${cx},${cy} L${cx},${cy-100} L${cx-60},${cy-160} L${cx-60},${cy-200}`} color={COLORS.purple} delay={0.6} />
      <MetroLine d={`M${cx},${cy-100} L${cx+80},${cy-160} L${cx+80},${cy-210}`}              color={COLORS.purple} strokeWidth={1.5} delay={0.8} />
      <MetroLine d={`M${cx},${cy} L${cx-80},${cy+100} L${cx-160},${cy+140} L${cx-220},${cy+180}`} color={COLORS.green} delay={0.7} />
      <MetroLine d={`M${cx-160},${cy+140} L${cx-100},${cy+180} L${cx-60},${cy+220}`}        color={COLORS.green}  strokeWidth={1.5} delay={0.9} />
      <MetroLine d={`M${cx},${cy} L${cx+80},${cy+100} L${cx+160},${cy+140} L${cx+240},${cy+180}`} color={COLORS.orange} delay={0.8} />
      <MetroLine d={`M${cx+80},${cy+100} L${cx+80},${cy+220}`}                              color={COLORS.pink}   strokeWidth={1.5} delay={1.0} />

      {/* ── NODES ── */}
      {/* Central hub */}
      <Node cx={cx} cy={cy} r={16} color="#0d1520" delay={0}>
        <motion.circle cx={cx} cy={cy} r={20} fill="none"
          stroke={GOLD} strokeWidth={1} strokeDasharray="3 4" strokeOpacity={0.4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ delay: 0.2, duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </Node>

      <Node cx={cx+260} cy={cy-60} r={6} color={COLORS.cyan}   delay={0.9} />
      <Node cx={cx+260} cy={cy+60} r={6} color={COLORS.cyan}   delay={1.0} />
      <Node cx={cx+120} cy={cy}    r={4} color={COLORS.cyan}   delay={0.5} />
      <Node cx={cx-260} cy={cy-60} r={6} color={COLORS.yellow} delay={0.9} />
      <Node cx={cx-260} cy={cy+60} r={6} color={COLORS.yellow} delay={1.0} />
      <Node cx={cx-120} cy={cy}    r={4} color={COLORS.yellow} delay={0.5} />
      <Node cx={cx-60}  cy={cy-200} r={6} color={COLORS.purple} delay={1.1} />
      <Node cx={cx+80}  cy={cy-210} r={5} color={COLORS.purple} delay={1.2} />
      <Node cx={cx-220} cy={cy+180} r={6} color={COLORS.green}  delay={1.1} />
      <Node cx={cx-60}  cy={cy+220} r={5} color={COLORS.green}  delay={1.2} />
      <Node cx={cx+240} cy={cy+180} r={6} color={COLORS.orange} delay={1.1} />
      <Node cx={cx+80}  cy={cy+220} r={5} color={COLORS.pink}   delay={1.2} />
      <Node cx={cx}     cy={cy-100} r={3} color={COLORS.purple} delay={0.7} />
      <Node cx={cx-80}  cy={cy+100} r={3} color={COLORS.green}  delay={0.8} />
      <Node cx={cx+80}  cy={cy+100} r={3} color={COLORS.orange} delay={0.8} />

      {/* ── LABELS ── */}
      <SvgLabel x={cx}      y={cy-26} text="DATSCAN ANALYSIS"    color={COLORS.white} anchor="middle" delay={0.3} />
      <SvgLabel x={cx}      y={cy+40} text="NeuroCron · Flake AI" color="#2d3748"     anchor="middle" delay={0.4} />
      <SvgLabel x={cx+270}  y={cy-68} text="CAUDATE R"  subtext={`${caudateR.toFixed(3)} SBR`}  color={COLORS.cyan}   delay={1.0} />
      <SvgLabel x={cx+270}  y={cy+52} text="CAUDATE L"  subtext={`${caudateL.toFixed(3)} SBR`}  color={COLORS.cyan}   delay={1.1} />
      <SvgLabel x={cx-265}  y={cy-68} text="PUTAMEN R"  subtext={`${putamenR.toFixed(3)} SBR`}  color={COLORS.yellow} anchor="end" delay={1.0} />
      <SvgLabel x={cx-265}  y={cy+52} text="PUTAMEN L"  subtext={`${putamenL.toFixed(3)} SBR`}  color={COLORS.yellow} anchor="end" delay={1.1} />
      <SvgLabel x={cx-65}   y={cy-215} text="OVERALL STATUS" subtext={healthLabel}                color={COLORS.purple} anchor="middle" delay={1.2} />
      <SvgLabel x={cx+80}   y={cy-225} text="ASYMMETRY" subtext={`${asymmetry.toFixed(2)} idx`}  color={COLORS.purple} anchor="middle" delay={1.3} />
      <SvgLabel x={cx-225}  y={cy+195} text="+1 YR PROJ." subtext={`${projection1yr.toFixed(3)} avg`} color={COLORS.green}  anchor="end" delay={1.2} />
      <SvgLabel x={cx-60}   y={cy+236} text="+2 YR PROJ." subtext={`${projection2yr.toFixed(3)} avg`} color={COLORS.green}  anchor="middle" delay={1.3} />
      <SvgLabel x={cx+245}  y={cy+195} text="RISK INDEX"  subtext={`${riskScore.toFixed(1)}%`}   color={COLORS.orange} delay={1.2} />
      <SvgLabel x={cx+80}   y={cy+236} text="AVG UPTAKE"  subtext={`${avgUptake.toFixed(3)} SBR`} color={COLORS.pink}  anchor="middle" delay={1.3} />

      {/* Legend */}
      <motion.text x={20} y={20} fill="#1e2d40" fontSize="7.5"
        fontFamily="'DM Sans', sans-serif" letterSpacing="0.15em"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        SIGNAL STRENGTH
      </motion.text>
      <MetroLine d="M20,26 L80,26" color={COLORS.cyan}   delay={1.6} strokeWidth={1.5} duration={0.4} />
      <MetroLine d="M20,34 L60,34" color={COLORS.yellow} delay={1.7} strokeWidth={1.5} duration={0.3} />
      <MetroLine d="M20,42 L50,42" color={COLORS.purple} delay={1.8} strokeWidth={1}   duration={0.3} />
    </svg>
  );
}

// ── Health Badge ──────────────────────────────────────────────────────────
function HealthBadge({ level, label, color }) {
  const icons = {
    good:     <FaHeartbeat className="text-lg" />,
    moderate: <FaBalanceScale className="text-lg" />,
    low:      <FaMicroscope className="text-lg" />,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="flex items-center gap-4 rounded-sm p-4 border"
      style={{
        backgroundColor: `${color}0d`,
        borderColor: `${color}30`,
        color,
      }}
    >
      {icons[level]}
      <div>
        <p className="label-xs mb-0.5" style={{ color: "#6b7d8f" }}>Dopaminergic Status</p>
        <p className="font-display text-base font-light">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, color, icon: Icon, barPercent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-sm p-4 border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="label-xs" style={{ color: "#4a5568" }}>{label}</span>
        {Icon && <Icon className="text-xs" style={{ color }} />}
      </div>
      <p className="font-display text-2xl font-light mb-2" style={{ color }}>
        {typeof value === "number" ? value.toFixed(3) : value}
        <span className="font-body text-xs font-normal ml-1.5" style={{ color: "#4a5568" }}>{unit}</span>
      </p>
      {barPercent !== undefined && (
        <div className="h-px w-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, barPercent)}%` }}
            transition={{ delay: delay + 0.2, duration: 0.9, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ── Mini Sparkline SVG ────────────────────────────────────────────────────
function Sparkline({ data, color = COLORS.cyan, height = 56 }) {
  if (!data || data.length < 2) return null;
  const w = 300, h = height;
  const min = Math.min(...data), max = Math.max(...data);
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
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${(data.length-1)/(data.length-1)*w},${h} L 0,${h} Z`} fill="url(#spark-g)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}66)` }} />
    </svg>
  );
}

// ── Analytics derivation ──────────────────────────────────────────────────
function deriveAnalytics(predictions) {
  if (!predictions || predictions.length === 0) return null;
  const n = predictions.length, months = n - 1;
  const baseline = predictions[0], final = predictions[n - 1];
  const peak = Math.max(...predictions);
  const diffs = predictions.slice(1).map((v, i) => v - predictions[i]);
  const monthlyRate = months > 0 ? (final - baseline) / months : 0;
  const diffs2 = diffs.slice(1).map((v, i) => v - diffs[i]);
  const acceleration = diffs2.length > 0 ? diffs2.reduce((a, b) => a + b, 0) / diffs2.length : 0;
  const idx12 = Math.min(12, n - 1), at12 = predictions[idx12];
  const riskTier  = at12 < 10 ? "Low" : at12 < 25 ? "Moderate" : "High";
  const riskColor = at12 < 10 ? COLORS.green : at12 < 25 ? COLORS.yellow : COLORS.red;
  const criticalMonth = predictions.findIndex((v) => v >= 20);
  const severeMonth   = predictions.findIndex((v) => v >= 40);
  return { n, months, baseline, final, peak, monthlyRate, acceleration, riskTier, riskColor, at12, criticalMonth, severeMonth, predictions };
}

function getRecommendations(a) {
  const recs = [];
  if (a.riskTier === "High")     recs.push({ text: "High-risk trajectory — consider neurology referral and DBS evaluation.", color: COLORS.red,    icon: AlertTriangle });
  if (a.riskTier === "Moderate") recs.push({ text: "Moderate progression — continue current therapy and reassess in 6 months.", color: COLORS.yellow, icon: Info });
  if (a.riskTier === "Low")      recs.push({ text: "Low-risk trajectory — maintain current management and monitor annually.", color: COLORS.green,  icon: CheckCircle });
  if (a.monthlyRate > 0.6)       recs.push({ text: `Rapid progression (+${a.monthlyRate.toFixed(2)}/mo) — therapy intensification warranted.`, color: COLORS.orange, icon: AlertTriangle });
  if (a.acceleration > 0.05)     recs.push({ text: "Disease is accelerating — more frequent follow-up recommended.", color: COLORS.orange, icon: AlertTriangle });
  if (a.criticalMonth !== -1)    recs.push({ text: `Moderate threshold (≥20) projected at month ${a.criticalMonth}.`, color: COLORS.orange, icon: Info });
  if (a.severeMonth !== -1)      recs.push({ text: `Severe threshold (≥40) projected at month ${a.severeMonth} — proactive care planning.`, color: COLORS.red, icon: AlertTriangle });
  if (a.criticalMonth === -1)    recs.push({ text: "No threshold crossing within the prediction window — favourable outlook.", color: COLORS.green, icon: CheckCircle });
  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════
export default function AnalysisPage() {
  const router = useRouter();
  const [prediction,   setPrediction]   = useState(null);
  const [analytics,    setAnalytics]    = useState(null);
  const [bioFeatures,  setBioFeatures]  = useState(null);
  const [signingOut,   setSigningOut]   = useState(false);
  const [loading,      setLoading]      = useState(false);

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
      if (stored) { const p = JSON.parse(stored); setPrediction(p); setAnalytics(deriveAnalytics(p.predictions)); }
      const storedBio = localStorage.getItem("neurocron_bio_features");
      if (storedBio) setBioFeatures(JSON.parse(storedBio));
    } catch (_) {}
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut().catch(() => {});
    router.push("/");
  };

  const Loader = ({ message = "" }) => (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
          <FaSnowflake className="text-3xl mx-auto mb-6" style={{ color: GOLD }} />
        </motion.div>
        {message && <p className="font-body text-sm tracking-widest" style={{ color: "#4a5568" }}>{message}</p>}
      </div>
    </div>
  );

  if (loading)    return <Loader />;
  if (signingOut) return <Loader message="Signing out..." />;

  const caudateR = bioFeatures?.datscan_right_caudate ?? 2.8;
  const caudateL = bioFeatures?.datscan_left_caudate  ?? 2.6;
  const putamenR = bioFeatures?.datscan_right_putamen ?? 2.1;
  const putamenL = bioFeatures?.datscan_left_putamen  ?? 1.9;

  const avgUptake = (caudateR + caudateL + putamenR + putamenL) / 4;
  const asymmetry = Math.abs(caudateR - caudateL) + Math.abs(putamenR - putamenL);

  const a = analytics;
  const projection1yr = a ? a.predictions[Math.min(12, a.n - 1)] : avgUptake - 0.2;
  const projection2yr = a ? a.predictions[Math.min(24, a.n - 1)] : avgUptake - 0.5;
  const riskScore     = a ? Math.max(0, Math.min(100, (a.at12 / 60) * 100)) : Math.max(0, Math.min(100, (1 - avgUptake / 5) * 100));

  let healthLevel, healthLabel, healthColor;
  if (avgUptake > 3.5)      { healthLevel = "good";     healthLabel = "Excellent dopaminergic integrity";    healthColor = COLORS.green;  }
  else if (avgUptake > 2.5) { healthLevel = "moderate"; healthLabel = "Mild reduction — monitor regularly";  healthColor = COLORS.yellow; }
  else                      { healthLevel = "low";      healthLabel = "Noticeable decline — follow-up rec."; healthColor = COLORS.orange; }

  const mapData = { caudateR, caudateL, putamenR, putamenL, avgUptake, asymmetry, projection1yr, projection2yr, riskScore, healthLevel, healthLabel, healthColor };
  const recs = a ? getRecommendations(a) : [];

  return (
    <>
      {/* ── Global fonts & shared styles ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif !important; }
        .font-body    { font-family: 'DM Sans', sans-serif !important; }
        body          { font-family: 'DM Sans', sans-serif; }
        .label-xs {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .divider { height: 1px; background: rgba(255,255,255,0.05); }
        .panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px;
        }
        .panel-scroll { overflow-y: auto; scrollbar-width: none; }
        .panel-scroll::-webkit-scrollbar { display: none; }
        .rec-pill {
          border-radius: 2px;
          padding: 10px 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .btn-ghost {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          background: transparent;
          cursor: pointer;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
        }
        .btn-ghost:hover {
          border-color: rgba(200,169,110,0.4);
          color: ${GOLD};
          background: rgba(200,169,110,0.04);
        }
        .btn-accent {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 1px solid rgba(200,169,110,0.3);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${GOLD};
          background: rgba(200,169,110,0.06);
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s;
        }
        .btn-accent:hover { background: rgba(200,169,110,0.12); border-color: rgba(200,169,110,0.55); }
      `}</style>

      <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#08090d" }}>
        <Sidebar onSignOut={handleSignOut} />

        {/* Ambient glow — restrained */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px]"
            style={{ background: "rgba(74,144,217,0.05)" }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full blur-[120px]"
            style={{ background: "rgba(200,169,110,0.04)" }} />
          {/* Dot-grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `radial-gradient(circle, #4a90d9 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 ml-16 min-h-screen flex flex-col">

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between px-8 pt-6 pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-5">
              <button
                onClick={() => router.push("/pd-predictor")}
                className="flex items-center gap-2 transition-colors duration-200 group cursor-pointer"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="label-xs">Back to Predictor</span>
              </button>

              <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)" }} />

              <div className="flex items-center gap-2.5">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
                  <FaSnowflake style={{ color: GOLD, fontSize: "0.9rem" }} />
                </motion.div>
                <span className="font-display text-base font-light tracking-widest" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Analysis Report
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!prediction && (
                <span className="label-xs px-3 py-1.5 rounded-sm"
                  style={{ color: COLORS.orange, background: `${COLORS.orange}0f`, border: `1px solid ${COLORS.orange}25` }}>
                  Demo data — run a prediction first
                </span>
              )}
              <button
                className="btn-ghost"
                onClick={() => {
                  if (prediction) {
                    const blob = new Blob([JSON.stringify(prediction, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const el = document.createElement("a"); el.href = url;
                    el.download = "neuro_analysis.json"; el.click();
                  }
                }}
              >
                <FaFileAlt size={10} /> Export
              </button>
              <button className="btn-accent" onClick={() => router.push("/pd-predictor")}>
                <FaRedoAlt size={10} /> New Analysis
              </button>
            </div>
          </motion.header>

          {/* ── 3-column layout ── */}
          <div className="flex-1 grid grid-cols-12 gap-5 p-6">

            {/* ─── LEFT PANEL ─── */}
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-3 panel panel-scroll flex flex-col gap-5 p-5"
            >
              {/* Right hemisphere */}
              <div>
                <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Right Hemisphere</p>
                <MetricCard label="Caudate R" value={caudateR} unit="SBR" color={COLORS.cyan}   barPercent={caudateR / 5 * 100} delay={0.4} />
                <div className="mt-3">
                  <MetricCard label="Putamen R" value={putamenR} unit="SBR" color={COLORS.cyan}   barPercent={putamenR / 5 * 100} delay={0.5} />
                </div>
              </div>

              <div className="divider" />

              {/* Left hemisphere */}
              <div>
                <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Left Hemisphere</p>
                <MetricCard label="Caudate L" value={caudateL} unit="SBR" color={COLORS.yellow} barPercent={caudateL / 5 * 100} delay={0.6} />
                <div className="mt-3">
                  <MetricCard label="Putamen L" value={putamenL} unit="SBR" color={COLORS.yellow} barPercent={putamenL / 5 * 100} delay={0.7} />
                </div>
              </div>

              <div className="divider" />
              <HealthBadge level={healthLevel} label={healthLabel} color={healthColor} />
              <div className="divider" />

              {/* Summary metrics */}
              <div>
                <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Summary Metrics</p>
                <div className="space-y-3">
                  <MetricCard label="Avg Uptake"      value={avgUptake}           unit="SBR" color={COLORS.pink}   barPercent={avgUptake / 5 * 100} delay={1.0} />
                  <MetricCard label="Asymmetry Index" value={asymmetry}           unit=""    color={COLORS.purple} barPercent={asymmetry * 10}       delay={1.1} />
                  <MetricCard label="Risk Score"      value={riskScore.toFixed(1)} unit="%"  color={COLORS.orange} barPercent={riskScore}             delay={1.2} />
                </div>
              </div>

              {/* Prediction summary */}
              {a && (
                <>
                  <div className="divider" />
                  <div>
                    <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Progression Model</p>
                    <div className="space-y-3">
                      <MetricCard label="Baseline UPDRS"    value={a.baseline.toFixed(2)} unit=""     color={COLORS.cyan}   delay={1.3} />
                      <MetricCard label={`Final (${a.months}m)`} value={a.final.toFixed(2)} unit="" color={COLORS.purple} barPercent={(a.final / 60) * 100} delay={1.4} />
                      <MetricCard label="Monthly Rate"      value={`+${a.monthlyRate.toFixed(3)}`} unit="/mo" color={COLORS.yellow} delay={1.5} />
                    </div>
                  </div>
                </>
              )}

              {/* Footer stamp */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="mt-auto pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="label-xs" style={{ color: "#1e2d3d", letterSpacing: "0.1em" }}>© 2026 SnowFlake Research Laboratory</p>
                <p className="label-xs mt-1" style={{ color: "#1a2535", letterSpacing: "0.1em" }}>NeuroCron · Advanced Neuro-Imaging Analytics</p>
              </motion.div>
            </motion.aside>

            {/* ─── CENTER ─── */}
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="col-span-6 flex flex-col gap-5"
            >
              {/* Section label */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(74,144,217,0.2))" }} />
                <span className="label-xs" style={{ color: "#2d3d50" }}>Dopaminergic Connectivity Map</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(200,169,110,0.2), transparent)" }} />
              </div>

              {/* SVG Metro Map */}
              <div className="flex-1 panel relative overflow-hidden p-4" style={{ minHeight: 380 }}>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderLeft: `1px solid ${COLORS.cyan}20`, borderTop: `1px solid ${COLORS.cyan}20` }} />
                <div className="absolute top-0 right-0 w-12 h-12" style={{ borderRight: `1px solid ${GOLD}20`, borderTop: `1px solid ${GOLD}20` }} />
                <div className="absolute bottom-0 left-0 w-12 h-12" style={{ borderLeft: `1px solid ${COLORS.yellow}20`, borderBottom: `1px solid ${COLORS.yellow}20` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderRight: `1px solid ${COLORS.orange}20`, borderBottom: `1px solid ${COLORS.orange}20` }} />
                <MetroMap data={mapData} />
              </div>

              {/* Sparkline */}
              {a && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="panel p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="label-xs" style={{ color: "#2d3d50" }}>
                      UPDRS Progression Forecast · {a.months} months
                    </span>
                    <div className="flex items-center gap-5">
                      {[
                        { label: "Start", value: a.baseline.toFixed(1), color: COLORS.cyan },
                        { label: "Peak",  value: a.peak.toFixed(1),     color: COLORS.orange },
                        { label: "End",   value: a.final.toFixed(1),    color: COLORS.purple },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="text-right">
                          <p className="label-xs mb-0.5" style={{ color: "#2d3d50" }}>{label}</p>
                          <p className="font-display text-sm font-light" style={{ color }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Sparkline data={a.predictions} color={COLORS.cyan} height={64} />
                  <div className="flex gap-6 mt-3">
                    {[
                      { color: COLORS.yellow, label: "Moderate ≥ 20" },
                      { color: COLORS.red,    label: "Severe ≥ 40"   },
                      ...(a.criticalMonth !== -1 ? [{ color: COLORS.yellow, label: `Moderate at m${a.criticalMonth}` }] : []),
                      ...(a.severeMonth   !== -1 ? [{ color: COLORS.red,    label: `Severe at m${a.severeMonth}` }]    : []),
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-4 h-px" style={{ background: color }} />
                        <span className="label-xs" style={{ color: "#2d3d50" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-6"
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
                    <div className="h-px w-5" style={{ background: color }} />
                    <span className="label-xs" style={{ color: "#2d3d50" }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.main>

            {/* ─── RIGHT PANEL ─── */}
            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-3 panel panel-scroll flex flex-col gap-5 p-5"
            >
              {/* Progression projections */}
              <div>
                <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Progression Projections</p>
                <div className="space-y-3">
                  <MetricCard label="Baseline Avg"      value={avgUptake}     unit="SBR"              color={COLORS.white} delay={0.8} />
                  <MetricCard label="+1 Year Projection" value={projection1yr} unit={a ? "UPDRS" : "SBR"} color={COLORS.green} barPercent={projection1yr / (a ? 60 : 5) * 100} delay={0.9} />
                  <MetricCard label="+2 Year Projection" value={projection2yr} unit={a ? "UPDRS" : "SBR"} color={COLORS.green} barPercent={projection2yr / (a ? 60 : 5) * 100} delay={1.0} />
                </div>
              </div>

              {/* Risk badge */}
              {a && (
                <>
                  <div className="divider" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="rounded-sm p-5 text-center"
                    style={{ background: `${a.riskColor}0a`, border: `1px solid ${a.riskColor}25`, color: a.riskColor }}
                  >
                    <FaShieldAlt className="text-xl mx-auto mb-3" />
                    <p className="font-display text-2xl font-light mb-1">{a.riskTier} Risk</p>
                    <p className="label-xs mb-3" style={{ color: "#4a5568" }}>
                      Score at 12 m: <span className="font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{a.at12.toFixed(1)}</span>
                    </p>
                    <p className="font-body text-xs leading-relaxed" style={{ color: "#4a5568" }}>
                      {a.riskTier === "Low"      && "Below 10 — benign early trajectory."}
                      {a.riskTier === "Moderate" && "10–25 — moderate impact, monitor closely."}
                      {a.riskTier === "High"     && "Above 25 — significant impairment projected."}
                    </p>
                  </motion.div>
                </>
              )}

              {/* Clinical Recommendations */}
              {a && recs.length > 0 && (
                <>
                  <div className="divider" />
                  <div>
                    <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Clinical Recommendations</p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="space-y-2"
                    >
                      {recs.map(({ text, color, icon: Icon }, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 + i * 0.1 }}
                          className="rec-pill"
                          style={{ background: `${color}0a`, border: `1px solid ${color}22` }}
                        >
                          <Icon size={12} style={{ color, marginTop: 1, flexShrink: 0 }} />
                          <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{text}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </>
              )}

              {/* Clinical Context */}
              <div className="divider" />
              <div>
                <p className="label-xs mb-4" style={{ color: "#2d3d50" }}>Clinical Context</p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: a ? 2.0 : 1.4 }}
                  className="space-y-3"
                >
                  {[
                    { icon: Activity,   color: COLORS.cyan,   title: "Striatal Binding Ratio (SBR)",  desc: "Measures dopamine transporter density. Normal range 2.5–5.0 SBR." },
                    { icon: CircleDot,  color: COLORS.yellow, title: "Hemispheric Asymmetry",          desc: "Difference between right and left dopaminergic activity. PD often shows asymmetric onset." },
                    { icon: TrendingDown, color: COLORS.orange, title: "Progression Model",            desc: "LSSM-predicted UPDRS trajectory. Higher values indicate more severe motor impairment." },
                    { icon: Info,       color: COLORS.purple, title: "Research Use Only",              desc: "This tool is for research and educational purposes. Not for clinical diagnosis." },
                  ].map(({ icon: Icon, color, title, desc }) => (
                    <div key={title} className="flex gap-3 p-3 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <Icon size={13} style={{ color, marginTop: 1, flexShrink: 0 }} />
                      <div>
                        <p className="font-body text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{title}</p>
                        <p className="font-body text-xs leading-relaxed" style={{ color: "#2d3d50" }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.aside>

          </div>{/* end grid */}
        </div>{/* end ml-16 */}
      </div>
    </>
  );
}