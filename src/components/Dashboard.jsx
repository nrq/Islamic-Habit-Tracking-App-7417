import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import IslamicQuote from './IslamicQuote';
import TodayHabits from './TodayHabits';
import PrayerTimes from './PrayerTimes';
import AudioReminderSettings from './AudioReminderSettings';
import audioManager from '../utils/audioManager';

const { FiSun, FiMoon, FiClock, FiHeart, FiSettings, FiVolume2, FiEdit } = FiIcons;

function Dashboard({ currentTime, addNotification }) {
  const [greeting, setGreeting] = useState('');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [nextReminderTime, setNextReminderTime] = useState(null);
  const [quickReminders, setQuickReminders] = useState([
    { time: '07:00', category: 'quranStudy', message: 'Time for Quran study and memorization 📖', active: true },
    { time: '12:30', category: 'prayer', message: 'Dhuhr prayer time is approaching 🕌', active: true },
    { time: '18:00', category: 'family', message: 'Remember to call your mother 📞', active: true },
    { time: '20:00', category: 'charity', message: 'Time for evening reflection and charity 💝', active: true }
  ]);

  const [editingReminderIndex, setEditingReminderIndex] = useState(null);
  const [editTime, setEditTime] = useState('');
  const [firedReminders, setFiredReminders] = useState(new Set());

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('صباح الخير');
    } else if (hour < 18) {
      setGreeting('مساء الخير');
    } else {
      setGreeting('مساء النور');
    }

    // Initialize audio manager on user interaction
    const initAudio = async () => {
      const initialized = await audioManager.initializeAudio();
      console.log('Audio manager initialized:', initialized);
      
      // Preload audio files for better performance
      audioManager.preloadAudioFiles();
    };
    
    initAudio();
  }, [currentTime]);

  // Enhanced reminder checking system
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const todayKey = now.toDateString();
      
      console.log('Checking reminders at:', currentTimeStr);
      
      quickReminders.forEach((reminder, index) => {
        if (!reminder.active) return;
        
        const reminderKey = `${todayKey}-${index}-${reminder.time}`;
        
        if (reminder.time === currentTimeStr && !firedReminders.has(reminderKey)) {
          console.log('Firing reminder:', reminder.message);
          
          // Mark as fired for today
          setFiredReminders(prev => new Set(prev).add(reminderKey));
          
          // Play audio reminder
          audioManager.playReminderSound(reminder.category, 8000);
          
          // Show notification
          addNotification({
            type: 'info',
            title: 'Islamic Reminder 🕌',
            message: reminder.message
          });
        }
      });

      // Find next reminder
      const activeReminders = quickReminders
        .filter(r => r.active)
        .map(r => ({ ...r, timeMinutes: parseInt(r.time.split(':')[0]) * 60 + parseInt(r.time.split(':')[1]) }))
        .sort((a, b) => a.timeMinutes - b.timeMinutes);
      
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const nextReminder = activeReminders.find(r => r.timeMinutes > currentMinutes);
      
      if (nextReminder) {
        setNextReminderTime(nextReminder.time);
      } else if (activeReminders.length > 0) {
        setNextReminderTime(activeReminders[0].time + ' (tomorrow)');
      }
    };

    // Check immediately and then every 30 seconds for more responsive checking
    checkReminders();
    const interval = setInterval(checkReminders, 30000);

    return () => clearInterval(interval);
  }, [addNotification, quickReminders, firedReminders]);

  // Reset fired reminders at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        console.log('Resetting fired reminders for new day');
        setFiredReminders(new Set());
      }
    };

    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const testAudioReminder = async () => {
    console.log('Testing Quranic audio reminder...');
    await audioManager.initializeAudio();
    audioManager.playReminderSound('quranStudy', 8000);
    addNotification({
      type: 'success',
      title: 'Audio Test 🔊',
      message: 'Playing beautiful Quranic recitation...'
    });
  };

  const startEditingReminder = (index) => {
    setEditingReminderIndex(index);
    setEditTime(quickReminders[index].time);
  };

  const saveReminderTime = () => {
    const updatedReminders = [...quickReminders];
    updatedReminders[editingReminderIndex].time = editTime;
    setQuickReminders(updatedReminders);
    setEditingReminderIndex(null);
    setEditTime('');
    
    // Clear fired reminders when time is changed
    setFiredReminders(new Set());
    
    addNotification({
      type: 'success',
      title: 'Reminder Updated! ✅',
      message: 'Your reminder time has been successfully changed.'
    });
  };

  const cancelEdit = () => {
    setEditingReminderIndex(null);
    setEditTime('');
  };

  const toggleReminder = (index) => {
    const updatedReminders = [...quickReminders];
    updatedReminders[index].active = !updatedReminders[index].active;
    setQuickReminders(updatedReminders);
    
    // Clear fired reminders when toggling
    setFiredReminders(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header with Audio Controls */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6 relative"
      >
        <div className="absolute top-0 right-0 flex space-x-2">
          <button
            onClick={testAudioReminder}
            className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors"
            title="Test Quranic Reminder"
          >
            <SafeIcon icon={FiVolume2} className="text-emerald-600" />
          </button>
          <button
            onClick={() => setShowAudioSettings(true)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Audio Settings"
          >
            <SafeIcon icon={FiSettings} className="text-gray-600" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-emerald-800 mb-2">
          {greeting} - Good Day!
        </h1>
        <div className="flex items-center justify-center space-x-4 text-emerald-600">
          <SafeIcon icon={FiClock} className="text-xl" />
          <span className="text-xl font-semibold">{formatTime(currentTime)}</span>
        </div>
        <p className="text-emerald-700 mt-1">{formatDate(currentTime)}</p>
        
        {/* Current Time in 24h format for debugging */}
        <p className="text-xs text-gray-500 mt-1">
          24h format: {currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}
        </p>
        
        {/* Next Reminder Info */}
        {nextReminderTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <SafeIcon icon={FiVolume2} className="text-xs" />
            <span>Next reminder: {nextReminderTime.includes('tomorrow') ? nextReminderTime : formatTime12Hour(nextReminderTime)}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Islamic Quote */}
      <IslamicQuote />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <TodayHabits addNotification={addNotification} />
        </div>

        {/* Prayer Times & Quick Stats */}
        <div className="space-y-6">
          <PrayerTimes />
          
          {/* Quick Progress */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-800">Today's Progress</h3>
              <SafeIcon icon={FiHeart} className="text-red-500 text-xl" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700">Completed Habits</span>
                <span className="font-semibold text-emerald-800">4/8</span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: '50%' }}
                ></div>
              </div>
              <p className="text-xs text-emerald-600 text-center">
                "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Quran 6:73
              </p>
            </div>
          </motion.div>

          {/* Quick Reminders Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <SafeIcon icon={FiVolume2} className="text-xl" />
                <span>Quranic Reminders</span>
              </h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Beautiful Quranic recitations for your daily practices
            </p>
            <div className="space-y-3">
              {quickReminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-xs">
                      {reminder.category === 'quranStudy' && '📖'}
                      {reminder.category === 'prayer' && '🕌'}
                      {reminder.category === 'family' && '📞'}
                      {reminder.category === 'charity' && '💝'}
                    </div>
                    {editingReminderIndex === index ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="px-2 py-1 rounded text-black text-sm flex-1"
                        />
                        <button
                          onClick={saveReminderTime}
                          className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 rounded text-xs transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 bg-gray-500 hover:bg-gray-600 rounded text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">
                          {formatTime12Hour(reminder.time)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditingReminder(index)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Edit Time"
                          >
                            <SafeIcon icon={FiEdit} className="text-xs" />
                          </button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={reminder.active}
                              onChange={() => toggleReminder(index)}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-400"></div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Audio Settings Modal */}
      <AudioReminderSettings 
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />
    </div>
  );
}

export default Dashboard;