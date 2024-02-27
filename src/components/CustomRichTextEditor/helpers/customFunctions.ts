export default function isFormattingActive(command: string) {
  var tagName;
  switch (command) {
    case "subscript":
      tagName = "SUB";
      break;
    case "superscript":
      tagName = "SUP";
      break;
    default:
      return false; // Unsupported command
  }

  var selection = window.getSelection() as Selection;
  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);
    var parentElement = range.commonAncestorContainer.parentElement;
    while (parentElement) {
      if (parentElement.tagName === tagName) {
        return true;
      }
      parentElement = parentElement.parentElement;
    }
  }
  return false;
}
