import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { tokenFromDataBase, checkTokenExpired } from "../config/tokenapi";
import { CryptoState } from "../../cryptoContext.js";
import "../styles/loginsignin.css";

export const LoginModal = (props) => {
  const { dNone, logins, button, sideButton, width } = props;
  const {
    SpinnerLoading,
    settranslate,
    setusername,
    setuserid,
    setlogin,
    login,
    setminiSideBarTranslate,
  } = CryptoState();
  const [inputs, setinputs] = useState("");
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(true);
  const [Show, setShow] = useState(false);
  axios.defaults.withCredentials = true;

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const toasts = (error) => {
    toast.warn(error, { position: toast.POSITION.TOP_CENTER });
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("liran")
    if (inputs === "") {
      return toasts("Fill the details");
    } else if (inputs.user_name === "" || inputs.user_name === undefined) {
      return toasts("Enter User Name");
    } else if (
      inputs.user_password === "" ||
      inputs.user_password === undefined
    ) {
      return toasts("Enter Password");
    }
    axios
      .post("/login", inputs, { withCredentials: true })
      .then((data) => {
        setTimeout(() => {
          setlogin(data.data.status);
        }, 500);
        setShow(false);
        setinputs("");
        if (data.data.user) {
          setusername(data.data.user.user_name);
          setuserid(data.data.user.id);

          if (JSON.parse(localStorage.getItem("id")) == null) {
            localStorage.setItem("id", JSON.stringify(data.data.user.id));
          }
        }
        if (data.data.notExists) {
          return toasts(data.data.notExists);
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  };

  const checkUser = async () => {
    tokenFromDataBase(JSON.parse(localStorage.getItem("id"))).then((data) => {
      checkTokenExpired(data.data.user[0]).then((data) => {
        if (data.data.status) {
          navigate("/");
        }
      });
    });
  };

  useEffect(() => {
    checkUser();
    SpinnerLoading();
    settranslate("translate");
    setminiSideBarTranslate("minitranslateback");
  }, []);

  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <section>
      {!login ? (
        <Button
          style={{
            backgroundColor: "gold",
            border: "none",
            width: { width },
            margin: "auto",
          }}
          className={`btn text-dark ${dNone}`}
          onClick={() => handleShow("sm-down")}
        >
          {logins || button || sideButton}
        </Button>
      ) : null}
      <Modal
        style={{ height: "100%" }}
        show={Show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
      >
        <Modal.Body style={{ border: "none" }}>
          <Container className="d-flex justify-content-center align-items-center flex-column text-light p-3">
            {show ? (
              <form
                style={{ width: "100%" }}
                className="form d-flex flex-column gap-3 justify-content-start p-1"
              >
                <h1 className="h1 text-light">LOGIN</h1>
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
                  />
                  <br />
                </div>
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
                  />
                  <br />
                </div>
                <div className="d-flex flex-column gap-3">
                  <input
                    className="loginButtons btn text-light border-warning"
                    onClick={(e) => handleClick(e)}
                    type="submit"
                    value="Login"
                  />
                </div>
              </form>
            ) : null}
            <ToastContainer />
          </Container>
        </Modal.Body>
      </Modal>
    </section>
  );
};
