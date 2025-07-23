'use client';
import { useState, useEffect } from 'react';
import { submitPatientData } from './api';

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    patient_id: '',
    assessment_date: '',
    updrs_motor_tremor: '',
    updrs_motor_rigidity: '',
    updrs_motor_bradykinesia: '',
    updrs_motor_postural_instability: '',
    updrs_nonmotor_cognitive: '',
    updrs_nonmotor_depression: '',
    updrs_nonmotor_sleep: '',
    datscan_left_putamen: '',
    datscan_right_putamen: '',
    datscan_left_caudate: '',
    datscan_right_caudate: '',
    neurotransmitter_dopamine: '',
    neurotransmitter_serotonin: '',
    neurotransmitter_norepinephrine: '',
    hoehn_yahr_stage: ''
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let data;
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        data = await submitPatientData(formDataFile, true);
      } else {
        data = await submitPatientData(formData, false);
      }
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'basic', name: 'Basic Info', icon: '👤' },
    { id: 'motor', name: 'Motor Symptoms', icon: '🧠' },
    { id: 'nonmotor', name: 'Non-Motor', icon: '💭' },
    { id: 'scans', name: 'DaTscan', icon: '🔬' },
    { id: 'neuro', name: 'Neurotransmitters', icon: '⚗️' },
    { id: 'stage', name: 'Stage & Upload', icon: '📊' }
  ];

  const GlassInput = ({ label, name, type = "text", min, max, step, placeholder, required = false, options = null }) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
        {label}
        {required && <span className="text-neon-pink-400 animate-pulse">*</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                   text-white placeholder-white/50 focus:outline-none focus:ring-2 
                   focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300
                   hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-blue-glow/20"
          required={required}
        >
          <option value="" className="bg-gray-800 text-white">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800 text-white">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                   text-white placeholder-white/50 focus:outline-none focus:ring-2 
                   focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300
                   hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-blue-glow/20
                   group-hover:transform group-hover:scale-[1.02]"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={required}
        />
      )}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-pink-500/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );

  const SectionTab = ({ section, isActive, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 
                relative overflow-hidden group ${
                  isActive 
                    ? 'bg-blue-pink-gradient text-white shadow-blue-glow' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
    >
      <span className="text-xl">{section.icon}</span>
      <span className="font-medium">{section.name}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
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
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">👤</span>
              Patient Information
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput 
                label="Patient ID" 
                name="patient_id" 
                placeholder="Enter unique patient identifier"
                required 
              />
              <GlassInput 
                label="Assessment Date" 
                name="assessment_date" 
                type="date" 
                required 
              />
            </div>
          </div>
        )}

        {/* Motor Symptoms */}
        {activeSection === 'motor' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              Motor Symptoms (UPDRS Scale)
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['tremor', 'rigidity', 'bradykinesia', 'postural_instability'].map((field) => (
                <GlassInput
                  key={field}
                  label={field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  name={`updrs_motor_${field}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  placeholder={`Rate ${field} severity (0-4)`}
                />
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <p className="text-blue-200 text-sm">
                💡 <strong>Scale Guide:</strong> 0 = Normal, 1 = Slight, 2 = Mild, 3 = Moderate, 4 = Severe
              </p>
            </div>
          </div>
        )}

        {/* Non-Motor Symptoms */}
        {activeSection === 'nonmotor' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">💭</span>
              Non-Motor Symptoms (UPDRS Scale)
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['cognitive', 'depression', 'sleep'].map((field) => (
                <GlassInput
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={`updrs_nonmotor_${field}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  placeholder={`Rate ${field} issues (0-4)`}
                />
              ))}
            </div>
          </div>
        )}

        {/* DaTscan Measures */}
        {activeSection === 'scans' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🔬</span>
              DaTscan Measurements
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
                  <span>🧠</span> Putamen Regions
                </h4>
                {['left_putamen', 'right_putamen'].map((field) => (
                  <GlassInput
                    key={field}
                    label={field.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    name={`datscan_${field}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder={`${field.replace('_', ' ')} uptake ratio`}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                  <span>🎯</span> Caudate Regions
                </h4>
                {['left_caudate', 'right_caudate'].map((field) => (
                  <GlassInput
                    key={field}
                    label={field.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    name={`datscan_${field}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder={`${field.replace('_', ' ')} uptake ratio`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Neurotransmitters */}
        {activeSection === 'neuro' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">⚗️</span>
              Neurotransmitter Levels
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { field: 'dopamine', color: 'text-green-300', emoji: '🟢' },
                { field: 'serotonin', color: 'text-purple-300', emoji: '🟣' },
                { field: 'norepinephrine', color: 'text-orange-300', emoji: '🟠' }
              ].map(({ field, color, emoji }) => (
                <div key={field} className="relative group">
                  <div className={`absolute -top-2 -right-2 text-2xl ${color} group-hover:animate-bounce`}>
                    {emoji}
                  </div>
                  <GlassInput
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={`neurotransmitter_${field}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    placeholder={`${field} concentration level`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage and File Upload */}
        {activeSection === 'stage' && (
          <div className="space-y-6">
            {/* Hoehn & Yahr Stage */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                          hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Disease Stage Assessment
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
              </h3>
              <GlassInput
                label="Hoehn and Yahr Stage"
                name="hoehn_yahr_stage"
                options={[0, 1, 2, 3, 4, 5]}
                required
              />
              <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-purple-200 text-sm">
                  📋 <strong>Stage Reference:</strong> 0 = No signs, 1 = Unilateral, 2 = Bilateral, 3 = Postural instability, 4 = Severe disability, 5 = Wheelchair bound
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                          hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📁</span>
                Bulk Data Upload
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
              </h3>
              <div 
                className={`relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
                          ${isDragOver 
                            ? 'border-blue-400 bg-blue-500/20 scale-105' 
                            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                          }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">
                    {file ? '📋' : '☁️'}
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    {file ? `Selected: ${file.name}` : 'Drop CSV file here or click to browse'}
                  </p>
                  <p className="text-white/60 text-sm">
                    Upload patient data in CSV format for batch processing
                  </p>
                </div>
                {isDragOver && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-2xl animate-pulse" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-8">
          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative px-12 py-4 bg-blue-pink-gradient text-white font-bold text-lg rounded-2xl 
                     shadow-2xl hover:shadow-blue-glow transition-all duration-300 hover:scale-105
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
                  <span className="text-2xl">🔬</span>
                  Generate Prediction
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300" />
            {!isLoading && (
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                            group-hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}