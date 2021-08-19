import Modal from "react-modal";
import { ReactState } from "../../constants/react-types";
import styles from "/styles/About.module.css";

type Props = {
  state: ReactState<boolean>;
};
const About = ({ state: [isOpen, setIsOpen] }: Props) => {
  Modal.setAppElement("#root");
  return (
    <Modal
      isOpen={isOpen}
      contentLabel={"About Socket Synth modal"}
      closeTimeoutMS={500}
      style={{
        content: {
          borderRadius: "10px",
          border: "1px solid var(--theme-blue)",
          boxShadow: "0px 0px 4px var(--theme-purple)",
          maxWidth: "600px",
          height: "max-content",
          margin: "auto",
          backgroundColor: "white",
          opacity: 0.95,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.50)",
          backdropFilter: "blur(1px)",
        },
      }}
    >
      <div className={styles.container}>
        <h2 className={styles.header}>About Socket Synth</h2>
        <p className={styles.p}>
          Socket Synth is a multiplayer musical instrument. Every note that you
          play will be heard by everyone who is online, and vice versa! The
          notes that you can play depend on which Root and Scale you have
          selected. The sound that you make depends on which Voice you have
          selected. If you would like to contribute, please visit the Github
          repo.
        </p>
        <button className={styles.button} onClick={() => setIsOpen(false)}>
          Got it!
        </button>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="showAgain"
            name="showAgain"
            onChange={(e) =>
              localStorage.setItem("dontShowAgain", e.target.checked.toString())
            }
          ></input>
          <label htmlFor="showAgain">Don&apos;t show me this again</label>
        </div>
      </div>
    </Modal>
  );
};

export default About;
