import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiMoon, FiSunrise, FiSunset } = FiIcons;

function PrayerTimes() {
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');

  const prayers = [
    { name: 'Fajr', time: '5:30 AM', icon: FiSunrise, completed: true },
    { name: 'Dhuhr', time: '12:45 PM', icon: FiSun, completed: true },
    { name: 'Asr', time: '4:15 PM', icon: FiSun, completed: false },
    { name: 'Maghrib', time: '6:30 PM', icon: FiSunset, completed: false },
    { name: 'Isha', time: '8:00 PM', icon: FiMoon, completed: false }
  ];

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 5) {
      setCurrentPrayer('Isha');
      setNextPrayer('Fajr');
    } else if (currentHour < 12) {
      setCurrentPrayer('Fajr');
      setNextPrayer('Dhuhr');
    } else if (currentHour < 16) {
      setCurrentPrayer('Dhuhr');
      setNextPrayer('Asr');
    } else if (currentHour < 18) {
      setCurrentPrayer('Asr');
      setNextPrayer('Maghrib');
    } else if (currentHour < 20) {
      setCurrentPrayer('Maghrib');
      setNextPrayer('Isha');
    } else {
      setCurrentPrayer('Isha');
      setNextPrayer('Fajr');
    }
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
    >
      <h3 className="text-lg font-semibold text-emerald-800 mb-4">Prayer Times</h3>
      
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg ${
              prayer.name === nextPrayer
                ? 'bg-emerald-100 border-l-4 border-emerald-500'
                : prayer.completed
                ? 'bg-green-50'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <SafeIcon 
                icon={prayer.icon} 
                className={`text-lg ${
                  prayer.name === nextPrayer ? 'text-emerald-600' : 'text-gray-600'
                }`} 
              />
              <span className={`font-medium ${
                prayer.name === nextPrayer ? 'text-emerald-800' : 'text-gray-700'
              }`}>
                {prayer.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{prayer.time}</span>
              {prayer.completed && (
                <SafeIcon icon={FiIcons.FiCheck} className="text-green-500 text-sm" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
        <p className="text-sm text-emerald-700 text-center">
          Next: <span className="font-semibold">{nextPrayer}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default PrayerTimes;