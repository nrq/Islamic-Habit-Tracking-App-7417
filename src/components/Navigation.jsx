import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiCheckSquare, FiBell, FiHeart, FiTrendingUp } = FiIcons;

function Navigation() {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/habits', icon: FiCheckSquare, label: 'Habits' },
    { path: '/reminders', icon: FiBell, label: 'Reminders' },
    { path: '/motivation', icon: FiHeart, label: 'Motivation' },
    { path: '/progress', icon: FiTrendingUp, label: 'Progress' }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-emerald-100 z-50"
    >
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-emerald-600'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="text-xl mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}

export default Navigation;