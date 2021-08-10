export const getFrequency = (halfStepsFromRoot: number): number => {
  // math stuff from the internet https://pages.mtu.edu/~suits/NoteFreqCalcs.html
  const a = 2 ** (1 / 12);
  const fixedNote = 440;
  return fixedNote * a ** halfStepsFromRoot;
};
