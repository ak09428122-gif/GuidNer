/**
 * GuideNer Unified Smart Notification Center & Web Audio Synthesizer
 * Dispatches alarms, chimes, smart alarms, and category reminders using native browser APIs and synthesized Web Audio tones.
 */

import { SmartNotification } from '../database/schema';

class NotificationEngine {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  /**
   * Synthesize audio tone for notifications, alarms, and meditation chimes
   */
  public playTone(type: 'gentle_chime' | 'alarm_alert' | 'water_drop' | 'meditation_singing_bowl' = 'gentle_chime') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'gentle_chime') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.6); // G5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'alarm_alert') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(440, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.3);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'water_drop') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'meditation_singing_bowl') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now); // 432 Hz Tuning

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      }
    } catch (e) {
      console.warn('Audio synthesis unavailable:', e);
    }
  }

  /**
   * Request Native Browser Notification Permission
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return false;
  }

  /**
   * Dispatch a notification toast / system alert
   */
  public dispatch(notif: SmartNotification) {
    this.playTone(
      notif.category === 'alarm' || notif.category === 'smart_alarm'
        ? 'alarm_alert'
        : notif.category === 'water'
        ? 'water_drop'
        : 'gentle_chime'
    );

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`GuideNer: ${notif.title}`, {
        body: notif.body,
        icon: '/favicon.ico',
      });
    }
  }
}

export const notificationEngine = new NotificationEngine();
