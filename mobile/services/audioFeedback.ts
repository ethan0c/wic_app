import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

class AudioFeedbackService {
  private approvedSound: Audio.Sound | null = null;
  private notApprovedSound: Audio.Sound | null = null;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async playApproved() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' }, // Success sound
        { shouldPlay: true, volume: 0.7 }
      );
      this.approvedSound = sound;
    } catch (error) {
      console.error('Error playing approved sound:', error);
    }
  }

  async playNotApproved() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3' }, // Error sound
        { shouldPlay: true, volume: 0.5 }
      );
      this.notApprovedSound = sound;
    } catch (error) {
      console.error('Error playing not-approved sound:', error);
    }
  }

  speak(text: string, language: 'en' | 'ht' = 'en') {
    const languageCode = language === 'ht' ? 'ht-HT' : 'en-US';
    
    Speech.speak(text, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.9, // Slightly slower for clarity
      volume: 1.0,
    });
  }

  stopSpeaking() {
    Speech.stop();
  }

  async cleanup() {
    if (this.approvedSound) {
      await this.approvedSound.unloadAsync();
    }
    if (this.notApprovedSound) {
      await this.notApprovedSound.unloadAsync();
    }
  }
}

export default new AudioFeedbackService();
