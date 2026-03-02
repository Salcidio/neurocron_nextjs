"use client";
import { useState, useEffect } from "react";
import {
  FaUpload,
  FaCloudUploadAlt,
  FaFileAlt,
  FaChartBar,
  FaBrain,
  FaDna,
  FaRunning,
  FaMoon,
  FaLink,
  FaClock,
} from "react-icons/fa";
import { submitPrediction, submitPatientData } from "./api";

const MOTOR_FIELDS = [
  { name: "motor_tremor",     label: "Tremor (UPDRS)",         hint: "0–4" },
  { name: "motor_rigidity",   label: "Rigidity (UPDRS)",       hint: "0–4" },
  { name: "motor_brady",      label: "Bradykinesia (UPDRS)",   hint: "0–4" },
  { name: "motor_postural",   label: "Postural Instability",   hint: "0–4" },
  { name: "hoehn_yahr",       label: "Hoehn & Yahr Stage",     hint: "1–5" },
  { name: "motor_gait",       label: "Gait Score",             hint: "0–4" },
  { name: "motor_speech",     label: "Speech Score",           hint: "0–4" },
  { name: "motor_facial",     label: "Facial Expression",      hint: "0–4" },
];

const NON_MOTOR_FIELDS = [
  { name: "nm_sleep",         label: "Sleep (UPDRS Non-Motor)", hint: "0–4" },
  { name: "nm_depression",    label: "Depression Score",        hint: "0–4" },
  { name: "nm_cognitive",     label: "Cognitive Score",         hint: "0–4" },
  { name: "nm_fatigue",       label: "Fatigue Level",           hint: "0–4" },
  { name: "nm_anxiety",       label: "Anxiety Level",           hint: "0–4" },
  { name: "nm_pain",          label: "Pain Score",              hint: "0–4" },
  { name: "nm_hallucination", label: "Hallucination Score",     hint: "0–4" },
  { name: "nm_autonomic",     label: "Autonomic Dysfunction",   hint: "0–4" },
];

const BIO_FIELDS = [
  { name: "datscan_left_putamen",   label: "DaTscan Left Putamen",   hint: "SBR value" },
  { name: "datscan_right_putamen",  label: "DaTscan Right Putamen",  hint: "SBR value" },
  { name: "datscan_left_caudate",   label: "DaTscan Left Caudate",   hint: "SBR value" },
  { name: "datscan_right_caudate",  label: "DaTscan Right Caudate",  hint: "SBR value" },
];

const buildInitialForm = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, ""]));

const DEFAULT_ENDPOINT = "https://82f2-34-125-219-89.ngrok-free.app/predict";
const LS_ENDPOINT_KEY  = "neurocron_endpoint";

export default function InputForm({ onSubmit, onReset }) {
  const [motorData,    setMotorData]    = useState(buildInitialForm(MOTOR_FIELDS));
  const [nonMotorData, setNonMotorData] = useState(buildInitialForm(NON_MOTOR_FIELDS));
  const [bioData,      setBioData]      = useState(buildInitialForm(BIO_FIELDS));
  const [months,       setMonths]       = useState(50);
  const [endpoint,     setEndpoint]     = useState(DEFAULT_ENDPOINT);
  const [file,         setFile]         = useState([null, null, null, null]);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState(null);
  const [activeSection, setActiveSection] = useState("motor");

  // Restore saved endpoint
  useEffect(() => {
    const saved = localStorage.getItem(LS_ENDPOINT_KEY);
    if (saved) setEndpoint(saved);
  }, []);

  // Provide reset function to parent
  useEffect(() => {
    onReset(() => () => {
      setMotorData(buildInitialForm(MOTOR_FIELDS));
      setNonMotorData(buildInitialForm(NON_MOTOR_FIELDS));
      setBioData(buildInitialForm(BIO_FIELDS));
      setMonths(50);
      setFile([null, null, null, null]);
      setError(null);
      setActiveSection("motor");
    });
  }, []);

  const handleChange = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (index) => (e) => {
    const newFiles = [...file];
    newFiles[index] = e.target.files[0];
    setFile(newFiles);
  };

  // Validate a set of fields and return float array or throw
  const parseFields = (data, fields, label) => {
    const missing = fields.filter(
      (f) => data[f.name] === "" || data[f.name] === undefined
    );
    if (missing.length > 0)
      throw new Error(
        `${label}: missing fields — ${missing.map((f) => f.label).join(", ")}`
      );
    return fields.map((f) => {
      const v = parseFloat(data[f.name]);
      if (isNaN(v))
        throw new Error(`${label}: invalid value for "${f.label}"`);
      return v;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (activeSection === "upload") {
        if (!file.every((f) => f !== null))
          throw new Error("Please upload all 4 CSV files.");
        const formDataFile = new FormData();
        const labels = ["ESS", "MoCA", "GDS", "DaTSCAN"];
        file.forEach((f, idx) => {
          if (f) formDataFile.append("files", f, `${labels[idx]}.csv`);
        });
        const data = await submitPatientData(formDataFile, true, endpoint);
        onSubmit(data);
        return;
      }

      if (!endpoint.trim()) throw new Error("Please enter the ngrok endpoint URL.");

      const motor_features     = parseFields(motorData,    MOTOR_FIELDS,     "Motor");
      const non_motor_features = parseFields(nonMotorData, NON_MOTOR_FIELDS,  "Non-Motor");
      const biological_features = parseFields(bioData,     BIO_FIELDS,        "Biological");

      // Persist endpoint and inputs so analysis page can use them
      localStorage.setItem(LS_ENDPOINT_KEY, endpoint.trim());
      localStorage.setItem("neurocron_bio_features", JSON.stringify({
        datscan_left_putamen:   biological_features[0],
        datscan_right_putamen:  biological_features[1],
        datscan_left_caudate:   biological_features[2],
        datscan_right_caudate:  biological_features[3],
      }));
      localStorage.setItem("neurocron_months", String(months));

      const payload = { 
        body: { motor_features, non_motor_features, biological_features, months } 
      };
      const data = await submitPrediction(endpoint.trim(), payload);
      onSubmit(data);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reusable input component (same style as existing) ──────────────────
  const GlassInput = ({ label, name, hint, value, onChange, type = "number", step = "0.01" }) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-white/90 mb-1">
        {label}
        {hint && <span className="ml-2 text-xs text-white/40 font-normal">({hint})</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        required
        placeholder="0.00"
        className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                   text-white placeholder-white/30 focus:outline-none focus:ring-2
                   focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300
                   hover:bg-white/15 hover:border-white/30 shadow-lg hover:shadow-blue-glow/20
                   group-hover:transform group-hover:scale-[1.02]"
      />
    </div>
  );

  const sections = [
    { id: "motor",     name: "Motor",     icon: <FaRunning className="text-lg" /> },
    { id: "nonmotor",  name: "Non-Motor", icon: <FaMoon className="text-lg" /> },
    { id: "bio",       name: "Biological",icon: <FaDna className="text-lg" /> },
    { id: "upload",    name: "Upload CSV",icon: <FaUpload className="text-lg" /> },
  ];

  const SectionTab = ({ section, isActive, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                  relative overflow-hidden group cursor-pointer ${
                    isActive
                      ? "bg-blue-pink-gradient text-white shadow-blue-glow"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
    >
      {section.icon}
      <span className="font-normal text-sm">{section.name}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {error && (
        <div className="mb-8 p-4 bg-red-500/20 text-white rounded-xl border border-red-500/40">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-3 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl">
        {sections.map((section) => (
          <SectionTab
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Motor Tab ── */}
        {activeSection === "motor" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaRunning className="text-3xl text-blue-300" />
              Motor Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOTOR_FIELDS.map((f) => (
                <GlassInput
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  hint={f.hint}
                  value={motorData[f.name]}
                  onChange={handleChange(setMotorData)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Non-Motor Tab ── */}
        {activeSection === "nonmotor" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaBrain className="text-3xl text-pink-300" />
              Non-Motor Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {NON_MOTOR_FIELDS.map((f) => (
                <GlassInput
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  hint={f.hint}
                  value={nonMotorData[f.name]}
                  onChange={handleChange(setNonMotorData)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Biological Tab ── */}
        {activeSection === "bio" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaDna className="text-3xl text-cyan-300" />
              Biological Markers (DaTscan)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BIO_FIELDS.map((f) => (
                <GlassInput
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  hint={f.hint}
                  value={bioData[f.name]}
                  onChange={handleChange(setBioData)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Upload CSV Tab ── */}
        {activeSection === "upload" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaUpload className="text-3xl text-cyan-300" />
              Upload 4 CSV Files
            </h3>
            {["ESS", "MoCA", "GDS", "DaTSCAN"].map((label, i) => (
              <div key={i} className="mb-6">
                <label className="flex items-center justify-between text-white/80 mb-3 font-medium">
                  <span>{label} CSV</span>
                  <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full" />
                </label>
                <div
                  className={`relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
                      ${
                        file && file[i]
                          ? "border-green-400 bg-green-500/10"
                          : "border-white/30 hover:border-white/50 hover:bg-white/5"
                      }`}
                  onClick={() => document.getElementById(`file-input-${i}`).click()}
                >
                  <input
                    id={`file-input-${i}`}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange(i)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {file && file[i] ? (
                        <FaFileAlt className="mx-auto text-white" />
                      ) : (
                        <FaCloudUploadAlt className="mx-auto text-white animate-bounce" />
                      )}
                    </div>
                    <p className="text-white text-base font-medium mb-1">
                      {file && file[i]
                        ? file[i].name
                        : `Drop or click to upload ${label} CSV`}
                    </p>
                    <p className="text-white/60 text-xs">Only .csv format supported</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Months + Endpoint (always visible) ── */}
        {activeSection !== "upload" && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <FaClock className="text-blue-300" /> Prediction Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Months */}
              <div className="group relative">
                <label className="block text-sm font-medium text-white/90 mb-1">
                  Months to Predict
                  <span className="ml-2 text-xs text-white/40 font-normal">(vector length)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value) || 50)}
                  className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                             text-white placeholder-white/30 focus:outline-none focus:ring-2
                             focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300
                             hover:bg-white/15 hover:border-white/30 shadow-lg"
                />
              </div>

              {/* Endpoint */}
              <div className="group relative">
                <label className="block text-sm font-medium text-white/90 mb-1 flex items-center gap-2">
                  <FaLink className="text-pink-400" /> Colab Endpoint (ngrok)
                </label>
                <input
                  type="url"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://xxxx.ngrok-free.app/predict"
                  className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                             text-white placeholder-white/30 focus:outline-none focus:ring-2
                             focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300
                             hover:bg-white/15 hover:border-white/30 shadow-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Submit ── */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative px-12 py-4 bg-blue-pink-gradient text-white font-bold text-lg rounded-3xl
                       shadow-2xl hover:shadow-blue-glow transition-all duration-300 hover:scale-105 cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <FaChartBar className="text-2xl" />
                  Generate Prediction
                </>
              )}
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0
                            group-hover:opacity-100 transition-opacity duration-300"
            />
            {!isLoading && (
              <div
                className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full
                              group-hover:translate-x-full transition-transform duration-700"
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
