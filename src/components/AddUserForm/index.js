import React, { useState, useContext } from "react";
import classes from "./index.module.css";
import { toast } from "react-toastify";
import boardContext from "../../store/board-context";
const AddUserForm = ({ onClose, handleAdduser }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { uuid } = useContext(boardContext);

  const handleClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://whiteboard-backend-au4x.onrender.com/canvas/adduser/${uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userEmail: email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add user to canvas");
      }
      const state = {
        id: data.uuid,
        last_modified: data.updatedAt,
        nams: data.name,
        owner: data.owner.email,
        sharedlist: data.shared,
      };
      handleAdduser(state);
      toast.success("Added user Successfully");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  return (
    <div className={classes.inputform}>
      <div className={classes.title}>Add new Collaborator</div>
      <input
        type="text"
        placeholder="Enter User Email"
        className={classes.input}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button
        className={classes.button}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Adding Collaborator..." : "Add Collaborator"}
      </button>
    </div>
  );
};

export default AddUserForm;
