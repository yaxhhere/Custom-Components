import { useEffect, useRef, useState } from "react";
import styles from "./richText.module.scss";
import { Decoratives, Script } from "./helpers/types";
import {
  DecorativeIdentifiers,
  textIdentifierOptions,
} from "./helpers/variables";
import CustomSelect, { Option } from "../customSelect";
import { FaStrikethrough } from "react-icons/fa6";
import { FaSubscript } from "react-icons/fa";
import { FaSuperscript } from "react-icons/fa";
import isFormattingActive from "./helpers/customFunctions";
import ColorPicker from "../customColorPicker";

export default function RichTextEditor() {
  const editableDivRef: any = useRef(null);
  const [richtextHtml, setRichTextHtml] = useState("");
  const [activeIdentifiers, setActiveIdentifiers] = useState(
    new Set<Decoratives>(),
  );
  const [selectedHeading, setActiveHeading] = useState<Option>();
  const [activeStrikeThrough, setActiveStrikeThrough] =
    useState<boolean>(false);
  const [activeScript, setActiveScript] = useState<Script>();
  const [selectedColor, setSelectedColor] = useState<string>("#000");

  const reset = () => {
    setActiveIdentifiers(new Set<Decoratives>());
    setActiveHeading({} as Option);
    setActiveStrikeThrough(false);
    setActiveScript("" as Script);
  };

  // code for handling heading and paragraph tags
  const handleHeadingClick = (val: Option) => {
    setActiveHeading(val);
    document.execCommand("formatBlock", false, val.value);
    preventFocusLoss();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    document.execCommand("foreColor", false, color);
  };

  // adding strike through
  const addStrikeThrough = () => {
    setActiveStrikeThrough((val) => !val);
    document.execCommand("strikeThrough", false);
    preventFocusLoss();
  };

  const addSubSupScript = (script: Script) => {
    if (activeScript == script) {
      setActiveScript("" as Script);
    } else setActiveScript(script);
    document.execCommand(script, false);
    preventFocusLoss();
  };

  // code for decoratives Bold underline and italics
  const onDecorativeClick = (event: any) => {
    Object.keys(DecorativeIdentifiers).forEach((doc) => {
      const docKey = doc as Decoratives;
      const activatedFormatBlock = document.queryCommandValue("formatBlock");
      if (activatedFormatBlock) {
        setActiveHeading(
          textIdentifierOptions.filter(
            (doc) => doc.value == activatedFormatBlock,
          )[0],
        );
      }

      // here we are just updating button styles
      setActiveStrikeThrough(document.queryCommandState("strikeThrough"));
      const superScript = isFormattingActive("superscript");
      const subscript = isFormattingActive("subscript");
      setActiveScript(
        superScript
          ? Script.superscript
          : subscript
            ? Script.subscript
            : ("" as Script),
      );
      setSelectedColor(document.queryCommandValue('foreColor'));
      if (document.queryCommandState(docKey)) {
        addActiveDecorator(docKey);
      } else {
        removeActiveDecorator(docKey);
      }
    });
  };

  // adding active decoratives
  const addActiveDecorator = (val: Decoratives) => {
    setActiveIdentifiers((types) => {
      const newSet: Set<Decoratives> = new Set(types);
      newSet.add(val);
      return newSet;
    });
  };

  // removing active decoratives
  const removeActiveDecorator = (val: Decoratives) => {
    setActiveIdentifiers((types) => {
      const filteredArray = Array.from(types).filter((doc) => doc !== val);
      return new Set(filteredArray);
    });
  };

  // toggling active decoratives
  const toggleActiveDecorator = (val: Decoratives) => {
    if (activeIdentifiers.has(val)) {
      removeActiveDecorator(val);
    } else {
      addActiveDecorator(val);
    }
  };

  // handling key down for selected text updated using ctrl keys
  const onDecorativeKeyDown = (event: any) => {
    if (event.ctrlKey) {
      if (event.key === "b" || event.key === "B") {
        toggleActiveDecorator(Decoratives.BOLD);
      } else if (event.key === "u" || event.key === "U") {
        toggleActiveDecorator(Decoratives.UNDERLINE);
      } else if (event.key === "i" || event.key === "I") {
        toggleActiveDecorator(Decoratives.ITALICS);
      }
    }
  };

  // handling key up for text box
  const onDecorativeKeyUp = (event: any) => {
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      setActiveStrikeThrough(
        document.queryCommandValue("strikeThrough") == "true" ? true : false,
      );
      const superScript = isFormattingActive("superscript");
      const subscript = isFormattingActive("subscript");
      setSelectedColor(document.queryCommandValue('foreColor'));
      setActiveScript(
        superScript
          ? Script.superscript
          : subscript
            ? Script.subscript
            : ("" as Script),
      );
      const activatedFormatBlock = document.queryCommandValue("formatBlock");
      if (activatedFormatBlock) {
        setActiveHeading(
          textIdentifierOptions.filter(
            (doc) => doc.value == activatedFormatBlock,
          )[0],
        );
      }
      Object.keys(DecorativeIdentifiers).forEach((doc) => {
        const docKey = doc as Decoratives;
        if (document.queryCommandState(docKey)) {
          addActiveDecorator(docKey);
        } else {
          removeActiveDecorator(docKey);
        }
      });
    }
  };

  // updating the text content to html
  const updateDoc = () => {
    if (typeof window != undefined) {
      const text = document.getElementById("richTextBox")?.innerHTML;
      if (!text?.length) {
        reset();
      }
      setRichTextHtml(text as string);
    }
  };

  //handle decoratives click
  const handleDecorativeClicks = (type: Decoratives) => {
    if (activeIdentifiers.has(type)) {
      setActiveIdentifiers((types) => {
        const filteredArray = Array.from(types).filter((doc) => doc !== type);
        return new Set(filteredArray);
      });
    } else {
      setActiveIdentifiers((types) => {
        const newSet: Set<Decoratives> = new Set(types);
        newSet.add(type);
        return newSet;
      });
    }
    const selection: Selection = window.getSelection() as Selection;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentDiv = range.commonAncestorContainer;
      if (
        parentDiv === editableDivRef.current ||
        editableDivRef.current.contains(parentDiv)
      ) {
        // Apply the command to the selected text
        document.execCommand(type, false);
      }
    }
  };
  // prevent loss of focus
  const preventFocusLoss = () => {
    editableDivRef.current.focus();
  };

  return (
    <div
      className={styles.richTextWrapper}
      onMouseEnter={() => {
        preventFocusLoss();
      }}
    >
      <div className={styles.navigation}>
        <div className={styles.menuContainer}>
          <CustomSelect
            options={textIdentifierOptions}
            defaultValue={textIdentifierOptions[0]?.value}
            onChange={handleHeadingClick}
            customSelected={selectedHeading as Option}
          />
          {Object.values(Decoratives).map((doc) => {
            const onClickHandler = (
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              preventFocusLoss();
              handleDecorativeClicks(doc as Decoratives);
            };
            switch (doc) {
              case Decoratives.BOLD:
                return (
                  <button
                    key={doc}
                    className={`${styles.menuItem} ${activeIdentifiers.has(doc) ? styles.active : ""}`}
                    onClick={onClickHandler}
                    title={doc}
                    aria-label={doc}
                  >
                    <strong>B</strong>
                  </button>
                );
              case Decoratives.ITALICS:
                return (
                  <button
                    key={doc}
                    className={`${styles.menuItem} ${activeIdentifiers.has(doc) ? styles.active : ""}`}
                    onClick={onClickHandler}
                    title={doc}
                    aria-label={doc}
                  >
                    <i>I</i>
                  </button>
                );
              case Decoratives.UNDERLINE:
                return (
                  <button
                    key={doc}
                    className={`${styles.menuItem} ${activeIdentifiers.has(doc) ? styles.active : ""}`}
                    onClick={onClickHandler}
                    title={doc}
                    aria-label={doc}
                  >
                    <u>U</u>
                  </button>
                );
              default:
                return <></>;
            }
          })}
          <button
            className={`${styles.menuItem} ${activeStrikeThrough ? styles.active : ""}`}
            onClick={() => {
              addStrikeThrough();
            }}
          >
            <FaStrikethrough />
          </button>
          <button
            className={`${styles.menuItem} ${activeScript === Script.subscript ? styles.active : ""}`}
            onClick={() => {
              addSubSupScript(Script.subscript);
            }}
          >
            <FaSubscript />
          </button>
          <button
            className={`${styles.menuItem} ${activeScript === Script.superscript ? styles.active : ""}`}
            onClick={() => {
              addSubSupScript(Script.superscript);
            }}
          >
            <FaSuperscript />
          </button>
          <ColorPicker
            selectedColor={selectedColor}
            onChange={handleColorSelect}
            buttonClass={styles.menuItem}
          />
        </div>
      </div>
      <div
        id="richTextBox"
        ref={editableDivRef}
        contentEditable
        content={richtextHtml}
        onClick={onDecorativeClick}
        onKeyDown={onDecorativeKeyDown}
        onKeyUp={onDecorativeKeyUp}
        role="textbox"
        aria-multiline="true"
        data-slate-editor="true"
        data-slate-node="value"
        onInput={() => {
          updateDoc();
        }}
        className={styles.textAffector}
      />
    </div>
  );
}
