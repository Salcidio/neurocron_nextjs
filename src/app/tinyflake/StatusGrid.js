import React from 'react';
import { Users, Activity, TrendingUp, Clock } from 'lucide-react';

const StatusGrid = ({ patients, neuralActivity, currentPrediction, deltaT }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-blue-400" />
          <span className="text-blue-300">Active Subjects</span>
        </div>
        <div className="text-3xl font-bold text-blue-400">{patients.length}</div>
      </div>
      
      <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-500/30 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-pink-400" />
          <span className="text-pink-300">Neural Activity</span>
        </div>
        <div className="text-3xl font-bold text-pink-400">{neuralActivity.toFixed(0)}%</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <span className="text-purple-300">Prediction Accuracy</span>
        </div>
        <div className="text-3xl font-bold text-purple-400">{(currentPrediction.confidence * 100).toFixed(1)}%</div>
      </div>
      
      <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          <span className="text-cyan-300">Time Horizon</span>
        </div>
        <div className="text-3xl font-bold text-cyan-400">{deltaT.toFixed(1)}y</div>
      </div>
    </div>
  );
};

export default StatusGrid;