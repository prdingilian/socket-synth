import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  getScaleForKey,
  keyOptions,
  NoteName,
  Scale,
  scaleOptions,
} from "../constants/scale-types";
import { audioContext } from "../web-audio/web-audio";
import { synthVoices, Voice, voiceOptions } from "../constants/synth-presets";
import { getFrequency } from "../web-audio/frequencies";
import Dropdown from "./components/Dropdown";
import AnimatedDots from "./components/AnimatedDots";
import { AppState, initialState } from "../constants/app-state";
import { useRef, useState } from "react";
import Pusher from "pusher-js";
import { broadcastNote, SynthEvent } from "../constants/event-types";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useCallback } from "react";

// workaround: playNote needs to be defined on client for AudioContext to exist
let playNote = (noteValue: number, synthVoice: Voice) => {};

export default function Home() {
  const userId = useRef(uuidv4());
  const [state, setState] = useState(initialState);
  const updateState = (update: Partial<AppState>) =>
    setState({ ...state, ...update });

  useEffect(() => {
    if (process.browser) {
      const audio = audioContext(new AudioContext());
      playNote = (noteValue: number, synthVoice: Voice) => {
        const frequency = getFrequency(noteValue);
        const playOscillator = audio.getOscillator(
          synthVoices[synthVoice],
          frequency
        );
        playOscillator();
      };
    }
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const pusherEvents = pusher.subscribe("synth-events");
    pusherEvents.bind("synth-event", (data: SynthEvent) => {
      if (data.userId !== userId.current) {
        playNote(data.relativeValue, data.synthVoice);
      }
    });
    return () => {
      pusher.unbind_all();
      pusher.unsubscribe("synth-events");
    };
  }, []);

  const handleNotePress = useCallback(
    (noteValue: number, synthVoice: Voice) => {
      playNote(noteValue, synthVoice);
      broadcastNote(userId.current, noteValue, synthVoice);
    },
    []
  );

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Socket Synth</title>
          <meta
            name="description"
            content="A massive multiplayer musical instrument"
          />
          <link rel="icon" href="/blob.svg" />
          <link
            href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Socket Synth
            <span className={styles.headerblob}>
              <Image
                src="/blob.svg"
                alt="a purple blob"
                width={150}
                height={150}
              ></Image>
            </span>
          </h1>

          <div className={styles.row}>
            <div className={styles.column}>
              <Dropdown
                value={state.root}
                setValue={(newValue: NoteName) =>
                  updateState({ root: newValue })
                }
                label="Root"
                options={keyOptions}
              ></Dropdown>
            </div>
            <div className={styles.column}>
              <Dropdown
                value={state.scale}
                setValue={(newValue: Scale) => updateState({ scale: newValue })}
                label="Scale"
                options={scaleOptions}
              ></Dropdown>
            </div>
            <div className={styles.column}>
              <Dropdown
                value={state.voice}
                setValue={(newValue: Voice) => updateState({ voice: newValue })}
                label="Voice"
                options={voiceOptions}
              ></Dropdown>
            </div>
          </div>

          <section className={styles.grid}>
            {getScaleForKey({ note: state.root, scale: state.scale }).map(
              (note) => (
                <button
                  onClick={(_e) =>
                    handleNotePress(note.relativeValue, state.voice)
                  }
                  key={note.relativeValue}
                  className={styles.card}
                >
                  <h2>{note.noteName.toUpperCase()}</h2>
                </button>
              )
            )}
          </section>
        </main>

        <footer className={styles.footer}>
          <span className={styles.footertext}>
            <a
              href="https://github.com/prdingilian/socket-synth"
              target="_blank"
              rel="noreferrer"
            >
              View on Github
            </a>
            <span className={styles.footerblob}>
              <Image
                src="/blob.svg"
                alt="a purple blob"
                width={45}
                height={45}
              />
            </span>
          </span>
        </footer>
      </div>
      <AnimatedDots />
    </>
  );
}
