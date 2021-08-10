type Envelope = {
  attack: number;
  release: number;
  sustain: number;
};

export type Oscillator = {
  type: "sine" | "square" | "sawtooth" | "triangle";
  detune: number;
  lfo?: LFO;
};

type LFO = Oscillator & {
  speed: number;
  depth: number;
};

type Filter = {
  type: "lowpass" | "highpass" | "bandpass";
  frequency: number;
  Q: number;
  envelope: Envelope;
  lfo?: Oscillator;
};

type Gain = {
  gain: number;
  envelope: Envelope;
  lfo?: Oscillator;
};

export type Synth = {
  oscillator: Oscillator;
  filter: Filter;
  gain: Gain;
};
