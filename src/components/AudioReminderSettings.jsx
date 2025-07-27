import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import audioManager from '../utils/audioManager';

const { FiVolume2, FiVolumeX, FiPlay, FiPause, FiSettings } = FiIcons;

function AudioReminderSettings({ isOpen, onClose }) {
  const [volume, setVolume] = useState(0.7);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [selectedRecitation, setSelectedRecitation] = useState('quranStudy');

  useEffect(() => {
    audioManager.initializeAudio();
    setNotificationPermission(Notification.permission || 'default');
  }, []);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  const testAudioReminder = async () => {
    if (isTestPlaying) {
      audioManager.stopCurrentAudio();
      setIsTestPlaying(false);
    } else {
      setIsTestPlaying(true);
      await audioManager.playReminderSound(selectedRecitation, 8000);
      setTimeout(() => setIsTestPlaying(false), 8000);
    }
  };

  const requestNotificationPermission = async () => {
    const granted = await audioManager.requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
  };

  const audioOptions = [
    { value: 'quranStudy', label: 'Surah Al-Alaq (Read!)' },
    { value: 'prayer', label: 'Prayer Call (Hayya ala-Salah)' },
    { value: 'charity', label: 'Surah Al-Baqarah (Charity)' },
    { value: 'family', label: 'Surah Luqman (Family)' },
    { value: 'general', label: 'Surah Al-Fatihah (Opening)' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full shadow-xl border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiSettings} className="text-2xl text-emerald-600" />
            <h2 className="text-xl font-bold text-emerald-800">Quranic Audio Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SafeIcon icon={FiIcons.FiX} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Volume Control */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <SafeIcon icon={volume > 0 ? FiVolume2 : FiVolumeX} className="inline mr-2" />
              Recitation Volume
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600 w-12">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Select Recitation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Quranic Recitation
            </label>
            <select
              value={selectedRecitation}
              onChange={(e) => setSelectedRecitation(e.target.value)}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {audioOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Test Audio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Test Selected Recitation
            </label>
            <button
              onClick={testAudioReminder}
              className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl font-semibold transition-colors ${
                isTestPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <SafeIcon icon={isTestPlaying ? FiPause : FiPlay} />
              <span>{isTestPlaying ? 'Stop Recitation' : 'Play Quranic Recitation'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Listen to the selected Quranic verse or Islamic phrase
            </p>
          </div>

          {/* Notification Permission */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Browser Notifications
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Status: {notificationPermission === 'granted' ? '✅ Enabled' : notificationPermission === 'denied' ? '❌ Blocked' : '⚠️ Not Set'}
              </span>
              {notificationPermission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Enable
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Allow notifications for reminder alerts when audio cannot play
            </p>
          </div>

          {/* Islamic Reminder Info */}
          <div className="bg-emerald-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-800 mb-2">
              🕌 Quranic Audio Reminders
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Our reminders feature beautiful Quranic recitations by Sheikh Mishary Rashid Alafasy, each carefully selected to match different types of reminders. These verses serve as a powerful reminder of your Islamic practices and commitments.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AudioReminderSettings;