import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import HabitsPage from './components/HabitsPage';
import RemindersPage from './components/RemindersPage';
import MotivationPage from './components/MotivationPage';
import ProgressPage from './components/ProgressPage';
import Navigation from './components/Navigation';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

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
            <Routes>
              <Route path="/" element={<Dashboard currentTime={currentTime} addNotification={addNotification} />} />
              <Route path="/habits" element={<HabitsPage addNotification={addNotification} />} />
              <Route path="/reminders" element={<RemindersPage addNotification={addNotification} />} />
              <Route path="/motivation" element={<MotivationPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Routes>
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