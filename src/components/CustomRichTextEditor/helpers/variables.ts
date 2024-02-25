import { Option } from "../../CustomDropdown";
import { Decoratives } from "./types";

export const DecorativeIdentifiers: Record<Decoratives, string[]> = {
  bold: ["b", "strong"],
  underline: ["u"],
  italic: ["i"],
};

export const textIdentifiers: Option[] = [
  {
    key: "normal",
    label: "Normal Text",
    value: "span",
  },
  {
    key: "h1",
    label: "Heading 1",
    value: "h1",
  },
  {
    key: "h2",
    label: "Heading 2",
    value: "h2",
  },
  {
    key: "h3",
    label: "Heading 3",
    value: "h3",
  },
  {
    key: "h4",
    label: "Heading 4",
    value: "h4",
  },
  {
    key: "h5",
    label: "Heading 5",
    value: "h5",
  },
  {
    key: "h6",
    label: "Heading 6",
    value: "h6",
  },
];
