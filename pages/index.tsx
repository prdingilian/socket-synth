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
import Dropdown from "./components/Dropdown";
import AnimatedDots from "./components/AnimatedDots";
import { AppState, initialState } from "../constants/app-state";
import { useRef, useState } from "react";
import { broadcastNote, SynthEvent } from "../constants/event-types";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useCallback } from "react";
import usePusher from "../hooks/usePusher";
import useOscillator from "../hooks/useOscillator";
import { Voice, voiceOptions } from "../constants/synth-presets";
import About from "./components/About";

export default function Home() {
  const userId = useRef(uuidv4());
  const [appState, setAppState] = useState(initialState);
  const [modalState, setModalState] = useState(true);
  const updateState = (update: Partial<AppState>) =>
    setAppState({ ...appState, ...update });

  const playOscillator = useOscillator();
  const { channel, userCount } = usePusher();

  useEffect(() => {
    channel?.bind("client-synth-event", (data: SynthEvent) => {
      if (data.userId !== userId.current) {
        playOscillator?.(data.relativeValue, data.synthVoice);
      }
    });
  }, [channel, playOscillator]);

  useEffect(() => {
    if (localStorage.getItem("dontShowAgain") === "true") {
      setModalState(false);
    }
  }, []);

  const handleNotePress = useCallback(
    (noteValue: number, synthVoice: Voice) => {
      playOscillator?.(noteValue, synthVoice);
      if (channel) {
        broadcastNote(
          { userId: userId.current, relativeValue: noteValue, synthVoice },
          channel
        );
      }
    },
    [channel, playOscillator]
  );

  return (
    <>
      <div className={styles.container} id="root">
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
                priority
              ></Image>
            </span>
          </h1>
          <span className={styles.usercount}>
            <span className={styles.usericon}>
              <Image
                src="/user.svg"
                alt="a user icon"
                width={15}
                height={15}
                priority
              ></Image>
            </span>
            {userCount < 1
              ? "No other people online"
              : userCount === 1
              ? "1 other person online"
              : `${userCount} other people online`}
          </span>

          <div className={styles.row}>
            <div className={styles.column}>
              <Dropdown
                value={appState.root}
                setValue={(newValue: NoteName) =>
                  updateState({ root: newValue })
                }
                label="Root"
                options={keyOptions}
              ></Dropdown>
            </div>
            <div className={styles.column}>
              <Dropdown
                value={appState.scale}
                setValue={(newValue: Scale) => updateState({ scale: newValue })}
                label="Scale"
                options={scaleOptions}
              ></Dropdown>
            </div>
            <div className={styles.column}>
              <Dropdown
                value={appState.voice}
                setValue={(newValue: Voice) => updateState({ voice: newValue })}
                label="Voice"
                options={voiceOptions}
              ></Dropdown>
            </div>
          </div>

          <section className={styles.grid}>
            {getScaleForKey({ note: appState.root, scale: appState.scale }).map(
              (note) => (
                <button
                  onClick={(_e) =>
                    handleNotePress(note.relativeValue, appState.voice)
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
                priority
              />
            </span>
          </span>
        </footer>
      </div>
      <AnimatedDots />
      <About isOpen={modalState} setIsOpen={setModalState}></About>
    </>
  );
}
