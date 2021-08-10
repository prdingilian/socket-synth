import { DropdownOption } from "./dropdown-types";
import { Synth } from "./synth-types";

const brass: Synth = {
  oscillator: {
    type: "sawtooth",
    detune: 6,
    lfo: {
      type: "sine",
      detune: 0,
      speed: 4,
      depth: 9,
    },
  },
  filter: {
    type: "lowpass",
    frequency: 2000,
    Q: 1400,
    envelope: {
      attack: 0.3,
      sustain: 0.3,
      release: 0.5,
    },
  },
  gain: {
    gain: 0.3,
    envelope: {
      attack: 0.4,
      sustain: 0.3,
      release: 0.5,
    },
  },
};

const alien: Synth = {
  oscillator: {
    type: "square",
    detune: 9,
    lfo: {
      type: "sine",
      detune: 50,
      speed: 9,
      depth: 11,
    },
  },
  filter: {
    type: "lowpass",
    frequency: 1700,
    Q: 500,
    envelope: {
      attack: 0.6,
      sustain: 0.3,
      release: 0.4,
    },
  },
  gain: {
    gain: 0.2,
    envelope: {
      attack: 0.1,
      sustain: 0.8,
      release: 0.4,
    },
  },
};

const retro: Synth = {
  oscillator: {
    type: "triangle",
    detune: 9,
    lfo: {
      type: "sine",
      detune: 9,
      speed: 3,
      depth: 70,
    },
  },
  filter: {
    type: "lowpass",
    frequency: 2400,
    Q: 500,
    envelope: {
      attack: 0.1,
      sustain: 0.4,
      release: 0.3,
    },
  },
  gain: {
    gain: 0.3,
    envelope: {
      attack: 0.1,
      sustain: 0.7,
      release: 0.0,
    },
  },
};

export const synthVoices = {
  brass,
  alien,
  retro,
};

export const voiceOptions: DropdownOption[] = Object.keys(synthVoices).map(
  (voice) => ({ label: voice[0].toUpperCase() + voice.slice(1), value: voice })
);

export type Voice = keyof typeof synthVoices;
