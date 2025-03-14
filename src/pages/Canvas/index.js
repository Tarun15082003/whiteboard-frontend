import React, { useContext, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Board from "../../components/Board";
import Toobar from "../../components/Toolbar";
import Toolbox from "../../components/Toolbox";
import boardContext from "../../store/board-context";
import AddUser from "../../components/AddUser";
import CanvasDetails from "../../components/CanvasDetails";
import BackButton from "../../components/Backbutton";
import socketContext from "../../store/socket-context";

const Canvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateElementsHandler, setUuidHandler } = useContext(boardContext);
  const [canvasDetails, setCanvasDetails] = useState(null);
  const { socket, updateSocket } = useContext(socketContext);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    if (socket) socket.disconnect();
    updateSocket(null);
    navigate("/login");
  }, [navigate, socket]);

  const handleChangeuser = useCallback((details) => {
    setCanvasDetails(details);
  }, []);

  useEffect(() => {
    const fetchCanvasData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not Found");
        handleLogout();
        return;
      }

      try {
        const response = await fetch(
          `https://whiteboard-backend-au4x.onrender.com/canvas/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error);
          navigate("/dashboard");
        } else {
          setUuidHandler(id);
          const state = {
            id: data.uuid,
            last_modified: data.updatedAt,
            nams: data.name,
            owner: data.owner.email,
            sharedlist: data.shared,
          };
          handleChangeuser(state);
          updateElementsHandler(data.elements || []);
        }
      } catch (err) {
        toast.error(err.message);
        navigate("/dashboard");
      }
    };

    fetchCanvasData();
    if (!socket) {
      const newSocket = io("https://whiteboard-backend-au4x.onrender.com", {
        auth: { token: localStorage.getItem("token") },
      });
      updateSocket(newSocket);
    } else {
      socket.emit("joinCanvas", { canvasId: id });
      socket.on("canvasUpdated", ({ canvas }) => {
        console.log(canvas);
        updateElementsHandler(canvas.elements || []);
      });
    }

    return () => {
      if (socket) socket.off("canvasUpdated");
    };
  }, [id, handleLogout, navigate, socket]);

  return (
    <React.Fragment>
      <Toobar />
      <Toolbox />
      <AddUser handleAdduser={handleChangeuser} />
      <CanvasDetails
        details={canvasDetails}
        handleChangeuser={handleChangeuser}
      />
      <BackButton />
      <Board />
    </React.Fragment>
  );
};

export default Canvas;
