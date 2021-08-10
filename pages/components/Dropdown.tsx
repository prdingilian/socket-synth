import { DropdownOption } from "../../constants/dropdown-types";
import styles from "/styles/Dropdown.module.css";

type DropdownProps = {
  label: string;
  value: any;
  setValue: Function;
  options: DropdownOption[];
};

const Dropdown = (props: DropdownProps) => {
  return (
    <>
      <label className={styles.label} htmlFor={props.label}>
        {props.label}
      </label>
      <select
        id={props.label}
        className={styles.select}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      >
        {props.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Dropdown;
