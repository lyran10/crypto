import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CryptoState } from "../../cryptoContext";
import { SingleCoin } from "../config/coinapi";
import { CoinInfo } from "./coininfo.js";
import parse from "html-react-parser";
import Container from "react-bootstrap/esm/Container";
import { numberWithCommas } from "./carousel";
import Spinner from "react-bootstrap/Spinner";
import "../styles/coinpage.css";
import { tokenFromDataBase, checkTokenExpired } from "../config/tokenapi";
import { LoginModal } from "./loginmodal";

export const CoinPage = () => {
  const [coin, setcoin] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currency,
    symbol,
    addcoin,
    deleteitem,
    handleToken,
    login,
    userlist,
    setlogin,
    userid,
    setaddcoin,
    setmodal,
    settranslate,
    setminiSideBarTranslate,
  } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id), {
      withCredentials: false,
    });
    setcoin(data);
  };

  const addCoin = (e) => {
    // tokenFromDataBase(JSON.parse(localStorage.getItem("id"))).then((data) => {
    //   checkTokenExpired(data.data.user[0])
    //     .then((data) => {
    //       if (data.data.status) {
            axios
              .get(
                "/addcoin",
                { coin: e.target.id, user_id: userid },
                { withCredentials: true }
              )
              .then((data) => {
                console.log(data)
                if (data.data.error) {
                          setlogin(data.data.status);
                          localStorage.removeItem("id");
                          settranslate("translateback");
                          setminiSideBarTranslate("minitranslateback");
                          navigate("/");
                          setTimeout(() => {
                            setmodal(true);
                          }, 1000);
                        }else{
                          setaddcoin(data.data);
                          settranslate("translateback");
                        }
              })
              .catch((err) => {
                console.log(err);
              });
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // });
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("id") !== null)) {
      handleToken();
    }
    fetchCoin();
  }, [addcoin, deleteitem, login, JSON.parse(localStorage.getItem("id"))]);

  if (!coin)
    return <Spinner className="" animation="border" variant="warning" />;

  return (
  <section>
    <Container
      className="container1 d-flex justify-content-start"
      style={{
        backgroundColor: "black",
        margin: "0px 0px 0px 0px",
        maxWidth: "100%",
      }}
    >
      <div className="coin d-flex flex-column">
        <img
          className="mt-5 mb-3 m-auto"
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          width="200"
        />

        <span
          style={{ fontWeight: "bold" }}
          className="text-light h2 text-center"
        >
          {coin?.name}
        </span>
        <span className="text-light" style={{ width: "100%", padding: "30px" }}>
          {parse(coin?.description.en.split(". ")[0])}.
        </span>

        <div
          className=" d-flex justify-content-start flex-column"
          style={{ padding: "5px 25px" }}
        >
          <span className="h5 text-light fw-bolder border-bottom p-2">
            Rank : {coin?.market_cap_rank}
          </span>

          <span className="h5 text-light fw-bolder border-bottom p-2">
            Current Price : {symbol}{" "}
            {numberWithCommas(
              coin?.market_data.current_price[currency.toLowerCase()]
            )}
          </span>

          <span className="h5 text-light fw-bolder border-bottom p-2">
            Market Cap : {symbol}{" "}
            {numberWithCommas(
              coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .slice(0, -4)
            )}{" "}
            M
          </span>
        </div>

        {JSON.parse(localStorage.getItem("id")) === null ? (
          <LoginModal
            logins="Login In to make your own watch list"
          />
        ) : (
          <div className="d-flex justify-content-center">
            <button
              id={coin.id}
              onClick={(e) => addCoin(e)}
              className={`btn text-light border-warning ${
                userlist ? (userlist.includes(id) ? "bg-danger" : "") : null
              } mb-3 w-75`}
              disabled={
                userlist ? (userlist.includes(id) ? true : false) : null
              }
            >
              {userlist
                ? userlist.includes(id)
                  ? "Added to Watch List"
                  : "Add to Watch List"
                : null}
            </button>
          </div>
        )}
      </div>

      <div>
        <CoinInfo coin={coin} />
      </div>
    </Container>
  </section>
  );
};
