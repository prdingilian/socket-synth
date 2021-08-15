import { Channel } from "pusher-js";
import { Voice } from "./synth-presets";

export type SynthEvent = {
  userId: string;
  relativeValue: number;
  synthVoice: Voice;
};

export const broadcastNote = (data: SynthEvent, channel: Channel) => {
  channel.trigger("client-synth-event", data);
};
