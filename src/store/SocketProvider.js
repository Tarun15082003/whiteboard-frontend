import React, { useState } from "react";
import socketContext from "./socket-context";

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const updateSocket = (socket) => {
    setSocket(socket);
  };

  const socketContextValue = {
    socket,
    updateSocket,
  };

  return (
    <socketContext.Provider value={socketContextValue}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
