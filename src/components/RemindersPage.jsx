import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import audioManager from '../utils/audioManager';
import { useReminders } from '../hooks/useReminders';

const { FiBell, FiPlus, FiClock, FiRepeat, FiTrash2, FiVolume2, FiPlay, FiEdit, FiSave, FiX, FiLoader } = FiIcons;

function RemindersPage({ addNotification }) {
  const {
    reminders,
    loading,
    error,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    toggleAudio
  } = useReminders();

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
    { value: 'quranStudy', label: 'Quran Study (Surah Al-Alaq)' },
    { value: 'prayer', label: 'Prayer Call (Hayya ala-Salah)' },
    { value: 'charity', label: 'Charity (Surah Al-Baqarah)' },
    { value: 'family', label: 'Family (Surah Luqman)' },
    { value: 'general', label: 'General (Surah Al-Fatihah)' }
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

  // Preload audio files when the component mounts
  useEffect(() => {
    audioManager.preloadAudioFiles();
  }, []);

  const handleAddReminder = async () => {
    if (newReminder.title.trim() && newReminder.message.trim()) {
      const result = await addReminder(newReminder);
      
      if (result) {
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
          message: `"${newReminder.title}" reminder has been saved and synced across your devices.`
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'Failed to Add Reminder',
          message: 'There was an error saving your reminder. Please try again.'
        });
      }
    }
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder.id);
    setEditForm({ ...reminder });
  };

  const saveEdit = async () => {
    const result = await updateReminder(editingReminder, editForm);
    
    if (result) {
      setEditingReminder(null);
      setEditForm({});
      
      // Clear fired reminders when editing
      setFiredReminders(new Set());
      
      addNotification({
        type: 'success',
        title: 'Reminder Updated! ✅',
        message: 'Your reminder has been successfully updated and synced.'
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Update Failed',
        message: 'There was an error updating your reminder. Please try again.'
      });
    }
  };

  const cancelEdit = () => {
    setEditingReminder(null);
    setEditForm({});
  };

  const handleToggleReminder = async (id) => {
    const result = await toggleReminder(id);
    
    if (result) {
      // Clear fired reminders when toggling
      setFiredReminders(new Set());
      
      addNotification({
        type: 'info',
        title: 'Reminder Updated',
        message: `Reminder ${result.active ? 'enabled' : 'disabled'} and synced.`
      });
    }
  };

  const handleToggleAudio = async (id) => {
    const result = await toggleAudio(id);
    
    if (result) {
      addNotification({
        type: 'info',
        title: 'Audio Setting Updated',
        message: `Audio ${result.playAudio ? 'enabled' : 'disabled'} for this reminder.`
      });
    }
  };

  const testReminderAudio = async (audioCategory) => {
    await audioManager.initializeAudio();
    audioManager.playReminderSound(audioCategory, 8000);
    
    // Get the label for the audio being played
    const audioLabel = audioCategories.find(cat => cat.value === audioCategory)?.label || 'Islamic recitation';
    
    addNotification({
      type: 'info',
      title: 'Testing Audio 🔊',
      message: `Playing ${audioLabel}...`
    });
  };

  const handleDeleteReminder = async (id) => {
    const result = await deleteReminder(id);
    
    if (result) {
      setFiredReminders(new Set());
      addNotification({
        type: 'info',
        title: 'Reminder Deleted 🗑️',
        message: 'Reminder has been removed and synced across your devices.'
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Delete Failed',
        message: 'There was an error deleting your reminder. Please try again.'
      });
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center py-12">
          <SafeIcon icon={FiLoader} className="text-4xl text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Loading Your Reminders...</h2>
          <p className="text-emerald-600">Syncing your data across devices</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <h3 className="font-semibold">Error Loading Reminders</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2">Please check your internet connection and try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Quranic Reminders</h1>
        <p className="text-emerald-600">Stay consistent with beautiful Quranic recitations for your good deeds</p>
        <div className="mt-3 inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
          <SafeIcon icon={FiVolume2} className="text-xs" />
          <span>Enhanced with actual Quranic verses and Islamic phrases</span>
        </div>
        <div className="mt-2 inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
          <SafeIcon icon={FiIcons.FiCloud} className="text-xs" />
          <span>Synced across all your devices</span>
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
        <span>Add New Quranic Reminder</span>
      </motion.button>

      {/* Add Reminder Form */}
      {showAddForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">Add New Quranic Reminder</h3>
          
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Quranic Audio</label>
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
                <span className="text-sm font-medium text-gray-700">Play Quranic Audio</span>
                <p className="text-xs text-gray-500">Enable beautiful recitations from the Quran</p>
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
                onClick={handleAddReminder}
                className="flex-1 bg-emerald-500 text-white p-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Add Quranic Reminder
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
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quranic Audio</label>
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
                      title="Test Quranic Audio"
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
                    onClick={() => handleToggleAudio(reminder.id)}
                    className={`p-2 rounded-full transition-colors ${
                      reminder.playAudio 
                        ? 'text-purple-600 bg-purple-100 hover:bg-purple-200' 
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                    title="Toggle Quranic Audio"
                  >
                    <SafeIcon icon={FiVolume2} />
                  </button>

                  {/* Active Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={() => handleToggleReminder(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
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
          <span>Test Quranic Recitations</span>
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Listen to different Quranic verses and Islamic phrases for your reminders
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

      {/* Information about the Audio */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h3 className="text-lg font-semibold text-emerald-800 mb-4">About the Quranic Audio</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-700">Quran Study (Surah Al-Alaq)</h4>
            <p className="text-sm text-gray-600">
              The first verses revealed to Prophet Muhammad ﷺ: "Read in the name of your Lord who created..."
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-700">Prayer Call (Hayya ala-Salah)</h4>
            <p className="text-sm text-gray-600">
              The Islamic call to prayer: "Come to prayer, come to success..."
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-700">Charity (Surah Al-Baqarah)</h4>
            <p className="text-sm text-gray-600">
              Verse about charity: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes..."
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-700">Family (Surah Luqman)</h4>
            <p className="text-sm text-gray-600">
              Verse about respecting parents: "And We have enjoined upon man care for his parents..."
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-700">General (Surah Al-Fatihah)</h4>
            <p className="text-sm text-gray-600">
              The opening chapter of the Quran: "In the name of Allah, the Entirely Merciful, the Especially Merciful..."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RemindersPage;