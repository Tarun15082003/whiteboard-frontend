import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.css";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://whiteboard-backend-au4x.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
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
        <div className={classes.title}>Canvas Login</div>
        <input
          type="text"
          placeholder="Email"
          className={classes.input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className={classes.input}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div
          className={classes.link}
          onClick={() => {
            navigate("/register");
          }}
        >
          Not a user ??Register
        </div>
        <button
          className={classes.button}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
