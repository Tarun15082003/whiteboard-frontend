import { createContext } from "react";

const boardContext = createContext({
  uuid: "",
  activeToolItem: "",
  elements: [],
  history: [[]],
  index: 0,
  toolActionType: "",
  boardMouseDownHandler: () => {},
  boardMouseMoveHandler: () => {},
  changeToolHandler: () => {},
  boardMouseUpHandler: () => {},
  undoActionHandler: () => {},
  redoActionHandler: () => {},
  textAreaBlurHandler: () => {},
  updateElementsHandler: () => {},
  setUuidHandler: () => {},
});

export default boardContext;
