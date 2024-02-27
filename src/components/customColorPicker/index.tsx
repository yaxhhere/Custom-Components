import { useState } from "react";
import { textColors } from "../CustomRichTextEditor/helpers/variables";
import styles from "./colorPicker.module.scss";

export interface ColorPickerProps {
  selectedColor: string;
  onChange: (newColor: string) => any;
  buttonClass: any;
}
export default function ColorPicker({
  selectedColor,
  onChange,
  buttonClass,
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  return (
    <div className={styles.colorPickerWrapper}>
      <button
        className={buttonClass}
        onClick={() => setShowPicker(val => !val)}
      >
        <div className={styles.boxContainer}>
          <div
            className={styles.colorBox}
            style={{ backgroundColor: selectedColor }}
          ></div>
          <div>A</div>
        </div>
      </button>
      {showPicker ? (
        <div className={styles.colorPicker}>
          {textColors.map((el) => {
            return (
              <button
                className={styles.colorBox}
                key={el}
                onClick={() => {
                  onChange(el);
                  setShowPicker(false);
                }}
                style={{ backgroundColor: el }}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
