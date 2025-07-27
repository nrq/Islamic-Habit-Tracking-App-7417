import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBook, FiPhone, FiActivity, FiClock, FiSun, FiHome, FiHeadphones, FiUsers, FiHeart } = FiIcons;

function TodayHabits({ addNotification }) {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Study Quran & Memorize Ayats', icon: FiBook, completed: false, streak: 5 },
    { id: 2, name: 'Call Mom', icon: FiPhone, completed: true, streak: 12 },
    { id: 3, name: 'Exercise', icon: FiActivity, completed: false, streak: 3 },
    { id: 4, name: 'Take Computer Breaks', icon: FiClock, completed: true, streak: 7 },
    { id: 5, name: 'Wake Up On Time', icon: FiSun, completed: true, streak: 15 },
    { id: 6, name: 'Clean Room', icon: FiHome, completed: false, streak: 2 },
    { id: 7, name: 'Listen to Quran', icon: FiHeadphones, completed: true, streak: 8 },
    { id: 8, name: 'Teach Others', icon: FiUsers, completed: false, streak: 4 }
  ]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        if (newCompleted) {
          addNotification({
            type: 'success',
            title: 'Habit Completed!',
            message: `Great job completing "${habit.name}"! May Allah reward you.`
          });
        }
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercentage = (completedCount / habits.length) * 100;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-emerald-800">Today's Habits</h2>
        <div className="text-right">
          <p className="text-sm text-emerald-600">Progress</p>
          <p className="text-lg font-bold text-emerald-800">{completedCount}/{habits.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-emerald-100 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-emerald-600 mt-2 text-center">
          {progressPercentage === 100 ? "Alhamdulillah! All habits completed today! 🎉" : "Keep going, you're doing great!"}
        </p>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
              habit.completed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-gray-200 hover:border-emerald-200'
            }`}
            onClick={() => toggleHabit(habit.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                habit.completed ? 'bg-emerald-200' : 'bg-gray-100'
              }`}>
                <SafeIcon icon={habit.icon} className="text-lg" />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  habit.completed ? 'line-through text-emerald-700' : 'text-gray-800'
                }`}>
                  {habit.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {habit.streak} day streak 🔥
                </p>
              </div>
            </div>
            
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              habit.completed
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-gray-300'
            }`}>
              {habit.completed && (
                <SafeIcon icon={FiIcons.FiCheck} className="text-white text-sm" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TodayHabits;