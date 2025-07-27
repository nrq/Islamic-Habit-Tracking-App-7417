class AudioManager {
  constructor() {
    this.audioContext = null;
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.7;
    this.isInitialized = false;
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

  async playReminderSound(category = 'general', duration = 6000) {
    try {
      console.log(`Playing reminder sound: ${category}`);
      
      // Ensure audio is initialized
      await this.initializeAudio();
      
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Create audio element
      const audio = new Audio();
      
      // Generate the appropriate tone based on category
      let audioDataUrl;
      switch (category) {
        case 'quranStudy':
          audioDataUrl = this.generateQuranTone();
          break;
        case 'prayer':
          audioDataUrl = this.generatePrayerTone();
          break;
        case 'charity':
          audioDataUrl = this.generateCharityTone();
          break;
        case 'family':
          audioDataUrl = this.generateFamilyTone();
          break;
        default:
          audioDataUrl = this.generateGeneralTone();
      }

      audio.src = audioDataUrl;
      audio.volume = this.volume;
      audio.loop = false;

      this.currentAudio = audio;
      this.isPlaying = true;

      // Play the audio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Audio started playing successfully');
        }).catch(error => {
          console.warn('Audio play failed:', error);
          this.playSystemNotification();
        });
      }

      // Auto-stop after duration
      setTimeout(() => {
        this.stopCurrentAudio();
      }, duration);

      // Handle audio end
      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentAudio = null;
        console.log('Audio playback ended');
      });

      return true;
    } catch (error) {
      console.warn('Could not play reminder sound:', error);
      // Fallback to system notification sound
      this.playSystemNotification();
      return false;
    }
  }

  generateQuranTone() {
    // Beautiful melodic tone for Quran study - inspired by Islamic call patterns
    return this.createToneSequence([
      { freq: 523.25, duration: 0.8, volume: 0.6 }, // C5
      { freq: 587.33, duration: 0.6, volume: 0.5 }, // D5
      { freq: 659.25, duration: 0.8, volume: 0.6 }, // E5
      { freq: 698.46, duration: 1.2, volume: 0.7 }, // F5
      { freq: 659.25, duration: 0.6, volume: 0.5 }, // E5
      { freq: 587.33, duration: 1.0, volume: 0.6 }  // D5
    ]);
  }

  generatePrayerTone() {
    // Gentle ascending tone for prayer reminders
    return this.createToneSequence([
      { freq: 440.00, duration: 0.7, volume: 0.5 }, // A4
      { freq: 523.25, duration: 0.7, volume: 0.6 }, // C5
      { freq: 659.25, duration: 0.7, volume: 0.7 }, // E5
      { freq: 783.99, duration: 1.2, volume: 0.6 }, // G5
      { freq: 659.25, duration: 0.8, volume: 0.5 }  // E5
    ]);
  }

  generateCharityTone() {
    // Warm, uplifting tone for charity reminders
    return this.createToneSequence([
      { freq: 349.23, duration: 0.6, volume: 0.5 }, // F4
      { freq: 415.30, duration: 0.6, volume: 0.6 }, // G#4
      { freq: 523.25, duration: 0.8, volume: 0.7 }, // C5
      { freq: 622.25, duration: 0.6, volume: 0.6 }, // D#5
      { freq: 698.46, duration: 1.0, volume: 0.7 }, // F5
      { freq: 523.25, duration: 0.8, volume: 0.5 }  // C5
    ]);
  }

  generateFamilyTone() {
    // Caring, gentle tone for family reminders
    return this.createToneSequence([
      { freq: 261.63, duration: 0.8, volume: 0.6 }, // C4
      { freq: 329.63, duration: 0.6, volume: 0.5 }, // E4
      { freq: 392.00, duration: 0.8, volume: 0.6 }, // G4
      { freq: 523.25, duration: 1.0, volume: 0.7 }, // C5
      { freq: 392.00, duration: 0.8, volume: 0.5 }  // G4
    ]);
  }

  generateGeneralTone() {
    // Simple, peaceful tone for general reminders
    return this.createToneSequence([
      { freq: 440.00, duration: 0.8, volume: 0.6 }, // A4
      { freq: 554.37, duration: 0.8, volume: 0.6 }, // C#5
      { freq: 659.25, duration: 1.2, volume: 0.7 }, // E5
      { freq: 554.37, duration: 0.8, volume: 0.5 }  // C#5
    ]);
  }

  createToneSequence(notes) {
    const sampleRate = 44100;
    const totalDuration = notes.reduce((sum, note) => sum + note.duration, 0);
    const totalSamples = Math.floor(sampleRate * totalDuration);
    
    // Create WAV file header
    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, totalSamples * 2, true);
    
    // Generate audio data
    let currentSample = 0;
    
    notes.forEach(note => {
      const noteSamples = Math.floor(sampleRate * note.duration);
      const fadeInSamples = Math.floor(noteSamples * 0.1);
      const fadeOutSamples = Math.floor(noteSamples * 0.1);
      
      for (let i = 0; i < noteSamples && currentSample < totalSamples; i++) {
        const t = i / sampleRate;
        let amplitude = note.volume;
        
        // Apply fade in/out for smoother transitions
        if (i < fadeInSamples) {
          amplitude *= i / fadeInSamples;
        } else if (i > noteSamples - fadeOutSamples) {
          amplitude *= (noteSamples - i) / fadeOutSamples;
        }
        
        // Generate sine wave with slight harmonics for richer sound
        const fundamental = Math.sin(2 * Math.PI * note.freq * t);
        const harmonic = Math.sin(2 * Math.PI * note.freq * 2 * t) * 0.3;
        const sample = (fundamental + harmonic) * amplitude;
        
        const intSample = Math.max(-32767, Math.min(32767, sample * 32767));
        view.setInt16(44 + currentSample * 2, intSample, true);
        currentSample++;
      }
    });
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
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
}

export default new AudioManager();