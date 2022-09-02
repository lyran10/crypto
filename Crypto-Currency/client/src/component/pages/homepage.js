import { Banner } from "../banner.js";
import { CoinsTable } from "../coinstable.js";
import { CryptoState } from "../../cryptoContext";
import { useEffect, useState } from "react";
import "../styles/navBar.css";

export const Home = () => {
  const [show, setshow] = useState(false);
  const { getdata, addcoin, handleToken, SpinnerLoading, login } =
    CryptoState();

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
    </main>
  );
};
