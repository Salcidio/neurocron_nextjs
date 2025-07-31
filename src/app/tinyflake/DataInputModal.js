import React from 'react';
import { Brain, Activity, TrendingUp, Zap, AlertCircle, Eye, Clock, Users } from 'lucide-react';

const DataInputModal = ({ 
  showDataForm, 
  setShowDataForm, 
  formData, 
  handleInputChange, 
  handleFormSubmit, 
  isProcessing, 
  modelStatus, 
  dataQuality 
}) => {
  if (!showDataForm) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-cyan-500/50 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Neural Data Interface
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              modelStatus === 'processing' ? 'bg-orange-500/20 text-orange-400' :
              modelStatus === 'complete' ? 'bg-green-500/20 text-green-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {modelStatus.toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => setShowDataForm(false)}
            className="text-slate-400 hover:text-white transition-colors p-2 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-8">
          
          {/* Section: Clinical Baseline Motor Scores */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Clinical Baseline Motor Scores
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['tremor', 'rigidity', 'bradykinesia', 'postural_instability', 'cognitive'].map(field => (
                <div key={field} className="space-y-1">
                  <label className="text-sm text-slate-300 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type="number"
                    name={field}
                    min="0"
                    max="4"
                    step="0.1"
                    value={formData[field] || ''}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    placeholder="Enter value"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Patient Metadata */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-semibold text-pink-300 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              Subject Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-3 text-white"
                  placeholder="Subject name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-3 text-white"
                  placeholder="Age"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Onset Year</label>
                <input
                  type="number"
                  name="onset_year"
                  value={formData.onset_year || ''}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/70 border border-slate-600 rounded-xl p-3 text-white"
                  placeholder="e.g., 2019"
                />
              </div>
            </div>
          </div>

          {/* Submission */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Data Quality: <span className="font-semibold text-green-400">{dataQuality}</span>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-cyan-600 hover:bg-cyan-700 transition-colors px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Submit Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataInputModal;
