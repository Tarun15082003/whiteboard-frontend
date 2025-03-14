import React, { useState } from "react";
import classes from "./index.module.css";
import { toast } from "react-toastify";
const AddCanvasForm = ({ refreshCanvasList }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://whiteboard-backend-au4x.onrender.com/canvas/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create canvas");
      }
      toast.success("Canvas created successfully");
      setName("");
      refreshCanvasList();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.inputform}>
      <div className={classes.title}>Create New Canvas</div>
      <input
        type="text"
        placeholder="Canvas Name"
        className={classes.input}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button
        className={classes.button}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Creating Canvas..." : "Create Canvas"}
      </button>
    </div>
  );
};

export default AddCanvasForm;
