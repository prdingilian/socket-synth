import { Voice } from "./synth-presets";

export type SynthEvent = {
  userId: string;
  relativeValue: number;
  synthVoice: Voice;
};

export const broadcastNote = (
  userId: string,
  noteValue: number,
  synthVoice: Voice
) => {
  const data: SynthEvent = {
    userId,
    relativeValue: noteValue,
    synthVoice: synthVoice,
  };
  fetch("/api/synth-event", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
