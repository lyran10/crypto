import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { CryptoState } from "../../cryptoContext.js";
import "../styles/loginsignin.css";

export const SignInModal = (props) => {
  const { dNone } = props;
  const { SpinnerLoading, login } = CryptoState();
  const [inputs, setinputs] = useState({});
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [Show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  useEffect(() => {
    SpinnerLoading();
  }, [login]);

  const toasts = (error) => {
    toast.warn(error, { position: toast.POSITION.TOP_CENTER });
  };

  const handleClick = (e) => {
    e.preventDefault();
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !inputs.user_confirm_password ||
      !inputs.user_password ||
      !inputs.user_name ||
      !inputs.user_email_id
    ) {
      return toasts("Fill all the Details");
    }

    if (emailPattern.test(inputs.user_email_id) === false) {
      return toasts("Email ID not valid");
    }

    if (inputs.user_password.length < 8) {
      return toasts("Password should be minimum of 8 characters");
    }

    if (inputs.user_confirm_password !== inputs.user_password) {
      return toasts("Password does not match");
    }

    axios
      .post("/signup", inputs)
      .then((data) => {
        if (data.data.Registered) {
          toasts(data.data.Registered);
        } else {
          setShow(false);
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  };

  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <>
      {!login ? (
        <Button
          style={{ backgroundColor: "gold", border: "none" }}
          className={`btn text-dark ${dNone}`}
          onClick={() => handleShow("sm-down")}
        >
          SignUp
        </Button>
      ) : null}
      <Modal
        style={{ height: "100%", paddingTop: "20px" }}
        show={Show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
      >
        <Modal.Body style={{ border: "none" }}>
          <Container className="d-flex justify-content-center align-items-center flex-column text-light">
            {show ? (
              <form
                style={{ width: "100%" }}
                className="form d-flex flex-column gap-3 justify-content-start p-3"
              >
                <h1 className="h1 text-light mt-3">SIGN UP</h1>
                <div>
                  <div>
                    <div>
                      <label>User Name</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        name="user_name"
                        onChange={(e) =>
                          setinputs((state) => ({
                            ...state,
                            user_name: e.target.value,
                          }))
                        }
                        type="text"
                        required
                      />
                      <br />
                    </div>
                    <div>
                      <label>Email ID</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        onChange={(e) =>
                          setinputs((state) => ({
                            ...state,
                            user_email_id: e.target.value,
                          }))
                        }
                        type="email"
                        required
                      />
                      <br />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label>Password</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        onChange={(e) =>
                          setinputs((state) => ({
                            ...state,
                            user_password: e.target.value,
                          }))
                        }
                        type="password"
                        required
                      />
                      <br />
                      <span style={{ fontSize: "13px", color: "gold" }}>
                        Minimum 8 characters
                      </span>
                    </div>
                    <div>
                      <label>Confirm Password</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        onChange={(e) =>
                          setinputs((state) => ({
                            ...state,
                            user_confirm_password: e.target.value,
                          }))
                        }
                        type="password"
                        required
                      />
                    </div>
                  </div>
                </div>
                <input
                  className="btn text-light border-warning mb-3"
                  onClick={handleClick}
                  type="submit"
                  value="Sign Up"
                />
              </form>
            ) : null}
            <ToastContainer />
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};
