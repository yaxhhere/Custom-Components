import { useEffect, useRef, useState } from "react";
import styles from "./richText.module.scss";
import { Decoratives } from "./helpers/types";
import { DecorativeIdentifiers, textIdentifiers } from "./helpers/variables";
import CustomDropdown, { Option } from "../CustomDropdown";

export default function RichTextEditor() {
  const editableDivRef: any = useRef(null);
  const [richtextHtml, setRichTextHtml] = useState("");
  const [activeIdentifiers, setActiveIdentifiers] = useState(
    new Set<Decoratives>(),
  );
  const [selectedOption, setSelectedOption] = useState<Option>();
  const savedSelection = useRef<Range | null>(null);
  
  useEffect(() => {
    if (selectedOption && selectedOption?.value != "span") {
      const selection: Selection = window.getSelection() as Selection;
      console.log(savedSelection.current, 'this is selection');
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentDiv = range.commonAncestorContainer;
        if (
          parentDiv === editableDivRef.current ||
          editableDivRef.current.contains(parentDiv)
        ) {
          if (selection.rangeCount > 0) {
            var selectedText = range.toString();
            if (selectedText.length > 0) {
              const textElement = document.createElement(
                selectedOption?.value as any,
              );
              textElement.textContent = selectedText;
              range.deleteContents();
              console.log(textElement, 'this is text element')
              range.insertNode(textElement);
            }
          }
        }
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        savedSelection.current = selection.getRangeAt(0).cloneRange();
      }
    };

    document.getElementById('richTextBox')?.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.getElementById('richTextBox')?.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);


  const onDecorativeClick = (event: any) => {
    Object.keys(DecorativeIdentifiers).forEach((doc) => {
      const docKey = doc as Decoratives;
      if (document.queryCommandState(docKey)) {
        addActiveDecorator(docKey);
      } else {
        removeActiveDecorator(docKey);
      }
    });
  };

  const addActiveDecorator = (val: Decoratives) => {
    setActiveIdentifiers((types) => {
      const newSet: Set<Decoratives> = new Set(types);
      newSet.add(val);
      return newSet;
    });
  };

  const removeActiveDecorator = (val: Decoratives) => {
    setActiveIdentifiers((types) => {
      const filteredArray = Array.from(types).filter((doc) => doc !== val);
      return new Set(filteredArray);
    });
  };

  const toggleActiveDecorator = (val: Decoratives) => {
    if (activeIdentifiers.has(val)) {
      removeActiveDecorator(val);
    } else {
      addActiveDecorator(val);
    }
  };
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

  const onDecorativeKeyUp = (event: any) => {
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
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

  const updateDoc = () => {
    if (typeof window != undefined) {
      const text = document.getElementById("richTextBox")?.innerHTML;
      setRichTextHtml(text as string);
    }
  };

  //handle bold click
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
  const preventFocusLoss = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    editableDivRef.current.focus();
  };

  return (
    <div className={styles.richTextWrapper}>
      <div className={styles.navigation}>
        <div className={styles.menuContainer}>
          <CustomDropdown
            selectedValue={selectedOption}
            setSelectedOption={setSelectedOption}
            options={textIdentifiers}
          />
          {Object.values(Decoratives).map((doc) => {
            const onClickHandler = (
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              preventFocusLoss(e);
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
        </div>
      </div>
      <div
        id="richTextBox"
        ref={editableDivRef}
        contentEditable
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
