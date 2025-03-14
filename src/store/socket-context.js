import { createContext } from "react";

const socketContext = createContext({
  socket: null,
  updateSocket: () => {},
});

export default socketContext;
