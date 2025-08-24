'use client';
import { useState } from 'react';
import { FaUser, FaUpload, FaCloudUploadAlt, FaFileAlt, FaChartBar, FaBrain, FaBed, FaSmile } from 'react-icons/fa';
import { submitPatientData } from './api';

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    ESS_TOTAL: '',
    ESS1: '',
    ESS2: '',
    GDSENRGY: '',
    MCATOT: '',
    MCAALTTM: '',
    MCACUBE: '',
    MCASER7: '',
    MCAABSTR: '',
    GDS_TOTAL: '',
    GDSSATIS: '',
    GDSHAPPY: ''
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('sleep');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let data;
  if (file && Array.isArray(file)) {
  const formDataFile = new FormData();
  file.forEach((f, idx) => formDataFile.append("files", f));
  data = await submitPatientData(formDataFile, true);
}else {
        const featureData = Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
        );
        data = await submitPatientData(featureData, false);
      }
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GlassInput = ({ label, name, type = "number", step = "0.1" }) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        step={step}
        required
        className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                   text-white placeholder-white/50 focus:outline-none focus:ring-2 
                   focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300
                   hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-blue-glow/20
                   group-hover:transform group-hover:scale-[1.02]"
      />
    </div>
  );

  const sections = [
    { id: 'sleep', name: 'Sleep & Fatigue', icon: <FaBed className="text-lg" /> },
    { id: 'cognition', name: 'Cognition', icon: <FaBrain className="text-lg" /> },
    { id: 'mood', name: 'Mood & Depression', icon: <FaSmile className="text-lg" /> },
    { id: 'upload', name: 'Upload CSV', icon: <FaUpload className="text-lg" /> }
  ];

  const SectionTab = ({ section, isActive, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 
                  relative overflow-hidden group ${
                    isActive 
                      ? 'bg-blue-pink-gradient text-white shadow-blue-glow' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
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
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-2  bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
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
        {/* Sleep & Fatigue */}
        {activeSection === 'sleep' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8  border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaBed className="text-3xl text-blue-300" />
              Sleep & Fatigue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput label="ESS_TOTAL" name="ESS_TOTAL" />
              <GlassInput label="ESS1 (Reading)" name="ESS1" />
              <GlassInput label="ESS2 (TV)" name="ESS2" />
              <GlassInput label="GDSENRGY (Energy)" name="GDSENRGY" />
            </div>
          </div>
        )}

        {/* Cognition */}
        {activeSection === 'cognition' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaBrain className="text-3xl text-pink-300" />
              Cognition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput label="MCATOT" name="MCATOT" />
              <GlassInput label="MCAALTTM" name="MCAALTTM" />
              <GlassInput label="MCACUBE" name="MCACUBE" />
              <GlassInput label="MCASER7" name="MCASER7" />
              <GlassInput label="MCAABSTR" name="MCAABSTR" />
            </div>
          </div>
        )}

        {/* Mood & Depression */}
        {activeSection === 'mood' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaSmile className="text-3xl text-yellow-300" />
              Mood & Depression
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput label="GDS_TOTAL" name="GDS_TOTAL" />
              <GlassInput label="GDSSATIS" name="GDSSATIS" />
              <GlassInput label="GDSHAPPY" name="GDSHAPPY" />
            </div>
          </div>
        )}

        {/* Upload CSV */}
{/* Upload CSV */}
{/* Upload CSV */}
{activeSection === 'upload' && (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <FaUpload className="text-3xl text-cyan-300" />
      Upload 4 CSV Files
    </h3>
    {['ESS', 'MoCA', 'GDS', 'DaTSCAN'].map((label, i) => (
      <div key={i} className="mb-6">
        <label className="flex items-center justify-between text-white/80 mb-3 font-medium">
          <span>{label} CSV</span>
          <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full" />
        </label>
        <div
          className={`relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
                      ${file && file[i]
                        ? 'border-green-400 bg-green-500/10'
                        : 'border-white/30 hover:border-white/50 hover:bg-white/5'}`}
          onClick={() => document.getElementById(`file-input-${i}`).click()}
        >
          <input
            id={`file-input-${i}`}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const newFiles = [...(file || [])];
              newFiles[i] = e.target.files[0];
              setFile(newFiles);
            }}
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
              {file && file[i] ? file[i].name : `Drop or click to upload ${label} CSV`}
            </p>
            <p className="text-white/60 text-xs">
              Only .csv format supported
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

        {/* Submit Button */}
      <div className="flex justify-center pt-8">
          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative px-12 py-4 bg-blue-pink-gradient text-white font-bold text-lg rounded-2xl 
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
                  <FaChartBar className="text-2xl" /> {/* Replaced emoji with FaChartBar */}
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
