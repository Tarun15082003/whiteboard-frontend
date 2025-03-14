import React from "react";
import Modal from "../Modal";
import classes from "./index.module.css";

const Profile = ({ closeProfile, profile }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal onClose={closeProfile}>
      <div className={classes.profileContainer}>
        <h2 className={classes.title}>Profile Details</h2>
        <div className={classes.field}>
          <span className={classes.label}>Name:</span>
          <span className={classes.value}>{profile.name}</span>
        </div>
        <div className={classes.field}>
          <span className={classes.label}>Email:</span>
          <span className={classes.value}>{profile.email}</span>
        </div>
        <div className={classes.field}>
          <span className={classes.label}>Created On:</span>
          <span className={classes.value}>{formatDate(profile.createdAt)}</span>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
