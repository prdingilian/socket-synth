import { NoteName, Scale } from "./scale-types";
import { Voice } from "./synth-presets";

export type AppState = {
  root: NoteName;
  scale: Scale;
  voice: Voice;
};

export const initialState: AppState = {
  root: "c",
  scale: "major-pentatonic",
  voice: "brass",
};
