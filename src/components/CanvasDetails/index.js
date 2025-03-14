import React, { useState, useCallback } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import classes from "./index.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CanvasDetails = ({ details, handleChangeuser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const handleClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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

  const handleDeleteUser = async (email) => {
    try {
      console.log(email);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://whiteboard-backend-au4x.onrender.com/canvas/deleteuser/${details.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail: email }),
        }
      );

      const data = await response.json();
      if (response.status === 401) {
        handleLogout();
      } else if (!response.ok) {
        throw new Error(data.error || "Error Deleting User. Please try again");
      } else {
        const state = {
          id: data.uuid,
          last_modified: data.updatedAt,
          nams: data.name,
          owner: data.owner.email,
          sharedlist: data.shared,
        };
        handleChangeuser(state);
        closeModal();
        toast.success("User removed Successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className={classes.modal} onClick={closeModal}>
          <div
            className={classes.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={classes.title}>{details?.name}</h2>
            <div className={classes.details}>
              <p>
                <span className={classes.label}>Owner:</span> {details?.owner}
              </p>
              <p>
                <span className={classes.label}>Last Modified:</span>{" "}
                {formatDate(details?.last_modified)}
              </p>
              <div>
                <span className={classes.label}>Shared with:</span>
                {details?.sharedlist?.length > 0 ? (
                  <ul className={classes.shared_list}>
                    {details.sharedlist.map((user) => (
                      <li key={user._id}>
                        {user.email}
                        <button
                          className={classes.delete_button}
                          onClick={() => handleDeleteUser(user.email)}
                          title="Remove user"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={classes.no_shared}>Not shared with anyone</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={classes.container} onClick={handleClick}>
        <RxHamburgerMenu size={24} />
      </div>
    </>
  );
};

export default CanvasDetails;
