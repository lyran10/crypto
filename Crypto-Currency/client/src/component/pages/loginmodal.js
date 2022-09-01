import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { tokenFromDataBase, checkTokenExpired } from "../config/tokenapi";
import { CryptoState } from "../../cryptoContext.js";
import "../styles/loginsignin.css";
import {Toastify,errorToasts,loggedInToasts} from "./toastify.js"

export const LoginModal = (props) => {
  const { dNone, logins, button, sideButton, tokenLogin } = props;
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

  const checkLogin = () => {
    axios
    .post("http://localhost:3001/login", inputs, { withCredentials: true })
    .then((data) => {
      setTimeout(() => {setlogin(data.data.status);}, 500);
       if(data.data.notExists) {
        errorToasts(data.data.notExists);
      }else if (data.data.user) {
        setusername(data.data.user.user_name);
        setuserid(data.data.user.id);

        if (JSON.parse(localStorage.getItem("id")) == null) {
          localStorage.setItem("id", JSON.stringify(data.data.user.id));
        }
        setShow(false) 
        setinputs("");
        setTimeout(() => {return loggedInToasts("Logged In")},700)
      } else {
        navigate("/");
        setShow(false);
        setinputs("");
      }
    })
    .catch((error) => console.log(error));
   }

   const handleClick = (e) => {
    e.preventDefault();
    if (inputs === "") {
      errorToasts("Fill the details");
    } else if (inputs.user_name === "" || inputs.user_name === undefined) {
      errorToasts("Enter User Name");
    } else if (
      inputs.user_password === "" ||
      inputs.user_password === undefined
    ) {
      errorToasts("Enter Password");
    }else{
      checkLogin()
    }
    
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
            margin: "auto",
            marginTop:"1px"
          }}
          className={`btn text-dark ${dNone}`}
          onClick={() => handleShow("sm-down")}
        >
          {logins || button || sideButton || tokenLogin}
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
          </Container>
        </Modal.Body>
        {!login?<Toastify/>:null}
      </Modal>
      {login?<Toastify/>:null}
    </section>
  );
};
