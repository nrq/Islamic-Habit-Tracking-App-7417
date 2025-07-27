import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';

const { FiTrendingUp, FiCalendar, FiTarget, FiAward, FiBarChart } = FiIcons;

function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Sample data for charts
  const weeklyData = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    completed: [6, 7, 5, 8, 6, 4, 7],
    total: [8, 8, 8, 8, 8, 8, 8]
  };

  const monthlyData = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    completed: [42, 38, 45, 40],
    total: [56, 56, 56, 56]
  };

  const habitStats = [
    { name: 'Quran Study', completed: 25, total: 30, streak: 5 },
    { name: 'Call Mom', completed: 28, total: 30, streak: 12 },
    { name: 'Exercise', completed: 22, total: 30, streak: 3 },
    { name: 'Prayer on Time', completed: 29, total: 30, streak: 18 },
    { name: 'Weekly Charity', completed: 4, total: 4, streak: 8 }
  ];

  const achievements = [
    { title: '7-Day Streak', description: 'Completed Quran study for 7 days straight', icon: FiAward, earned: true },
    { title: 'Family First', description: 'Called mom every day for 2 weeks', icon: FiAward, earned: true },
    { title: 'Consistent Giver', description: 'Gave charity for 4 weeks in a row', icon: FiAward, earned: true },
    { title: '30-Day Challenge', description: 'Complete all habits for 30 days', icon: FiTarget, earned: false },
    { title: 'Early Bird', description: 'Wake up on time for 21 days', icon: FiAward, earned: false }
  ];

  const getChartOption = () => {
    const data = selectedPeriod === 'week' ? weeklyData : monthlyData;
    const xAxisData = selectedPeriod === 'week' ? data.days : data.weeks;
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Completed', 'Total'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total',
          type: 'bar',
          data: data.total,
          itemStyle: {
            color: '#e5e7eb'
          }
        },
        {
          name: 'Completed',
          type: 'bar',
          data: data.completed,
          itemStyle: {
            color: '#10b981'
          }
        }
      ]
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Progress & Analytics</h1>
        <p className="text-emerald-600">Track your spiritual and personal growth journey</p>
      </motion.div>

      {/* Period Selector */}
      <div className="flex justify-center space-x-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-emerald-100">
        {[
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' }
        ].map((period) => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period.key)}
            className={`px-6 py-2 rounded-xl transition-all ${
              selectedPeriod === period.key
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiTarget} className="text-2xl" />
            <span className="text-sm opacity-80">Today</span>
          </div>
          <p className="text-3xl font-bold">6/8</p>
          <p className="text-sm opacity-90">Habits Completed</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiTrendingUp} className="text-2xl" />
            <span className="text-sm opacity-80">Streak</span>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm opacity-90">Days Active</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiAward} className="text-2xl" />
            <span className="text-sm opacity-80">Earned</span>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm opacity-90">Achievements</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiCalendar} className="text-2xl" />
            <span className="text-sm opacity-80">Week</span>
          </div>
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm opacity-90">Completion Rate</p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-emerald-800">Progress Chart</h2>
          <SafeIcon icon={FiBarChart} className="text-emerald-600 text-xl" />
        </div>
        
        <div className="h-80">
          <ReactECharts 
            option={getChartOption()} 
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </motion.div>

      {/* Habit Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h2 className="text-xl font-semibold text-emerald-800 mb-6">Habit Breakdown</h2>
        
        <div className="space-y-4">
          {habitStats.map((habit, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(habit.completed / habit.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {habit.completed}/{habit.total}
                  </span>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm text-gray-500">Streak</p>
                <p className="font-bold text-emerald-600">{habit.streak} 🔥</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h2 className="text-xl font-semibold text-emerald-800 mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.earned
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  achievement.earned ? 'bg-emerald-200' : 'bg-gray-200'
                }`}>
                  <SafeIcon 
                    icon={achievement.icon} 
                    className={`text-lg ${
                      achievement.earned ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                  />
                </div>
                <h3 className={`font-semibold ${
                  achievement.earned ? 'text-emerald-800' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
              </div>
              <p className={`text-sm ${
                achievement.earned ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
              {achievement.earned && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                    ✨ Earned
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ProgressPage;