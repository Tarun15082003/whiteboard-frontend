import React, { useCallback, useState } from "react";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import Modal from "../Modal/index";
import { toast } from "react-toastify";

const Canvascard = ({
  name,
  owner,
  last_modified,
  id,
  sharedlist,
  userEmail,
  refreshCanvasList,
}) => {
  const navigate = useNavigate();
  const [showShared, setShowShared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleShared = (e) => {
    e.stopPropagation();
    setShowShared((prev) => !prev);
  };

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

  const handleClick = () => {
    navigate(`/canvas/${id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://whiteboard-backend-au4x.onrender.com/canvas/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to Delete canvas");
      }
      toast.success(data.message);
      refreshCanvasList();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className={classes.delete_conformation_body}>
            <span>{`Are you sure you want to delete canvas ${name} ?`} </span>
            <button
              className={classes.button}
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting Canvas..." : "Delete Canvas"}
            </button>
          </div>
        </Modal>
      )}
      <div className={classes.card} onClick={handleClick}>
        <div className={classes.header}>
          <span className={classes.title}>{name}</span>
          <span className={classes.modified}>{formatDate(last_modified)}</span>
        </div>
        <div className={classes.body}>
          <span>{`Created by: ${owner}`}</span>
          <div className={classes.body_right}>
            {owner === userEmail && (
              <button
                className={classes.delete_btn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
              >
                <AiFillDelete size={24} />
              </button>
            )}

            {sharedlist && sharedlist.length > 0 && (
              <div className={classes.shared}>
                <button
                  className={classes.dropdownToggle}
                  onClick={toggleShared}
                >{`Shared with (${sharedlist.length})`}</button>
                {showShared && (
                  <ul className={classes.dropdownMenu}>
                    {sharedlist.map((user) => (
                      <li
                        key={user._id || user.email}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {user.email}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvascard;
