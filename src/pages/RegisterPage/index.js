import React, { useState, useEffect } from "react";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://whiteboard-backend-au4x.onrender.com/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("User Registered Successfully. Please login");
        navigate("/login");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className={classes.container}>
      <div className={classes.inputform}>
        <div className={classes.title}>Canvas Register</div>
        <input
          type="text"
          placeholder="Email"
          className={classes.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={classes.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={classes.button}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Registering User..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
