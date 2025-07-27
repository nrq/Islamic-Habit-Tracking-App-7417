import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import HabitsPage from './components/HabitsPage';
import RemindersPage from './components/RemindersPage';
import MotivationPage from './components/MotivationPage';
import ProgressPage from './components/ProgressPage';
import DatabaseSetup from './components/DatabaseSetup';
import Navigation from './components/Navigation';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDatabaseSetupComplete = () => {
    setDatabaseReady(true);
  };

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    try {
      // This will throw an error if not configured
      const testUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-id.supabase.co';
      const testKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';
      
      return testUrl !== 'https://your-project-id.supabase.co' && testKey !== 'your-anon-key';
    } catch {
      return false;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="app-container"
        >
          <Navigation />
          
          <main className="pb-20">
            {!isSupabaseConfigured() ? (
              <div className="max-w-2xl mx-auto p-4 pt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-yellow-200 text-center"
                >
                  <div className="text-4xl mb-4">⚠️</div>
                  <h2 className="text-xl font-semibold text-yellow-800 mb-4">Supabase Configuration Required</h2>
                  <p className="text-yellow-700 mb-4">
                    To enable reminder syncing across devices, please configure your Supabase credentials in <code className="bg-yellow-100 px-2 py-1 rounded">src/lib/supabase.js</code>
                  </p>
                  <p className="text-sm text-yellow-600">
                    For now, reminders will only be stored locally on this device.
                  </p>
                </motion.div>
              </div>
            ) : !databaseReady ? (
              <DatabaseSetup onSetupComplete={handleDatabaseSetupComplete} />
            ) : (
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      currentTime={currentTime} 
                      addNotification={addNotification} 
                    />
                  } 
                />
                <Route 
                  path="/habits" 
                  element={<HabitsPage addNotification={addNotification} />} 
                />
                <Route 
                  path="/reminders" 
                  element={<RemindersPage addNotification={addNotification} />} 
                />
                <Route 
                  path="/motivation" 
                  element={<MotivationPage />} 
                />
                <Route 
                  path="/progress" 
                  element={<ProgressPage />} 
                />
              </Routes>
            )}
          </main>
          
          <NotificationSystem 
            notifications={notifications} 
            removeNotification={removeNotification} 
          />
        </motion.div>
      </div>
    </Router>
  );
}

export default App;