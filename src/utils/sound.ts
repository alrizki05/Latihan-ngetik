// Web Audio API zero-dependency synthesizer for mechanical and arcade typing feedback

class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.4;
  private type: 'mechanical' | 'soft' | 'clicky' = 'mechanical';

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policy
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public setType(type: 'mechanical' | 'soft' | 'clicky') {
    this.type = type;
  }

  public playKeypress(isCorrect: boolean = true) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.ctx.destination);

    if (this.type === 'mechanical') {
      // Mechanical switch: two quick transient pulses (stem impact & bottom out)
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      const baseFreq = isCorrect ? 440 + Math.random() * 60 : 220;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gainNode.gain.setValueAtTime(this.volume * 0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (this.type === 'clicky') {
      // Sharp high-pitch click (like Cherry MX Blue)
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(isCorrect ? 1800 : 300, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

      gainNode.gain.setValueAtTime(this.volume * 0.18, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.03);
    } else {
      // Soft thock: muted sine low end
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isCorrect ? 320 : 180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gainNode.gain.setValueAtTime(this.volume * 0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.055);
    }
  }

  public playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

    gainNode.gain.setValueAtTime(this.volume * 0.22, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playComboMilestone(streak: number) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const baseFreq = 523.25; // C5
    const multiplier = streak >= 50 ? 2 : streak >= 25 ? 1.5 : 1.25;
    const freq = baseFreq * multiplier;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.33, now + 0.12);

    gainNode.gain.setValueAtTime(this.volume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((pitch, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, startTime + i * 0.1);

      gain.gain.setValueAtTime(this.volume * 0.35, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.1 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.28);
    });
  }
}

export const soundManager = new SoundEffects();
