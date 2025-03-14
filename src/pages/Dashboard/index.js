import React, { useEffect, useCallback, useState, useContext } from "react";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Canvascard from "../../components/Canvascard";
import Modal from "../../components/Modal";
import Profile from "../../components/Profile";
import AddCanvasForm from "../../components/AddCanvasForm";
import { RiUser3Line } from "react-icons/ri";
import socketContext from "../../store/socket-context";
import { io } from "socket.io-client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canvases, setCanvases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const { socket, updateSocket } = useContext(socketContext);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    if (socket) socket.disconnect();
    updateSocket(null);
    navigate("/login");
  }, [navigate, socket]);

  const handleCreateCanvas = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleShowProfile = useCallback(() => {
    setShowProfile(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  const getCanvases = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://whiteboard-backend-au4x.onrender.com/canvas/getlist",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (response.status === 401) {
        handleLogout();
      } else if (!response.ok) {
        throw new Error(
          data.error || "Error fetching Canvases. Please try again"
        );
      } else {
        setCanvases(data);
        closeModal();
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [handleLogout, closeModal]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch(
          "https://whiteboard-backend-au4x.onrender.com/user/profile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Authentication failed");
        } else {
          setProfile(data);
          getCanvases();
          if (!socket) {
            const newSocket = io(
              "https://whiteboard-backend-au4x.onrender.com",
              {
                auth: { token: localStorage.getItem("token") },
              }
            );
            updateSocket(newSocket);
          }
        }
      } catch (err) {
        toast.error(err.message);
        handleLogout();
      }
    };

    checkAuth();
  }, [handleLogout, getCanvases]);

  const filteredCanvases = canvases.filter((canvas) =>
    canvas.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.container}>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AddCanvasForm refreshCanvasList={getCanvases} />
        </Modal>
      )}
      {showProfile && (
        <Profile closeProfile={handleCloseProfile} profile={profile} />
      )}
      <div className={classes.header}>
        <h1
          className={classes.title}
          style={{
            marginLeft: "10px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Canvas Pro
        </h1>
        <div className={classes.header_right}>
          <RiUser3Line
            size={32}
            style={{
              marginTop: "10px",
              marginRight: "20px",
              cursor: "pointer",
            }}
            onClick={handleShowProfile}
          />
          <button
            className={classes.logout_btn}
            style={{
              marginRight: "10px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={handleLogout}
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.body_header}>
          <input
            className={classes.search_bar}
            type="text"
            placeholder="Search for canvases"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          ></input>
          <button
            className={classes.addCanvas_btn}
            style={{
              marginRight: "10px",
              cursor: "pointer",
            }}
            onClick={handleCreateCanvas}
          >
            <span>Add Canvas</span>
          </button>
        </div>
        <div className={classes.canvas_list}>
          {filteredCanvases.length > 0 ? (
            filteredCanvases.map((canvas) => (
              <Canvascard
                key={canvas.uuid}
                name={canvas.name}
                owner={canvas.owner.email}
                last_modified={canvas.updatedAt}
                id={canvas.uuid}
                sharedlist={canvas.shared}
                userEmail={profile.email}
                refreshCanvasList={getCanvases}
              />
            ))
          ) : (
            <p>No canvases available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
