import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "../styles/navBar.css";
import { CryptoState } from "../../cryptoContext";

export const Modale = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const { setmodal } = CryptoState();

  const handleClose = () => {
    setShow(false);
    navigate("/log");
    setmodal(false);
  };

  const closeButton = () => {
    setShow(false);
    setmodal(false);
  };

  return (
    <section>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body variant="dark">
          Your session is over. Please login again
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={closeButton}>
            Close
          </Button>
          <LoginModal tokenLogin="Login" onClick={handleClose}/>
        </Modal.Footer>
      </Modal>
    </section>
  );
};
