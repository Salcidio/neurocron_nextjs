"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Activity,
  Brain,
  TrendingUp,
  Zap,
  Users,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";

const NeonParkinsonsAI = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deltaT, setDeltaT] = useState(2);
  const [predictions, setPredictions] = useState([]);
  const [actualPPSE, setActualPPSE] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);

  // Mock data generation
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: "Subject Alpha-7",
        current_stage: 2.1,
        age: 67,
        onset_year: 2019,
      },
      {
        id: 2,
        name: "Subject Beta-3",
        current_stage: 1.8,
        age: 72,
        onset_year: 2020,
      },
      {
        id: 3,
        name: "Subject Gamma-9",
        current_stage: 3.2,
        age: 58,
        onset_year: 2017,
      },
      {
        id: 4,
        name: "Subject Delta-5",
        current_stage: 2.7,
        age: 64,
        onset_year: 2018,
      },
    ];
    setPatients(mockPatients);
    setSelectedPatient(1);
  }, []);

  // Generate predictions with more dramatic data
  useEffect(() => {
    if (selectedPatient === null) return;

    setIsLoading(true);

    setTimeout(() => {
      const timePoints = [0, 1, 2, 3, 4, 5];
      const mockPredictions = timePoints.map((t) => ({
        time: t,
        ppse: Math.pow(t * 0.8, 1.3) + Math.random() * 0.3,
        tremor: Math.min(4, t * 0.6 + Math.random() * 0.5),
        rigidity: Math.min(4, t * 0.7 + Math.random() * 0.4),
        bradykinesia: Math.min(4, t * 0.8 + Math.random() * 0.6),
        postural_instability: Math.min(4, t * 0.5 + Math.random() * 0.3),
        cognitive: Math.min(3, t * 0.3 + Math.random() * 0.2),
        confidence: Math.max(0.6, 0.95 - t * 0.05),
      }));

      setPredictions(mockPredictions);
      setActualPPSE({ time: 2.5, ppse: 1.8 });
      setIsLoading(false);
    }, 1000);
  }, [selectedPatient]);

  // Neural activity animation
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(Math.random() * 100);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const currentPrediction = predictions.find(
    (p) => p.time === Math.round(deltaT)
  ) || {
    ppse: 0,
    tremor: 0,
    rigidity: 0,
    bradykinesia: 0,
    postural_instability: 0,
    cognitive: 0,
    confidence: 0.9,
  };

  const selectedPatientData = patients.find((p) => p.id === selectedPatient);

  const symptomData = [
    {
      name: "Tremor",
      value: currentPrediction.tremor,
      max: 4,
      color: "#3b82f6",
    },
    {
      name: "Rigidity",
      value: currentPrediction.rigidity,
      max: 4,
      color: "#ec4899",
    },
    {
      name: "Bradykinesia",
      value: currentPrediction.bradykinesia,
      max: 4,
      color: "#8b5cf6",
    },
    {
      name: "Postural Instability",
      value: currentPrediction.postural_instability,
      max: 4,
      color: "#06b6d4",
    },
    {
      name: "Cognitive Decline",
      value: currentPrediction.cognitive,
      max: 3,
      color: "#f59e0b",
    },
  ];

  const chartData = predictions.map((pred) => ({
    time: pred.time,
    predicted: pred.ppse,
    confidence_upper: pred.ppse + (1 - pred.confidence) * 2,
    confidence_lower: Math.max(0, pred.ppse - (1 - pred.confidence) * 2),
  }));

  const scatterData = actualPPSE
    ? [{ x: actualPPSE.time, y: actualPPSE.ppse }]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent rotate-45"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              NEURAL PROGRESSION AI
            </h1>
            <Zap className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-cyan-300 font-light">
            Advanced Parkinson's Disease Trajectory Analysis
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">
              NEURAL NETWORK ACTIVE
            </span>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-blue-300">Active Subjects</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {patients.length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-500/30 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-pink-400" />
              <span className="text-pink-300">Neural Activity</span>
            </div>
            <div className="text-3xl font-bold text-pink-400">
              {neuralActivity.toFixed(0)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <span className="text-purple-300">Prediction Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {(currentPrediction.confidence * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <span className="text-cyan-300">Time Horizon</span>
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {deltaT.toFixed(1)}y
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Patient Selection */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Subject Selection
              </h3>
              <select
                className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-4 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                value={selectedPatient ?? ""}
                onChange={(e) => setSelectedPatient(Number(e.target.value))}
              >
                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                    className="bg-slate-800"
                  >
                    {patient.name} • Stage {patient.current_stage} • Age{" "}
                    {patient.age}
                  </option>
                ))}
              </select>

              {selectedPatientData && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Onset Year:</span>
                    <span className="text-white">
                      {selectedPatientData.onset_year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Stage:</span>
                    <span className="text-cyan-400 font-semibold">
                      {selectedPatientData.current_stage}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Time Control */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                Temporal Analysis
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-300">Projection Time</label>
                  <span className="text-2xl font-bold text-pink-400">
                    {deltaT.toFixed(1)} years
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={deltaT}
                  onChange={(e) => setDeltaT(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
                      (deltaT / 5) * 100
                    }%, #475569 ${(deltaT / 5) * 100}%, #475569 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0y</span>
                  <span>2.5y</span>
                  <span>5y</span>
                </div>
              </div>
            </div>

            {/* Symptom Severity Radar */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Symptom Matrix
              </h3>
              <div className="space-y-4">
                {symptomData.map((symptom, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{symptom.name}</span>
                      <span
                        className="font-semibold"
                        style={{ color: symptom.color }}
                      >
                        {symptom.value.toFixed(1)}/{symptom.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${(symptom.value / symptom.max) * 100}%`,
                          backgroundColor: symptom.color,
                          boxShadow: `0 0 10px ${symptom.color}40`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Main Chart */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-2xl p-6 backdrop-blur h-full">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Progression Trajectory Analysis
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-cyan-400">
                      Analyzing neural patterns...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="predictionGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06b6d4"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06b6d4"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="time"
                        stroke="#9CA3AF"
                        label={{
                          value: "Time (years)",
                          position: "insideBottom",
                          offset: -5,
                          style: { fill: "#9CA3AF" },
                        }}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        label={{
                          value: "PPSE Score",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "#9CA3AF" },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #06b6d4",
                          borderRadius: "12px",
                          color: "#ffffff",
                        }}
                      />
                      <Legend />

                      {/* Confidence bands */}
                      <Line
                        type="monotone"
                        dataKey="confidence_upper"
                        stroke="#06b6d4"
                        strokeOpacity={0.3}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Confidence Upper"
                      />
                      <Line
                        type="monotone"
                        dataKey="confidence_lower"
                        stroke="#06b6d4"
                        strokeOpacity={0.3}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Confidence Lower"
                      />

                      {/* Main prediction line */}
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{
                          r: 6,
                          fill: "#06b6d4",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="AI Prediction"
                        fill="url(#predictionGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Actual data point overlay */}
                  {actualPPSE && (
                    <div
                      className="absolute w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: `${20 + (actualPPSE.time / 5) * 60}%`,
                        top: `${80 - (actualPPSE.ppse / 4) * 60}%`,
                        boxShadow: "0 0 20px #ec4899",
                      }}
                    >
                      <div className="absolute -top-8 -left-8 text-xs text-pink-400 font-semibold whitespace-nowrap">
                        Actual
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Current prediction highlight */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-300">
                      Predicted PPSE at {deltaT.toFixed(1)} years
                    </p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {currentPrediction.ppse.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Confidence Level</p>
                    <p className="text-xl font-semibold text-green-400">
                      {(currentPrediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 0 10px #ec4899;
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px #ec4899;
        }
      `}</style>
    </div>
  );
};

export default NeonParkinsonsAI;
