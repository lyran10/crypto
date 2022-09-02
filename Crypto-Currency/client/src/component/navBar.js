import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import "./styles/navBar.css";
import { Link } from "react-router-dom";
import { CryptoState } from "../cryptoContext.js";
import { SideBar } from "./sideBar.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { checkTokenExpired } from "./config/tokenApi";
import { LoginModal } from "./loginModal.js";
import { SignInModal } from "./signinModal";

export const Nav_Bar = () => {
  const {
    currency,
    setcurrency,
    login,
    setlogin,
    spinner,
    SpinnerLoading,
    setmodal,
    translate,
    settranslate,
    miniSideBarTranslate,
    setminiSideBarTranslate,
  } = CryptoState();

  useEffect(() => {}, [login, spinner, translate, miniSideBarTranslate]);

  const handleClick = async () => {
    let token = localStorage.getItem("token")
      checkTokenExpired(`${token}`)
        .then((data) => {
          if (data.data.status) {
            translate === "translate"
              ? settranslate("translateback")
              : settranslate("translate");
          } else if (!data.data.status) {
            setlogin(data.data.status);
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            settranslate("translate");
            setminiSideBarTranslate("minitranslateback");
            setTimeout(() => {
              setmodal(true);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleMiniBar = () => {
    miniSideBarTranslate === "minitranslate"
      ? setminiSideBarTranslate("minitranslateback")
      : setminiSideBarTranslate("minitranslate");
  };

  const handleChange = (e) => {
    SpinnerLoading();
    setcurrency(e.target.value);
  };

  return (
    <nav>
      <Navbar
        bg="dark"
        className="navbar d-flex position-fixed"
        variant="dark"
        style={{ width: "100%" }}
      >
        <Container className="p-2 d-flex justify-content-between gap-5">
          <Link
            className="navBrand"
            style={{
              cursor: "pointer",
              color: "gold",
              fontWeight: "800",
              fontSize: "20px",
            }}
            to="/"
          >
            Crypto Currency
          </Link>
          <Nav className="d-flex gap-4 justify-content-center">
            <Form.Select
              value={currency}
              onChange={(e) => handleChange(e)}
              className="select text-light bg-dark"
              aria-label="Default select example"
            >
              <option value="USD">USD</option>
              <option value="ILS">ILS</option>
            </Form.Select>

            {!login ? null : (
              <GiHamburgerMenu
                onClick={handleClick}
                size={40}
                style={{ cursor: "pointer" }}
              />
            )}

            {!login ? (
                <GiHamburgerMenu
                className = "miniSide"
                onClick={handleMiniBar}
                size={40}
                style={{ cursor: "pointer" }}
              />
            )
             : null}

            {spinner ? (
              <div className="loadingPage d-flex justify-content-center">
                <Spinner
                  style={{ width: "8rem", height: "8rem" }}
                  className="m-auto"
                  animation="border"
                  variant="warning"
                />
              </div>
            ) : null}
            <LoginModal dNone="logSignModal" button="Login" />
            <SignInModal dNone="logSignModal" />
          </Nav>
        </Container>
      </Navbar>
      <SideBar />
    </nav>
  );
};
