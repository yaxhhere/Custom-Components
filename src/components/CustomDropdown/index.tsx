import { useState } from "react";
import styles from "./customDropdown.module.scss";

export interface Props {
  options: Option[];
  selectedValue?: Option;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option | undefined>>;
}

export interface Option {
  key: string;
  label: string;
  value?: string;
  render?: (props: any) => JSX.Element;
}

export default function CustomDropdown({
  options,
  selectedValue,
  setSelectedOption,
}: Props) {
  return (
    <div className={styles.selectWrapper}>
      <input
        value={selectedValue?.label || options[0]?.label}
        className={styles.selectInput}
        disabled
      />
      <ul className={styles.optionsWrapper}>
        {options.map((doc) => {
          const CustomRender = doc?.render;
          return (
            <li
              className={styles.optionItem}
              key={doc?.key}
              onClick={() => setSelectedOption(doc)}
            >
              {CustomRender ? <CustomRender /> : <>{doc.label}</>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
