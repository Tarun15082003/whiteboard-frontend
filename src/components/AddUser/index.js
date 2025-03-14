import React, { useCallback, useState } from "react";
import classes from "./index.module.css";
import { AiOutlineUserAdd } from "react-icons/ai";
import Modal from "../Modal/index";
import AddUserForm from "../AddUserForm";

const AddUser = ({ handleAdduser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AddUserForm onClose={closeModal} handleAdduser={handleAdduser} />
        </Modal>
      )}
      <div className={classes.container} onClick={handleClick}>
        <AiOutlineUserAdd size={24} />
      </div>
    </>
  );
};

export default AddUser;
