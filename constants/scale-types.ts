import { DropdownOption } from "./dropdown-types";

export const noteNames = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
];

export type NoteName = typeof noteNames[number];

export type Note = {
  noteName: NoteName;
  relativeValue: number;
};

export const notes: Note[] = [...noteNames, ...noteNames].map(
  (noteName, i) => ({
    noteName,
    relativeValue: i - 9,
  })
);

export const scales = [
  "major-pentatonic",
  "minor-pentatonic",
  "dorian-pentatonic",
  "lydian-pentatonic",
] as const;

export type Scale = typeof scales[number];

export type Key = {
  note: NoteName;
  scale: Scale;
};

type ScaleSteps = {
  scale: Scale;
  steps: number[];
};

const scaleSteps: ScaleSteps[] = [
  { scale: "major-pentatonic", steps: [0, 2, 4, 7, 9, 12] },
  { scale: "minor-pentatonic", steps: [0, 3, 5, 7, 10, 12] },
  { scale: "dorian-pentatonic", steps: [0, 2, 3, 7, 9, 12] },
  { scale: "lydian-pentatonic", steps: [0, 2, 4, 6, 9, 12] },
];

export const keyOptions: DropdownOption[] = noteNames.map((name) => ({
  value: name,
  label: name.toUpperCase(),
}));

export const scaleOptions: DropdownOption[] = scales.map((scale) => ({
  value: scale,
  label: scale
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" "),
}));

export const getScaleForKey = (key: Key): Note[] => {
  const rootIndex = notes.findIndex(({ noteName }) => noteName === key.note);
  const { steps } = scaleSteps.find((scale) => scale.scale === key.scale)!;
  return steps.map((step) => notes[rootIndex + step]);
};
