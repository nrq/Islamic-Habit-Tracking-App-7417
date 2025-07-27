class AudioManager {
  constructor() {
    this.audioContext = null;
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.7;
    this.isInitialized = false;
    this.audioCache = {};
  }

  async initializeAudio() {
    try {
      // Initialize on user interaction to comply with browser policies
      if (!this.isInitialized) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isInitialized = true;
        console.log('Audio Manager initialized successfully');
      }
      return true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
      return false;
    }
  }

  async playReminderSound(category = 'general', duration = 8000) {
    try {
      console.log(`Playing Islamic vocal reminder: ${category}`);
      
      // Ensure audio is initialized
      await this.initializeAudio();
      
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Get the appropriate audio URL based on category
      const audioUrl = this.getIslamicAudioUrl(category);
      
      // Create audio element
      const audio = new Audio();
      audio.src = audioUrl;
      audio.volume = this.volume;
      audio.loop = false;

      this.currentAudio = audio;
      this.isPlaying = true;

      // Play the audio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Islamic vocal reminder started playing successfully');
        }).catch(error => {
          console.warn('Audio play failed:', error);
          this.playSystemNotification();
        });
      }

      // Auto-stop after duration if needed
      // Only stop if the audio is longer than the specified duration
      setTimeout(() => {
        if (this.isPlaying && this.currentAudio) {
          this.stopCurrentAudio();
        }
      }, duration);

      // Handle audio end
      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentAudio = null;
        console.log('Islamic vocal reminder playback ended');
      });

      return true;
    } catch (error) {
      console.warn('Could not play Islamic vocal reminder:', error);
      // Fallback to system notification
      this.playSystemNotification();
      return false;
    }
  }

  getIslamicAudioUrl(category) {
    // Check if we already have this audio cached
    if (this.audioCache[category]) {
      return this.audioCache[category];
    }
    
    // Base URL for EveryAyah.com recitations (using Mishary Rashid Alafasy voice)
    const baseEveryAyahUrl = 'https://everyayah.com/data/Alafasy_128kbps/';
    
    // Define audio URLs for each category using actual Islamic recitations
    let audioUrl;
    
    switch (category) {
      case 'quranStudy':
        // Surah Al-'Alaq 96:1-5 (Read! In the name of your Lord...)
        audioUrl = `${baseEveryAyahUrl}096001.mp3`;
        break;
        
      case 'prayer':
        // "Hayya 'ala as-Salah" (Come to prayer)
        audioUrl = 'https://islamic-audio.cdn.prismic.io/islamic-audio/c0d5f663-bbc8-49bb-aad9-8525c3ca7d67_hayya-alas-salah.mp3';
        break;
        
      case 'charity':
        // Surah Al-Baqarah 2:261 (The parable of those who spend their wealth in the way of Allah...)
        audioUrl = `${baseEveryAyahUrl}002261.mp3`;
        break;
        
      case 'family':
        // Surah Luqman 31:14 (And We have enjoined upon man [care] for his parents...)
        audioUrl = `${baseEveryAyahUrl}031014.mp3`;
        break;
        
      default:
        // Surah Al-Fatihah 1:1-4 (Default reminder - Opening of the Quran)
        audioUrl = `${baseEveryAyahUrl}001001.mp3`;
    }
    
    // Cache the audio URL
    this.audioCache[category] = audioUrl;
    
    return audioUrl;
  }

  playSystemNotification() {
    // Fallback system notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Islamic Reminder 🕌', {
        body: 'Time for your Islamic practice!',
        icon: '/vite.svg'
      });
    }
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Method to preload audio files for better performance
  preloadAudioFiles() {
    const categories = ['quranStudy', 'prayer', 'charity', 'family', 'general'];
    categories.forEach(category => {
      const audioUrl = this.getIslamicAudioUrl(category);
      const audio = new Audio();
      audio.src = audioUrl;
      audio.preload = 'metadata';
      console.log(`Preloading audio for ${category}`);
    });
  }
}

export default new AudioManager();