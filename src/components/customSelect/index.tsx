import { useEffect, useState } from "react";
import styles from "./customSelect.module.scss";

export interface SelectProps {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  options: Option[];
  onChange?: (e: Option) => any;
  customSelected: Option;
}

export interface Option {
  label: string;
  value: string;
  key: string;
}

export default function CustomSelect({
  label,
  placeholder,
  defaultValue,
  options,
  onChange,
  customSelected,
}: SelectProps) {
  const [selected, setSelected] = useState<Option>();

  useEffect(() => {
    setSelected(customSelected);
  }, [customSelected]);

  return (
    <div className={styles.selectWrapper}>
      {label ? <span className={styles.selectlabel}>{label}</span> : <></>}
      <input
        className={styles.selectInput}
        value={
          !selected && defaultValue
            ? options.filter((doc) => doc.value == defaultValue)[0].label
            : selected?.label
        }
        placeholder={placeholder || ""}
        disabled
      />
      <div id="wrapper" className={styles.optionsWrapper}>
        {options.map((el) => {
          return (
            <button
              className={styles.optionItem}
              key={el.key}
              onClick={() => {
                setSelected(el);
                onChange && onChange(el);
                // document.getElementById('wrapper')?.style.setProperty('visibility', 'collapse');
              }}
            >
              {el.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
