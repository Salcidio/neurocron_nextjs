'use client'
import InputForm from './input-form';
import Results from './results';
import { useState } from 'react';

export default function PDPredictor() {
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePrediction = (data) => {
    setIsAnalyzing(true);
    // Simulate analysis time for better UX
    setTimeout(() => {
      setPrediction(data);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Subtle Particle Effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                        hover:shadow-blue-glow/20 transition-all duration-500 animate-float mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Parkinson's Disease
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Progression Predictor
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
              <span className="text-2xl animate-pulse">🧬</span>
              <div className="text-xl font-semibold text-blue-300">Powered by Flake AI</div>
              <span className="text-2xl animate-pulse">🔬</span>
              <div className="h-1 w-24 bg-gradient-to-l from-pink-500 to-transparent rounded-full" />
            </div>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Advanced machine learning analysis for personalized Parkinson's disease progression insights. 
              Enter patient data to receive evidence-based projections and treatment recommendations.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: '🎯', text: 'AI-Powered Analysis', color: 'bg-blue-500/20 border-blue-500/30' },
              { icon: '📊', text: 'Multi-Year Projections', color: 'bg-purple-500/20 border-purple-500/30' },
              { icon: '🔬', text: 'Clinical Grade Data', color: 'bg-pink-500/20 border-pink-500/30' },
              { icon: '💡', text: 'Personalized Insights', color: 'bg-green-500/20 border-green-500/30' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} backdrop-blur-xl rounded-full px-6 py-3 border 
                          hover:scale-105 transition-all duration-300 cursor-default
                          hover:shadow-lg hover:shadow-blue-glow/20`}
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <span className="text-xl">{feature.icon}</span>
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!prediction && !isAnalyzing && (
            <div className="space-y-8">
              {/* Quick Start Guide */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Quick Start Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Basic Info', desc: 'Enter patient ID and assessment date', icon: '📝' },
                    { step: '2', title: 'Clinical Data', desc: 'Input UPDRS scores and DaTscan results', icon: '🩺' },
                    { step: '3', title: 'Upload CSV', desc: 'Or upload batch data for analysis', icon: '📁' },
                    { step: '4', title: 'Get Results', desc: 'View predictions and recommendations', icon: '📊' }
                  ].map((step, index) => (
                    <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                      <div className="bg-blue-pink-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg shadow-lg group-hover:shadow-blue-glow/50 transition-all duration-300">
                        {step.step}
                      </div>
                      <div className="text-2xl mb-2">{step.icon}</div>
                      <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                      <p className="text-white/70 text-sm">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <InputForm onSubmit={handlePrediction} />
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
                <div className="relative mb-8">
                  {/* Main Loading Spinner */}
                  <div className="w-32 h-32 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-6" />
                  
                  {/* Inner Pulsing Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-pink-gradient rounded-full animate-pulse opacity-60" />
                  
                  {/* Center Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
                    🧬
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Analyzing Patient Data</h3>
                <p className="text-white/70 mb-6">
                  Our AI is processing your inputs and generating personalized progression insights...
                </p>
                
                {/* Progress Steps */}
                <div className="space-y-3">
                  {[
                    { text: 'Processing clinical parameters', delay: 0 },
                    { text: 'Running progression models', delay: 500 },
                    { text: 'Calculating confidence intervals', delay: 1000 },
                    { text: 'Generating recommendations', delay: 1500 }
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-white/80 animate-pulse"
                      style={{ animationDelay: `${step.delay}ms` }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      {step.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {prediction && !isAnalyzing && (
            <div className="space-y-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 inline-block">
                  <div className="flex items-center gap-3 text-green-200">
                    <span className="text-3xl animate-bounce">✅</span>
                    <span className="text-xl font-semibold">Analysis Complete!</span>
                    <span className="text-3xl animate-bounce">🎉</span>
                  </div>
                </div>
              </div>

              <Results prediction={prediction} />
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-8">
                <button
                  onClick={() => {
                    setPrediction(null);
                    setIsAnalyzing(false);
                  }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-2xl 
                           border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300
                           flex items-center gap-3"
                >
                  <span className="text-xl">🔄</span>
                  New Analysis
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="group px-8 py-4 bg-blue-pink-gradient text-white font-semibold rounded-2xl 
                           hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-glow/50
                           flex items-center gap-3"
                >
                  <span className="text-xl">📄</span>
                  Export Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">
              © 2025 Flake AI Research Laboratory • Advanced Healthcare Analytics • 
              <span className="text-blue-300 hover:text-blue-200 cursor-pointer transition-colors duration-300">
                Learn More
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}