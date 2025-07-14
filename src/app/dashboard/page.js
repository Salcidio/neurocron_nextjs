import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Bell, Search, Settings, Menu, X, Zap, Eye, Globe, Heart } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const valueTimer = setInterval(() => {
      setAnimatedValue(prev => (prev + 1) % 100);
    }, 50);
    return () => {
      clearInterval(timer);
      clearInterval(valueTimer);
    };
  }, []);

  const salesData = [
    { name: 'Jan', value: 4000, growth: 240 },
    { name: 'Feb', value: 3000, growth: 456 },
    { name: 'Mar', value: 2000, growth: 139 },
    { name: 'Apr', value: 2780, growth: 980 },
    { name: 'May', value: 1890, growth: 800 },
    { name: 'Jun', value: 2390, growth: 380 },
  ];

  const pieData = [
    { name: 'Desktop', value: 45, color: '#8B5CF6' },
    { name: 'Mobile', value: 35, color: '#06B6D4' },
    { name: 'Tablet', value: 20, color: '#10B981' },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ title, time, type }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
      <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-400' : type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
      <div className="flex-1">
        <p className="text-white text-sm">{title}</p>
        <p className="text-gray-400 text-xs">{time}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">NexaDash</h1>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          {[
            { name: 'Dashboard', icon: BarChart, active: true },
            { name: 'Analytics', icon: TrendingUp },
            { name: 'Users', icon: Users },
            { name: 'Revenue', icon: DollarSign },
            { name: 'Performance', icon: Activity },
            { name: 'Settings', icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                item.active
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 relative">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome back, Alex! 👋
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {currentTime.toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Users"
              value="24,567"
              change={12.5}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value="$89,432"
              change={8.2}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={Eye}
              title="Page Views"
              value="1,234,567"
              change={-2.4}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Globe}
              title="Sessions"
              value="45,123"
              change={15.8}
              color="from-pink-500 to-pink-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                Revenue Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="url(#gradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Device Usage */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                Device Usage
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-400">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-green-400" />
                Performance Metrics
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="growth" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-400" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                <ActivityItem
                  title="New user registration"
                  time="2 minutes ago"
                  type="success"
                />
                <ActivityItem
                  title="Payment processed"
                  time="5 minutes ago"
                  type="success"
                />
                <ActivityItem
                  title="Server response time high"
                  time="12 minutes ago"
                  type="warning"
                />
                <ActivityItem
                  title="Database backup completed"
                  time="1 hour ago"
                  type="info"
                />
                <ActivityItem
                  title="New feature deployed"
                  time="2 hours ago"
                  type="success"
                />
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">System Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CPU Usage</span>
                  <span>{animatedValue}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${animatedValue}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Memory Usage</span>
                  <span>{Math.max(20, animatedValue - 20)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(20, animatedValue - 20)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;