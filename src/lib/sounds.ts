"use client";

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | OscillatorNode | null = null;
  private isAmbientPlaying = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Ancient Tibetan Singing Bowl / Temple Gong chime
  public playBowlChime(volume = 0.7) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for a bronze meditation bell
    const frequencies = [432, 864, 1296, 2160];
    const decays = [4.5, 3.2, 2.0, 1.2];
    const amplitudes = [0.6, 0.25, 0.12, 0.05];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index === 0 ? "sine" : "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(amplitudes[index] * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[index]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[index]);
    });
  }

  // Tactical click
  public playClick(volume = 0.3) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Ancient Victory Chord
  public playVictory(volume = 0.7) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C major pentatonic
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + idx * 0.12;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });
  }

  // Synthesized Ambient Sound generator (Binaural Focus, Zen Stream, Cosmic Meditation, Brown Noise)
  public startAmbient(type: "binaural" | "zen" | "rain" | "space" = "binaural", volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAmbient();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    if (type === "binaural" || type === "zen" || type === "space") {
      // Create multi-oscillator binaural beats (432Hz + 440Hz for alpha focus waves)
      const baseFreq = type === "space" ? 108 : type === "zen" ? 216 : 432;
      const beatFreq = 8; // 8Hz Alpha brainwave focus

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);

      if (panner1 && panner2) {
        panner1.pan.setValueAtTime(-0.8, ctx.currentTime);
        panner2.pan.setValueAtTime(0.8, ctx.currentTime);
        osc1.connect(panner1);
        panner1.connect(masterGain);
        osc2.connect(panner2);
        panner2.connect(masterGain);
      } else {
        osc1.connect(masterGain);
        osc2.connect(masterGain);
      }

      osc1.start();
      osc2.start();
      this.ambientSource = osc1;
      this.isAmbientPlaying = true;
    } else if (type === "rain") {
      // Pink/Brown noise generator for relaxing rain
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // boost
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Low pass filter to simulate gentle rain
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      this.ambientSource = noise;
      this.isAmbientPlaying = true;
    }
  }

  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch {
        // ignore already stopped
      }
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
    this.isAmbientPlaying = false;
  }

  public getIsAmbientPlaying() {
    return this.isAmbientPlaying;
  }
}

export const soundManager = new SoundManager();
