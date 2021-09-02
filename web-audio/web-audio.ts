import { Oscillator, Synth } from "../constants/synth-types";

export const audioContext = (audioContext: AudioContext) => {
  let buffer: AudioBuffer;

  // safari hack, decodeAudioData doesn't work...
  if (window?.AudioContext) {
    fetch("/ir.mp3")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => (buffer = audioBuffer));
  }

  const createOscillator = (oscData: Oscillator) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscData.type;
    oscillator.frequency.value = 0;
    if (oscData.lfo) {
      const lfoOscillator = createOscillator(oscData.lfo);
      lfoOscillator.frequency.value = oscData.lfo.speed;
      lfoOscillator.start();
      const lfoGain = createGainNode();
      lfoGain.gain.value = oscData.lfo.depth / 10;
      lfoOscillator.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
    }
    return oscillator;
  };

  const createGainNode = () => {
    const gain = audioContext.createGain();
    gain.gain.value = 0;
    return gain;
  };

  const createFilter = () => {
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 0;
    return filter;
  };

  const createReverb = () => {
    const convolver = audioContext.createConvolver();
    if (buffer) {
      convolver.buffer = buffer;
    }
    return convolver;
  };

  const getOscillator = (synth: Synth, frequency: number): Function => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    const oscillator = createOscillator(synth.oscillator);
    const gain = createGainNode();
    const filter = createFilter();
    const reverb = createReverb();
    oscillator
      .connect(gain)
      .connect(filter)
      .connect(reverb)
      .connect(audioContext.destination);
    const playOscillator = () => {
      oscillator.start();
      oscillator.detune.value = Math.random() * synth.oscillator.detune;
      oscillator.frequency.value = frequency;
      gain.gain.linearRampToValueAtTime(
        synth.gain.gain,
        audioContext.currentTime + synth.gain.envelope.attack
      );
      gain.gain.setValueAtTime(
        synth.gain.gain,
        audioContext.currentTime +
          synth.gain.envelope.attack +
          synth.gain.envelope.sustain
      );
      filter.frequency.linearRampToValueAtTime(
        synth.filter.frequency,
        audioContext.currentTime + synth.filter.envelope.attack
      );
      filter.frequency.setValueAtTime(
        synth.filter.frequency,
        audioContext.currentTime +
          synth.filter.envelope.attack +
          synth.filter.envelope.sustain
      );
      gain.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime +
          synth.gain.envelope.attack +
          synth.gain.envelope.sustain +
          synth.gain.envelope.release
      );
      filter.frequency.linearRampToValueAtTime(
        0,
        audioContext.currentTime +
          synth.filter.envelope.attack +
          synth.filter.envelope.sustain +
          synth.filter.envelope.release
      );
      oscillator.stop(
        audioContext.currentTime +
          synth.gain.envelope.attack +
          synth.gain.envelope.sustain +
          synth.gain.envelope.release
      );
    };
    return playOscillator;
  };
  return { getOscillator };
};
