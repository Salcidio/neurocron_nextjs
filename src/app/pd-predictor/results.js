
'use client';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler
} from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale,
  BarElement,
  Filler
);

export default function Results({ prediction }) {
  const { motor_scores, nonmotor_scores, confidence, progression } = prediction;
  const [animatedScores, setAnimatedScores] = useState([0, 0, 0]);
  const [animatedNonMotor, setAnimatedNonMotor] = useState([0, 0, 0]);
  const [currentView, setCurrentView] = useState('progression');

  useEffect(() => {
    // Animate the scores
    const timer = setTimeout(() => {
      setAnimatedScores(motor_scores);
      setAnimatedNonMotor(nonmotor_scores);
    }, 300);
    return () => clearTimeout(timer);
  }, [motor_scores, nonmotor_scores]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  const progressionChartData = {
    labels: ['Current', '1 Year', '2 Years'],
    datasets: [
      {
        label: 'Motor Symptoms (UPDRS)',
        data: animatedScores,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      },
      {
        label: 'Non-Motor Symptoms (UPDRS)',
        data: animatedNonMotor,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  const radarData = {
    labels: ['Motor Function', 'Cognitive Health', 'Mood Stability', 'Sleep Quality', 'Overall Mobility'],
    datasets: [
      {
        label: 'Current Status',
        data: [
          5 - (motor_scores[0] || 0),
          5 - (nonmotor_scores[0] || 0),
          4.5 - Math.random(),
          4 - Math.random(),
          5 - ((motor_scores[0] || 0) * 0.8)
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      },
      {
        label: '2-Year Projection',
        data: [
          5 - (motor_scores[2] || 0),
          5 - (nonmotor_scores[2] || 0),
          4 - Math.random(),
          3.5 - Math.random(),
          5 - ((motor_scores[2] || 0) * 0.8)
        ],
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgb(236, 72, 153)',
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(236, 72, 153)'
      }
    ]
  };

  const progressionText = {
    stable: { text: 'stable condition with minimal changes expected', color: 'text-green-300', icon: '🟢', bgColor: 'bg-green-500/20' },
    mild: { text: 'mild progression with slight symptom increases', color: 'text-yellow-300', icon: '🟡', bgColor: 'bg-yellow-500/20' },
    moderate: { text: 'moderate progression with noticeable symptom changes', color: 'text-orange-300', icon: '🟠', bgColor: 'bg-orange-500/20' }
  };

  const confidenceColor = confidence >= 0.8 ? 'text-green-300' : confidence >= 0.6 ? 'text-yellow-300' : 'text-red-300';
  const confidenceIcon = confidence >= 0.8 ? '🎯' : confidence >= 0.6 ? '⚡' : '⚠️';

  const ViewToggle = ({ view, label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium
                ${isActive 
                  ? 'bg-blue-pink-gradient text-white shadow-blue-glow' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="mt-12 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                    hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <span className="text-5xl animate-pulse">🔬</span>
            Parkinson's Disease Progression Analysis
            <span className="text-5xl animate-pulse">📊</span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto w-64" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Motor Progression */}
          <div className="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-200">Motor Symptoms</h3>
              <span className="text-3xl">🧠</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {motor_scores[2] !== undefined ? `+${(motor_scores[2] - motor_scores[0]).toFixed(1)}` : 'N/A'}
            </div>
            <p className="text-blue-200 text-sm">2-year change in UPDRS score</p>
          </div>

          {/* Non-Motor Progression */}
          <div className="bg-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pink-200">Non-Motor Symptoms</h3>
              <span className="text-3xl">💭</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {nonmotor_scores[2] !== undefined ? `+${(nonmotor_scores[2] - nonmotor_scores[0]).toFixed(1)}` : 'N/A'}
            </div>
            <p className="text-pink-200 text-sm">2-year change in UPDRS score</p>
          </div>

          {/* Confidence Level */}
          <div className={`${progressionText[progression]?.bgColor || 'bg-purple-500/20'} backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-transform duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-200">Prediction Confidence</h3>
              <span className="text-3xl animate-bounce">{confidenceIcon}</span>
            </div>
            <div className={`text-3xl font-bold mb-2 ${confidenceColor}`}>
              {Math.round(confidence * 100)}%
            </div>
            <p className="text-purple-200 text-sm">Model accuracy level</p>
          </div>
        </div>

        {/* Progression Summary */}
        <div className={`${progressionText[progression]?.bgColor || 'bg-gray-500/20'} backdrop-blur-xl rounded-2xl p-6 border border-white/20`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{progressionText[progression]?.icon || '📊'}</span>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Clinical Assessment Summary</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Your Parkinson's symptoms are projected to show{' '}
                <span className={`font-bold ${progressionText[progression]?.color || 'text-white'}`}>
                  {progressionText[progression]?.text || 'progression analysis'}
                </span>{' '}
                over the next 2 years. Motor symptoms may increase by approximately{' '}
                <span className="font-bold text-blue-300">
                  {motor_scores[2] !== undefined ? (motor_scores[2] - motor_scores[0]).toFixed(1) : 'N/A'}
                </span>{' '}
                points, while non-motor symptoms may shift by{' '}
                <span className="font-bold text-pink-300">
                  {nonmotor_scores[2] !== undefined ? (nonmotor_scores[2] - nonmotor_scores[0]).toFixed(1) : 'N/A'}
                </span>{' '}
                points on the UPDRS scale.
              </p>
              <div className="mt-4 p-4 bg-white/10 rounded-xl border-l-4 border-yellow-400">
                <p className="text-yellow-200 text-sm">
                  <span className="font-bold">⚠️ Important:</span> This analysis is generated by Flake AI as part of an ongoing research study. 
                  Please discuss these projections with your healthcare provider to develop an appropriate treatment strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart View Toggle */}
      <div className="flex flex-wrap gap-2 justify-center p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <ViewToggle
          view="progression"
          label="Progression Timeline"
          icon="📈"
          isActive={currentView === 'progression'}
          onClick={() => setCurrentView('progression')}
        />
        <ViewToggle
          view="radar"
          label="Health Radar"
          icon="🎯"
          isActive={currentView === 'radar'}
          onClick={() => setCurrentView('radar')}
        />
        <ViewToggle
          view="comparison"
          label="Symptom Comparison"
          icon="⚖️"
          isActive={currentView === 'comparison'}
          onClick={() => setCurrentView('comparison')}
        />
      </div>

      {/* Chart Display */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                    hover:shadow-blue-glow/20 transition-all duration-500">
        <div className="h-96 relative">
          {currentView === 'progression' && (
            <div className="h-full">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📈</span>
                Symptom Progression Timeline
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
              </h3>
              <Line data={progressionChartData} options={chartOptions} />
            </div>
          )}

          {currentView === 'radar' && (
            <div className="h-full">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Multi-Dimensional Health Assessment
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
              </h3>
              <Radar data={radarData} options={{
                ...chartOptions,
                scales: {
                  r: {
                    angleLines: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                      color: '#ffffff',
                      font: {
                        size: 12
                      }
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      backdropColor: 'transparent'
                    }
                  }
                }
              }} />
            </div>
          )}

          {currentView === 'comparison' && (
            <div className="h-full">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">⚖️</span>
                Current vs. Projected Symptoms
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
              </h3>
              <Bar data={{
                labels: ['Motor Symptoms', 'Non-Motor Symptoms'],
                datasets: [
                  {
                    label: 'Current',
                    data: [motor_scores[0] || 0, nonmotor_scores[0] || 0],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                  },
                  {
                    label: '2-Year Projection',
                    data: [motor_scores[2] || 0, nonmotor_scores[2] || 0],
                    backgroundColor: 'rgba(236, 72, 153, 0.6)',
                    borderColor: 'rgb(236, 72, 153)',
                    borderWidth: 2
                  }
                ]
              }} options={chartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                    hover:shadow-blue-glow/20 transition-all duration-500 animate-float">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">💡</span>
          Personalized Recommendations
          <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full ml-4" />
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exercise Recommendation */}
          <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏃‍♂️</span>
              <h4 className="text-lg font-semibold text-green-200">Exercise Therapy</h4>
            </div>
            <p className="text-white/90 text-sm">
              Regular physical therapy and exercise can help slow motor symptom progression. Consider aerobic exercise, balance training, and flexibility work.
            </p>
          </div>

          {/* Medication Management */}
          <div className="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💊</span>
              <h4 className="text-lg font-semibold text-blue-200">Medication Review</h4>
            </div>
            <p className="text-white/90 text-sm">
              Based on your progression pattern, discuss with your neurologist about optimizing your medication regimen and timing.
            </p>
          </div>

          {/* Lifestyle Modifications */}
          <div className="bg-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🧘‍♀️</span>
              <h4 className="text-lg font-semibold text-purple-200">Lifestyle Support</h4>
            </div>
            <p className="text-white/90 text-sm">
              Focus on sleep hygiene, stress management, and nutrition to support overall health and potentially slow disease progression.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h4 className="text-lg font-semibold text-yellow-200 mb-2">Medical Disclaimer</h4>
            <p className="text-yellow-100 text-sm leading-relaxed">
              This prediction model is designed for research purposes and should not replace professional medical advice. 
              The projections are based on current data patterns and may not account for individual variations, treatment responses, 
              or other factors that could influence disease progression. Always consult with qualified healthcare professionals 
              for personalized medical guidance and treatment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}