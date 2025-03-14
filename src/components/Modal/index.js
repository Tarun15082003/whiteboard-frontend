import React from "react";
import classes from "./index.module.css";

const Modal = ({ children, onClose }) => {
  return (
    <div className={classes.modal} onClick={onClose}>
      <div
        className={classes.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
