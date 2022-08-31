import "../styles/navBar.css";
import { CryptoState } from "../../cryptoContext";
import { useNavigate } from "react-router-dom";
import { WatchList } from "./watchList";
import { useEffect,useRef } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { LoginModal } from "./loginmodal.js";
import { SignInModal } from "./signinmodal";

export const SideBar = () => {
  const sideMenuRef = useRef()
  const miniMenuBar = useRef()
  const {
    username,
    cleared,
    login,
    setlogin,
    userid,
    translate,
    setusername,
    settranslate,
    SpinnerLoading,
    currency,
    setcurrency,
    miniSideBarTranslate,
    setminiSideBarTranslate,
  } = CryptoState();
  const navigate = useNavigate();

  const closeSideMenuBar = (ref,close,set,event) => {
    document.body.addEventListener(event,(event) => {
      if(ref.current){
        if(!ref.current.contains(event.target)){set(close)}
  }        
})
  }

  useEffect(() => {
    if(login === true){
      closeSideMenuBar(sideMenuRef,"translate",settranslate,"click")
    }
    closeSideMenuBar(miniMenuBar,"minitranslateback",setminiSideBarTranslate,"mousedown")
  }, [translate, login, currency, miniSideBarTranslate]);

  const handleLogout = () => {
    axios.get("/logout").then((data) => {
      axios
        .delete("/deltoken", {
          data: { id: userid, data: null },
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      setTimeout(() => {
        setlogin(false);
      }, 500);
      localStorage.removeItem("id");
      if (data.data.status === "cleared") {
        SpinnerLoading();
        navigate("/");
        setusername("");
        setminiSideBarTranslate("minitranslateback");
      } else {
        SpinnerLoading();
        navigate("/");
      }
    });
  };

  const handleChange = (e) => {
    SpinnerLoading();
    setcurrency(e.target.value);
  };

	const formSelect = () => {
		return(
			<Form.Select
			value={currency}
			onChange={(e) => handleChange(e)}
			className="mini text-light bg-dark"
			aria-label="Default select example"
		>
			<option value="USD">USD</option>
			<option value="ILS">ILS</option>
		</Form.Select>
		)
	}

  return (
    <>
      {login ? (
        <nav
          style={{ paddingRight: "0px" }}
          className={`sideBar ${
            !login || cleared === "" ? "d-flex" : "d-none"
          } ${translate} justify-content-start text-light`}
          ref={sideMenuRef}
        >
          <ul
            className="sideBarUl"
            style={{ backgroundColor: "black" }}
          >
            <li
              className="li text-light mt-3"
              style={{ fontWeight: "800", fontSize: "20px" }}
            >
              <div className="d-flex flex-column text-center">
                <span>User Name</span>
                <span>{`${username}`}</span>
              </div>
            </li>
            <li>
              {formSelect()}
            </li>
            <li className="li">
              <div
                className="bg-dark d-flex flex-column"
                style={{
                  minHeight: "50vh",
                  borderRadius: "10px",
                }}
              >
                <span className="h6 mt-3 align-self-center fw-bold">
                  Watch List
                </span>
                <ul className="watchListUl">
                  <WatchList />
                </ul>
              </div>
            </li>
            <li className="li">
              <button
                onClick={() => {
                  settranslate("translate");
                  handleLogout();
                }}
                style={{ backgroundColor: "gold" }}
                className="mb-3 btn text-dark border-warning"
              >
                LOGOUT
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
      {!login ? (
        <nav
          style={{ paddingRight: "0px" }}
          className={`miniSideBar  ${miniSideBarTranslate} justify-content-start text-light`}
          ref={miniMenuBar}
        >
          <ul
            className="sideBarUl"
            style={{
              width: "100%",
              minHeight: "200px",
              backgroundColor: "black",
            }}
          >
            <li>
							{formSelect()}
            </li>
            <li>
              <LoginModal sideButton="Login" />
            </li>
            <li>
              <SignInModal />
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
};
