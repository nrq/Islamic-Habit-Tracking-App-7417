import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiDatabase, FiCheck, FiX, FiLoader, FiSettings, FiExternalLink, FiCopy } = FiIcons;

function DatabaseSetup({ onSetupComplete }) {
  const [setupStatus, setSetupStatus] = useState('checking'); // checking,needed,creating,complete,error
  const [error, setError] = useState('');
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  const checkDatabaseSetup = async () => {
    try {
      setSetupStatus('checking');
      
      // Try to query the reminders table
      const { data, error } = await supabase
        .from('reminders_islamic_app')
        .select('id')
        .limit(1);

      if (error) {
        if (error.message.includes('relation "reminders_islamic_app" does not exist')) {
          setSetupStatus('needed');
        } else {
          setSetupStatus('error');
          setError(error.message);
        }
      } else {
        setSetupStatus('complete');
        if (onSetupComplete) onSetupComplete();
      }
    } catch (err) {
      setSetupStatus('error');
      setError(err.message);
    }
  };

  const createDatabase = async () => {
    try {
      setSetupStatus('creating');
      
      // Try to create the table using raw SQL
      const createTableSQL = `
        -- Create reminders table for Islamic app
        CREATE TABLE reminders_islamic_app (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          time TEXT NOT NULL,
          frequency TEXT NOT NULL,
          category TEXT NOT NULL,
          audio_category TEXT NOT NULL DEFAULT 'general',
          play_audio BOOLEAN DEFAULT true,
          active BOOLEAN DEFAULT true,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          device_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE reminders_islamic_app ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can manage their own reminders" 
        ON reminders_islamic_app FOR ALL 
        USING (
          auth.uid() = user_id OR 
          (auth.uid() IS NULL AND device_id IS NOT NULL)
        );

        -- Create indexes for better performance
        CREATE INDEX idx_reminders_user_id ON reminders_islamic_app(user_id);
        CREATE INDEX idx_reminders_device_id ON reminders_islamic_app(device_id);
        CREATE INDEX idx_reminders_active ON reminders_islamic_app(active);
      `;

      const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (error) {
        console.error('Error creating table:', error);
        setSetupStatus('error');
        setError('Unable to create table automatically. Please use manual setup.');
        return;
      }

      setSetupStatus('complete');
      if (onSetupComplete) onSetupComplete();
    } catch (err) {
      console.error('Error in createDatabase:', err);
      setSetupStatus('error');
      setError('Unable to create table automatically. Please use manual setup.');
    }
  };

  const copySQL = () => {
    const sql = `-- Create reminders table for Islamic app
CREATE TABLE reminders_islamic_app (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL,
  category TEXT NOT NULL,
  audio_category TEXT NOT NULL DEFAULT 'general',
  play_audio BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reminders_islamic_app ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own reminders" 
ON reminders_islamic_app FOR ALL 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND device_id IS NOT NULL)
);

-- Create indexes for better performance
CREATE INDEX idx_reminders_user_id ON reminders_islamic_app(user_id);
CREATE INDEX idx_reminders_device_id ON reminders_islamic_app(device_id);
CREATE INDEX idx_reminders_active ON reminders_islamic_app(active);`;

    navigator.clipboard.writeText(sql).then(() => {
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    });
  };

  const renderSetupInstructions = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">Manual Database Setup Instructions</h4>
      <p className="text-sm text-blue-700 mb-3">
        To enable reminder syncing across devices, please set up the database table in your Supabase project:
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-white rounded border p-2">
          <span className="text-sm text-gray-700">1. Open your Supabase SQL Editor</span>
          <a
            href="https://supabase.com/dashboard/project/svinuzgenzpxgsyyolqx/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <span>Open SQL Editor</span>
            <SafeIcon icon={FiExternalLink} className="text-xs" />
          </a>
        </div>

        <div className="bg-white rounded border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">2. Copy and run this SQL:</span>
            <button
              onClick={copySQL}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              <SafeIcon icon={FiCopy} className="text-xs" />
              <span>{sqlCopied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="text-xs text-gray-800 whitespace-pre-wrap bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
{`-- Create reminders table for Islamic app
CREATE TABLE reminders_islamic_app (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL,
  category TEXT NOT NULL,
  audio_category TEXT NOT NULL DEFAULT 'general',
  play_audio BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reminders_islamic_app ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own reminders" 
ON reminders_islamic_app FOR ALL 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND device_id IS NOT NULL)
);

-- Create indexes for better performance
CREATE INDEX idx_reminders_user_id ON reminders_islamic_app(user_id);
CREATE INDEX idx_reminders_device_id ON reminders_islamic_app(device_id);
CREATE INDEX idx_reminders_active ON reminders_islamic_app(active);`}
          </pre>
        </div>

        <div className="text-xs text-blue-600 bg-white p-2 rounded border">
          3. After running the SQL successfully, click "Check Again" below
        </div>
      </div>
    </div>
  );

  if (setupStatus === 'checking') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 text-center"
        >
          <SafeIcon icon={FiLoader} className="text-4xl text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Checking Database Setup</h2>
          <p className="text-emerald-600">Verifying your reminder storage...</p>
        </motion.div>
      </div>
    );
  }

  if (setupStatus === 'needed') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100"
        >
          <div className="text-center mb-6">
            <SafeIcon icon={FiDatabase} className="text-4xl text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">Database Setup Required</h2>
            <p className="text-emerald-600">Set up your reminder storage to sync across devices</p>
          </div>

          {renderSetupInstructions()}

          <div className="flex space-x-3">
            <button
              onClick={createDatabase}
              className="flex-1 bg-emerald-500 text-white p-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSettings} />
              <span>Try Auto Setup</span>
            </button>
            <button
              onClick={checkDatabaseSetup}
              className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Check Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (setupStatus === 'creating') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 text-center"
        >
          <SafeIcon icon={FiLoader} className="text-4xl text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Setting Up Database</h2>
          <p className="text-emerald-600">Creating your reminder storage...</p>
        </motion.div>
      </div>
    );
  }

  if (setupStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100"
        >
          <div className="text-center mb-6">
            <SafeIcon icon={FiX} className="text-4xl text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Setup Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
          </div>

          {renderSetupInstructions()}

          <button
            onClick={checkDatabaseSetup}
            className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (setupStatus === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 text-center"
        >
          <SafeIcon icon={FiCheck} className="text-4xl text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Database Ready!</h2>
          <p className="text-emerald-600">Your reminders will now sync across all your devices</p>
        </motion.div>
      </div>
    );
  }

  return null;
}

export default DatabaseSetup;