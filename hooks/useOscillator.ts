import { useEffect, useState } from "react";
import { Voice, synthVoices } from "../constants/synth-presets";
import { getFrequency } from "../web-audio/frequencies";
import { audioContext } from "../web-audio/web-audio";

const useOscillator = () => {
  const [playOscillator, setPlayOscillator] =
    useState<(noteValue: number, synthVoice: Voice) => void>();

  useEffect(() => {
    // safari hack...
    const CrossBrowserAudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const { getOscillator } = audioContext(new CrossBrowserAudioContext());
    const oscillatorFn = (noteValue: number, synthVoice: Voice) => {
      const frequency = getFrequency(noteValue);
      const playOscillator = getOscillator(synthVoices[synthVoice], frequency);
      playOscillator();
    };
    setPlayOscillator(() => oscillatorFn);
  }, []);

  return playOscillator;
};

export default useOscillator;
