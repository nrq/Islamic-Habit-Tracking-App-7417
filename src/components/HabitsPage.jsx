import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEdit, FiTrash2, FiCalendar, FiTarget } = FiIcons;

function HabitsPage({ addNotification }) {
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: 'Study Quran & Memorize Ayats', 
      category: 'Spiritual',
      frequency: 'Daily',
      streak: 5,
      target: 30,
      description: 'Read and memorize verses from the Holy Quran'
    },
    { 
      id: 2, 
      name: 'Call Mom', 
      category: 'Family',
      frequency: 'Daily',
      streak: 12,
      target: 365,
      description: 'Check in with mother and show care'
    },
    { 
      id: 3, 
      name: 'Fast on Mondays & Thursdays', 
      category: 'Spiritual',
      frequency: 'Weekly',
      streak: 3,
      target: 52,
      description: 'Sunnah fasting for spiritual purification'
    },
    { 
      id: 4, 
      name: 'Give Weekly Charity', 
      category: 'Charity',
      frequency: 'Weekly',
      streak: 8,
      target: 52,
      description: 'Regular charitable giving to help others'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Spiritual',
    frequency: 'Daily',
    target: 30,
    description: ''
  });

  const categories = ['Spiritual', 'Health', 'Family', 'Learning', 'Charity', 'Social'];
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  const addHabit = () => {
    if (newHabit.name.trim()) {
      setHabits(prev => [...prev, {
        ...newHabit,
        id: Date.now(),
        streak: 0
      }]);
      setNewHabit({
        name: '',
        category: 'Spiritual',
        frequency: 'Daily',
        target: 30,
        description: ''
      });
      setShowAddForm(false);
      addNotification({
        type: 'success',
        title: 'Habit Added!',
        message: `"${newHabit.name}" has been added to your habits.`
      });
    }
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    addNotification({
      type: 'info',
      title: 'Habit Removed',
      message: 'Habit has been removed from your list.'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Spiritual': 'bg-emerald-100 text-emerald-800',
      'Health': 'bg-blue-100 text-blue-800',
      'Family': 'bg-pink-100 text-pink-800',
      'Learning': 'bg-purple-100 text-purple-800',
      'Charity': 'bg-yellow-100 text-yellow-800',
      'Social': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Manage Habits</h1>
        <p className="text-emerald-600">Build consistent good deeds and strengthen your character</p>
      </motion.div>

      {/* Add Habit Button */}
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
      >
        <SafeIcon icon={FiPlus} />
        <span>Add New Habit</span>
      </motion.button>

      {/* Add Habit Form */}
      {showAddForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">Add New Habit</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            
            <textarea
              placeholder="Description (optional)"
              value={newHabit.description}
              onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-20"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit(prev => ({ ...prev, frequency: e.target.value }))}
                className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Target days"
                value={newHabit.target}
                onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={addHabit}
                className="flex-1 bg-emerald-500 text-white p-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-800 mb-2">{habit.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                  {habit.category}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors">
                  <SafeIcon icon={FiEdit} />
                </button>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>
            
            {habit.description && (
              <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="text-emerald-600" />
                  <span className="text-gray-600">{habit.frequency}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTarget} className="text-emerald-600" />
                  <span className="text-gray-600">{habit.target} days</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Streak Progress</span>
                  <span className="font-semibold text-emerald-800">
                    {habit.streak}/{habit.target} days 🔥
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((habit.streak / habit.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HabitsPage;