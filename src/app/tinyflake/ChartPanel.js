import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const ChartPanel = ({ predictions, isLoading, actualPPSE, deltaT, currentPrediction }) => {
  const chartData = predictions.map(pred => ({
    time: pred.time,
    predicted: pred.ppse,
    confidence_upper: pred.ppse + (1 - pred.confidence) * 2,
    confidence_lower: Math.max(0, pred.ppse - (1 - pred.confidence) * 2)
  }));

  return (
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
              <p className="text-cyan-400">Analyzing neural patterns...</p>
            </div>
          </div>
        ) : (
          <div className="h-96 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  label={{ value: 'Time (years)', position: 'insideBottom', offset: -5, style: { fill: '#9CA3AF' } }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  label={{ value: 'PPSE Score', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #06b6d4', 
                    borderRadius: '12px',
                    color: '#ffffff'
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
                  dot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#ffffff' }}
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
                  boxShadow: '0 0 20px #ec4899'
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
              <p className="text-sm text-cyan-300">Predicted PPSE at {deltaT.toFixed(1)} years</p>
              <p className="text-3xl font-bold text-cyan-400">{currentPrediction.ppse.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Confidence Level</p>
              <p className="text-xl font-semibold text-green-400">{(currentPrediction.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;