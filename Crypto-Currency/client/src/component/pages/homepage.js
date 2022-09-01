import { Banner } from "./banner.js";
import { CoinsTable } from "./coinstable.js";
import { CryptoState } from "../../cryptoContext";
import { useEffect, useState } from "react";
import "../styles/navBar.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {
  const [show, setshow] = useState(false);
  const { getdata, addcoin, handleToken, SpinnerLoading, login } =
    CryptoState();

    const toasts = () => {
      return toast.success("Logged In", { position: toast.POSITION.TOP_CENTER });
     };

  useEffect(
    () => {
      SpinnerLoading();
      if (JSON.parse(localStorage.getItem("id") !== null)) {
        handleToken();
      }
      getdata();
    },
    [addcoin, JSON.parse(localStorage.getItem("id"))],
    login
  );

  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <main
      className="m-auto"
      style={{
        backgroundColor: "black",
        width: "98.7vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {show ? (
        <div>
          <Banner />
          <CoinsTable />
        </div>
      ) : null}
      <ToastContainer />
    </main>
  );
};
