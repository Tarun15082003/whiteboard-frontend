import React, { useCallback, useContext } from "react";
import classes from "./index.module.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import socketContext from "../../store/socket-context";
import boardContext from "../../store/board-context";

const BackButton = () => {
  const navigate = useNavigate();
  const { socket } = useContext(socketContext);
  const { uuid } = useContext(boardContext);
  const handleClick = useCallback(() => {
    socket.emit("leaveCanvas", { canvasId: uuid });
    navigate("/dashboard");
  }, [navigate, socket, uuid]);

  return (
    <div className={classes.container} onClick={handleClick}>
      <IoArrowBackSharp size={24} />
    </div>
  );
};

export default BackButton;
