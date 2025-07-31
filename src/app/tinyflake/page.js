"use client";
import React, { useState, useEffect } from "react";
import { Brain, Zap } from "lucide-react";

import StatusGrid from "./StatusGrid";
import DataInputModal from "./DataInputModal";
import ControlPanel from "./ControlPanel";
import ChartPanel from "./ChartPanel";
import Sidebar from "@/components/SideBar";

const NeuralProgressionAI = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deltaT, setDeltaT] = useState(2);
  const [predictions, setPredictions] = useState([]);
  const [actualPPSE, setActualPPSE] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [showDataForm, setShowDataForm] = useState(false);
  const [formData, setFormData] = useState({
    clinical_baseline_motor: [0, 0, 0, 0, 0, 0, 0, 0],
    clinical_followup_motor: [0, 0, 0, 0, 0, 0, 0, 0],
    datscan: [0, 0, 0, 0],
    clinical_delta_motor: [0, 0, 0, 0],
    clinical_delta_nonmotor: [0, 0, 0],
    biomarker_delta_datscan: [0, 0, 0, 0],
    delta_t: 0,
    current_stage: 1,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelStatus, setModelStatus] = useState("standby");
  const [dataQuality, setDataQuality] = useState(85);

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

  // Generate predictions
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
      setDataQuality(80 + Math.random() * 20);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Model status cycling
  useEffect(() => {
    const statuses = ["standby", "analyzing", "processing", "predicting"];
    let statusIndex = 0;
    const interval = setInterval(() => {
      setModelStatus(statuses[statusIndex]);
      statusIndex = (statusIndex + 1) % statuses.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setModelStatus("processing");

    setTimeout(() => {
      const newPredictions = [0, 1, 2, 3, 4, 5].map((t) => ({
        time: t,
        ppse:
          Math.pow(t * (formData.current_stage / 5), 1.2) + Math.random() * 0.4,
        tremor: Math.min(4, formData.clinical_delta_motor[0] + t * 0.5),
        rigidity: Math.min(4, formData.clinical_delta_motor[1] + t * 0.6),
        bradykinesia: Math.min(4, formData.clinical_delta_motor[2] + t * 0.7),
        postural_instability: Math.min(
          4,
          formData.clinical_delta_motor[3] + t * 0.4
        ),
        cognitive: Math.min(3, formData.clinical_delta_nonmotor[0] + t * 0.3),
        confidence: Math.max(0.7, 0.95 - t * 0.04),
      }));

      setPredictions(newPredictions);
      setIsProcessing(false);
      setModelStatus("complete");
      setShowDataForm(false);
    }, 2000);
  };

  const handleInputChange = (category, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]:
        category === "delta_t" || category === "current_stage"
          ? parseFloat(value)
          : prev[category].map((item, i) =>
              i === index ? parseFloat(value) : item
            ),
    }));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
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
              NEURAL PROGRESSION
            </h1>
            <Zap className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-cyan-300 font-light">
            Advanced Parkinson&apos;s Disease Trajectory Analysis
          </p>
        </div>
        <Sidebar />

        <StatusGrid
          patients={patients}
          neuralActivity={neuralActivity}
          currentPrediction={currentPrediction}
          deltaT={deltaT}
        />

        <DataInputModal
          showDataForm={showDataForm}
          setShowDataForm={setShowDataForm}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          isProcessing={isProcessing}
          modelStatus={modelStatus}
          dataQuality={dataQuality}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <ControlPanel
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            selectedPatientData={selectedPatientData}
            deltaT={deltaT}
            setDeltaT={setDeltaT}
            setShowDataForm={setShowDataForm}
            showDataForm={showDataForm}
            currentPrediction={currentPrediction}
          />

          <ChartPanel
            predictions={predictions}
            isLoading={isLoading}
            actualPPSE={actualPPSE}
            deltaT={deltaT}
            currentPrediction={currentPrediction}
          />
        </div>
      </div>
    </div>
  );
};

export default NeuralProgressionAI;
