import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import audioManager from '../utils/audioManager';

const { FiBell, FiPlus, FiClock, FiRepeat, FiTrash2, FiVolume2, FiPlay, FiEdit, FiSave, FiX } = FiIcons;

function RemindersPage({ addNotification }) {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Quran Study Time',
      message: 'Time to read and memorize Quran verses 📖',
      time: '07:00',
      frequency: 'Daily',
      active: true,
      category: 'Spiritual',
      audioCategory: 'quranStudy',
      playAudio: true
    },
    {
      id: 2,
      title: 'Call Mom',
      message: 'Remember to call your mother and check on her 📞',
      time: '19:00',
      frequency: 'Daily',
      active: true,
      category: 'Family',
      audioCategory: 'family',
      playAudio: true
    },
    {
      id: 3,
      title: 'Exercise Time',
      message: 'Time for your daily exercise routine 💪',
      time: '06:00',
      frequency: 'Daily',
      active: true,
      category: 'Health',
      audioCategory: 'general',
      playAudio: false
    },
    {
      id: 4,
      title: 'Computer Break',
      message: 'Take a break from the computer and rest your eyes 👀',
      time: '14:00',
      frequency: 'Daily',
      active: true,
      category: 'Health',
      audioCategory: 'general',
      playAudio: false
    },
    {
      id: 5,
      title: 'Monday Fasting',
      message: 'Today is Monday - time for Sunnah fasting 🌙',
      time: '05:00',
      frequency: 'Weekly (Monday)',
      active: true,
      category: 'Spiritual',
      audioCategory: 'prayer',
      playAudio: true
    },
    {
      id: 6,
      title: 'Thursday Fasting',
      message: 'Today is Thursday - time for Sunnah fasting 🌙',
      time: '05:00',
      frequency: 'Weekly (Thursday)',
      active: true,
      category: 'Spiritual',
      audioCategory: 'prayer',
      playAudio: true
    },
    {
      id: 7,
      title: 'Weekly Charity',
      message: 'Time to give your weekly charity (Sadaqah) 💝',
      time: '20:00',
      frequency: 'Weekly (Friday)',
      active: true,
      category: 'Charity',
      audioCategory: 'charity',
      playAudio: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    time: '07:00',
    frequency: 'Daily',
    category: 'Spiritual',
    audioCategory: 'general',
    playAudio: true
  });
  const [firedReminders, setFiredReminders] = useState(new Set());

  const frequencies = ['Daily', 'Weekly (Monday)', 'Weekly (Tuesday)', 'Weekly (Wednesday)', 'Weekly (Thursday)', 'Weekly (Friday)', 'Weekly (Saturday)', 'Weekly (Sunday)', 'Every 2 hours', 'Custom'];
  const categories = ['Spiritual', 'Health', 'Family', 'Learning', 'Charity'];
  const audioCategories = [
    { value: 'quranStudy', label: 'Quran Study (Melodic)' },
    { value: 'prayer', label: 'Prayer (Ascending)' },
    { value: 'charity', label: 'Charity (Uplifting)' },
    { value: 'family', label: 'Family (Gentle)' },
    { value: 'general', label: 'General (Peaceful)' }
  ];

  // Enhanced alarm checking system
  useEffect(() => {
    const checkActiveReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const todayKey = now.toDateString();

      console.log('Checking reminders at:', currentTime, 'Day:', currentDay);

      reminders.forEach((reminder, index) => {
        if (!reminder.active) return;

        const reminderKey = `${todayKey}-${reminder.id}-${reminder.time}`;
        let shouldTrigger = false;

        if (reminder.frequency === 'Daily') {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Monday)' && currentDay === 1) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Tuesday)' && currentDay === 2) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Wednesday)' && currentDay === 3) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Thursday)' && currentDay === 4) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Friday)' && currentDay === 5) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Saturday)' && currentDay === 6) {
          shouldTrigger = reminder.time === currentTime;
        } else if (reminder.frequency === 'Weekly (Sunday)' && currentDay === 0) {
          shouldTrigger = reminder.time === currentTime;
        }

        if (shouldTrigger && !firedReminders.has(reminderKey)) {
          console.log('Firing reminder:', reminder.title);
          
          // Mark as fired
          setFiredReminders(prev => new Set(prev).add(reminderKey));

          // Play audio if enabled
          if (reminder.playAudio) {
            audioManager.playReminderSound(reminder.audioCategory, 8000);
          }

          // Show notification
          addNotification({
            type: 'info',
            title: `🕌 ${reminder.title}`,
            message: reminder.message
          });
        }
      });
    };

    // Check immediately and then every 30 seconds
    checkActiveReminders();
    const interval = setInterval(checkActiveReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders, addNotification, firedReminders]);

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

  const addReminder = () => {
    if (newReminder.title.trim() && newReminder.message.trim()) {
      setReminders(prev => [...prev, {
        ...newReminder,
        id: Date.now(),
        active: true
      }]);
      setNewReminder({
        title: '',
        message: '',
        time: '07:00',
        frequency: 'Daily',
        category: 'Spiritual',
        audioCategory: 'general',
        playAudio: true
      });
      setShowAddForm(false);
      
      // Clear fired reminders when adding new
      setFiredReminders(new Set());
      
      addNotification({
        type: 'success',
        title: 'Reminder Added! ✨',
        message: `"${newReminder.title}" reminder has been set with audio ${newReminder.playAudio ? 'enabled' : 'disabled'}.`
      });
    }
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder.id);
    setEditForm({ ...reminder });
  };

  const saveEdit = () => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === editingReminder ? { ...editForm } : reminder
    ));
    setEditingReminder(null);
    setEditForm({});
    
    // Clear fired reminders when editing
    setFiredReminders(new Set());
    
    addNotification({
      type: 'success',
      title: 'Reminder Updated! ✅',
      message: 'Your reminder has been successfully updated.'
    });
  };

  const cancelEdit = () => {
    setEditingReminder(null);
    setEditForm({});
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
    
    // Clear fired reminders when toggling
    setFiredReminders(new Set());
  };

  const toggleAudio = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, playAudio: !reminder.playAudio } : reminder
    ));
  };

  const testReminderAudio = async (audioCategory) => {
    await audioManager.initializeAudio();
    audioManager.playReminderSound(audioCategory, 5000);
    addNotification({
      type: 'info',
      title: 'Testing Audio 🔊',
      message: `Playing ${audioCategory} reminder tone...`
    });
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setFiredReminders(new Set());
    addNotification({
      type: 'info',
      title: 'Reminder Deleted 🗑️',
      message: 'Reminder has been removed from your list.'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Spiritual': 'bg-emerald-100 text-emerald-800',
      'Health': 'bg-blue-100 text-blue-800',
      'Family': 'bg-pink-100 text-pink-800',
      'Learning': 'bg-purple-100 text-purple-800',
      'Charity': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Audio Reminders</h1>
        <p className="text-emerald-600">Stay consistent with beautiful Quranic-inspired tones for your good deeds</p>
        <div className="mt-3 inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
          <SafeIcon icon={FiVolume2} className="text-xs" />
          <span>Enhanced audio with peaceful Islamic melodies</span>
        </div>
        
        {/* Current time display for debugging */}
        <p className="text-xs text-gray-500 mt-2">
          Current time: {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
        </p>
      </motion.div>

      {/* Add Reminder Button */}
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
      >
        <SafeIcon icon={FiPlus} />
        <span>Add New Audio Reminder</span>
      </motion.button>

      {/* Add Reminder Form */}
      {showAddForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">Add New Audio Reminder</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Reminder title"
              value={newReminder.title}
              onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            
            <textarea
              placeholder="Reminder message"
              value={newReminder.message}
              onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-20"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={newReminder.category}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Audio Type</label>
                <select
                  value={newReminder.audioCategory}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, audioCategory: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {audioCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Play Audio Reminder</span>
                <p className="text-xs text-gray-500">Enable beautiful Islamic tones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newReminder.playAudio}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, playAudio: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={addReminder}
                className="flex-1 bg-emerald-500 text-white p-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Add Audio Reminder
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

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all ${
              reminder.active 
                ? 'border-emerald-200' 
                : 'border-gray-200 opacity-60'
            }`}
          >
            {editingReminder === reminder.id ? (
              // Edit Form
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-800">Edit Reminder</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <SafeIcon icon={FiSave} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      <SafeIcon icon={FiX} />
                    </button>
                  </div>
                </div>
                
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                
                <textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 h-20"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                    <select
                      value={editForm.frequency}
                      onChange={(e) => setEditForm(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {frequencies.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Audio Type</label>
                    <select
                      value={editForm.audioCategory}
                      onChange={(e) => setEditForm(prev => ({ ...prev, audioCategory: e.target.value }))}
                      className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {audioCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <SafeIcon 
                      icon={FiBell} 
                      className={`text-lg ${reminder.active ? 'text-emerald-600' : 'text-gray-400'}`} 
                    />
                    <h3 className={`font-semibold ${reminder.active ? 'text-emerald-800' : 'text-gray-500'}`}>
                      {reminder.title}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reminder.category)}`}>
                      {reminder.category}
                    </span>
                    {reminder.playAudio && (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        <SafeIcon icon={FiVolume2} className="text-xs" />
                        <span>{audioCategories.find(cat => cat.value === reminder.audioCategory)?.label.split(' ')[0]}</span>
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${reminder.active ? 'text-gray-600' : 'text-gray-400'}`}>
                    {reminder.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="text-emerald-600" />
                      <span className={`font-medium ${reminder.active ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {formatTime12Hour(reminder.time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiRepeat} className="text-emerald-600" />
                      <span className={reminder.active ? 'text-gray-600' : 'text-gray-400'}>
                        {reminder.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Test Audio Button */}
                  {reminder.playAudio && (
                    <button
                      onClick={() => testReminderAudio(reminder.audioCategory)}
                      className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                      title="Test Audio"
                    >
                      <SafeIcon icon={FiPlay} />
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => startEditing(reminder)}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Reminder"
                  >
                    <SafeIcon icon={FiEdit} />
                  </button>

                  {/* Audio Toggle */}
                  <button
                    onClick={() => toggleAudio(reminder.id)}
                    className={`p-2 rounded-full transition-colors ${
                      reminder.playAudio 
                        ? 'text-purple-600 bg-purple-100 hover:bg-purple-200' 
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                    title="Toggle Audio"
                  >
                    <SafeIcon icon={FiVolume2} />
                  </button>

                  {/* Active Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={() => toggleReminder(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Reminder"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Audio Test Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiVolume2} className="text-xl" />
          <span>Test Audio Tones</span>
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Listen to different Islamic-inspired reminder tones to find your perfect sound
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {audioCategories.map(category => (
            <button
              key={category.value}
              onClick={() => testReminderAudio(category.value)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiPlay} className="text-xs" />
              <span>{category.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default RemindersPage;