import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default reminders for new users
  const defaultReminders = [
    {
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
      title: 'Weekly Charity',
      message: 'Time to give your weekly charity (Sadaqah) 💝',
      time: '20:00',
      frequency: 'Weekly (Friday)',
      active: true,
      category: 'Charity',
      audioCategory: 'charity',
      playAudio: true
    }
  ];

  // Get user session
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  };

  // Get device identifier (fallback for anonymous users)
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('islamic_app_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('islamic_app_device_id', deviceId);
    }
    return deviceId;
  };

  // Load reminders from database
  const loadReminders = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      const deviceId = getDeviceId();

      let query = supabase
        .from('reminders_islamic_app')
        .select('*')
        .order('created_at', { ascending: true });

      if (session?.user) {
        query = query.eq('user_id', session.user.id);
      } else {
        query = query.eq('device_id', deviceId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading reminders:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        setReminders(data);
      } else {
        // No reminders found, create default ones
        await createDefaultReminders();
      }
    } catch (err) {
      console.error('Error in loadReminders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create default reminders for new users
  const createDefaultReminders = async () => {
    try {
      const session = await getSession();
      const deviceId = getDeviceId();

      const remindersToInsert = defaultReminders.map(reminder => ({
        ...reminder,
        user_id: session?.user?.id || null,
        device_id: session?.user?.id ? null : deviceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('reminders_islamic_app')
        .insert(remindersToInsert)
        .select();

      if (error) {
        console.error('Error creating default reminders:', error);
        setError(error.message);
        return;
      }

      setReminders(data);
    } catch (err) {
      console.error('Error in createDefaultReminders:', err);
      setError(err.message);
    }
  };

  // Add new reminder
  const addReminder = async (reminderData) => {
    try {
      const session = await getSession();
      const deviceId = getDeviceId();

      const newReminder = {
        ...reminderData,
        user_id: session?.user?.id || null,
        device_id: session?.user?.id ? null : deviceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('reminders_islamic_app')
        .insert([newReminder])
        .select()
        .single();

      if (error) {
        console.error('Error adding reminder:', error);
        setError(error.message);
        return null;
      }

      setReminders(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error in addReminder:', err);
      setError(err.message);
      return null;
    }
  };

  // Update reminder
  const updateReminder = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('reminders_islamic_app')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reminder:', error);
        setError(error.message);
        return null;
      }

      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? data : reminder
      ));
      return data;
    } catch (err) {
      console.error('Error in updateReminder:', err);
      setError(err.message);
      return null;
    }
  };

  // Delete reminder
  const deleteReminder = async (id) => {
    try {
      const { error } = await supabase
        .from('reminders_islamic_app')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting reminder:', error);
        setError(error.message);
        return false;
      }

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      return true;
    } catch (err) {
      console.error('Error in deleteReminder:', err);
      setError(err.message);
      return false;
    }
  };

  // Toggle reminder active status
  const toggleReminder = async (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return null;

    return await updateReminder(id, { active: !reminder.active });
  };

  // Toggle audio setting
  const toggleAudio = async (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return null;

    return await updateReminder(id, { playAudio: !reminder.playAudio });
  };

  // Initialize reminders on component mount
  useEffect(() => {
    loadReminders();
  }, []);

  return {
    reminders,
    loading,
    error,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    toggleAudio,
    loadReminders
  };
}