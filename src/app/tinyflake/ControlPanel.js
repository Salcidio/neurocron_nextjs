import React from 'react';
import { Eye, Clock, AlertCircle } from 'lucide-react';

const ControlPanel = ({ 
  patients, 
  selectedPatient, 
  setSelectedPatient, 
  selectedPatientData, 
  deltaT, 
  setDeltaT,
  setShowDataForm,
  showDataForm,
  currentPrediction 
}) => {
  const symptomData = [
    { name: 'Tremor', value: currentPrediction.tremor, max: 4, color: '#3b82f6' },
    { name: 'Rigidity', value: currentPrediction.rigidity, max: 4, color: '#ec4899' },
    { name: 'Bradykinesia', value: currentPrediction.bradykinesia, max: 4, color: '#8b5cf6' },
    { name: 'Postural Instability', value: currentPrediction.postural_instability, max: 4, color: '#06b6d4' },
    { name: 'Cognitive Decline', value: currentPrediction.cognitive, max: 3, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Subject Selection
        </h3>
        <select
          className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-4 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
          value={selectedPatient ?? ''}
          onChange={(e) => setSelectedPatient(Number(e.target.value))}
        >
          {patients.map(patient => (
            <option key={patient.id} value={patient.id} className="bg-slate-800">
              {patient.name} • Stage {patient.current_stage} • Age {patient.age}
            </option>
          ))}
        </select>
        
        {selectedPatientData && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Onset Year:</span>
              <span className="text-white">{selectedPatientData.onset_year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Stage:</span>
              <span className="text-cyan-400 font-semibold">{selectedPatientData.current_stage}</span>
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
            <span className="text-2xl font-bold text-pink-400">{deltaT.toFixed(1)} years</span>
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
              background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(deltaT/5)*100}%, #475569 ${(deltaT/5)*100}%, #475569 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0y</span>
            <span>2.5y</span>
            <span>5y</span>
          </div>
        </div>
        
        {/* Neural Input Button */}
        <button
          onClick={() => setShowDataForm(!showDataForm)}
          className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            showDataForm 
              ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
          } shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          {showDataForm ? 'Close Neural Input' : 'Open Neural Input'}
        </button>
      </div>

      {/* Symptom Severity */}
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
                <span className="font-semibold" style={{ color: symptom.color }}>
                  {symptom.value.toFixed(1)}/{symptom.max}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(symptom.value / symptom.max) * 100}%`,
                    backgroundColor: symptom.color,
                    boxShadow: `0 0 10px ${symptom.color}40`
                  }}
                ></div>
              </div>
            </div>
          ))}
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

export default ControlPanel;