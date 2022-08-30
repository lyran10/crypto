import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { CoinList } from "./component/config/coinapi";
import {
  tokenFromDataBase,
  checkTokenExpired,
  renewToken,
} from "./component/config/tokenapi";
import axios from "axios";
import "./component/styles/navBar.css";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [login, setlogin] = useState(false);
  const [currency, setcurrency] = useState("ILS");
  const [symbol, setsymbol] = useState("₪");
  const [coins, setcoins] = useState([]);
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState("");
  const [userid, setuserid] = useState();
  const [cleared, setcleared] = useState("");
  const [userlist, setuserlist] = useState();
  const [addcoin, setaddcoin] = useState();
  const [deleteitem, setdeleteditem] = useState();
  const [spinner, setspinner] = useState(false);
  const [modal, setmodal] = useState(false);
  const [translate, settranslate] = useState("translate");
  const [miniSideBarTranslate, setminiSideBarTranslate] =
    useState("minitranslateback");

  useEffect(() => {
    if (currency === "USD") setsymbol("$");
    else if (currency === "ILS") setsymbol("₪");
  }, [currency, login]);

  const SpinnerLoading = () => {
    setspinner(true);

    setTimeout(() => {
      setspinner(false);
    }, 1200);
  };

  const handleToken = () => {
    tokenFromDataBase(JSON.parse(localStorage.getItem("id")))
      .then((data) => {
        setuserid(data.data.user[0].id);
        setusername(data.data.user[0].user_name);
        getdata();
        checkTokenExpired(data.data.user[0])
          .then((data) => {
            setlogin(data.data.status);
            if (data.data.error) {
              renewToken()
                .then((data) => {
                  console.log();
                })
                .catch((err) => {
                  if (err.response.data.error === "jwt expired") {
                    setlogin(err.response.data.status);
                    localStorage.removeItem("id");
                    settranslate("translate");
                    setminiSideBarTranslate("minitranslateback");
                    setTimeout(() => {
                      setmodal(true);
                    }, 1000);
                  }
                });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const getdata = async () => {
    if (JSON.parse(localStorage.getItem("id"))) {
      const { data } = await axios.post(
        "/getlist",
        { user_id: { id: JSON.parse(localStorage.getItem("id")) } },
        { withCredentials: true }
      );

      let user = data.data.reduce((acc, pre) => {
        return [...acc, pre.coin];
      }, []);
      setuserlist(user);
    }
  };

  const fetchCoins = async () => {
    setloading(true);
    const { data } = await axios.get(CoinList(currency), {
      withCredentials: false,
    });
    setcoins(data);
    setloading(false);
  };

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setcurrency,
        coins,
        loading,
        fetchCoins,
        login,
        setlogin,
        username,
        userid,
        setuserid,
        setusername,
        cleared,
        getdata,
        userlist,
        addcoin,
        setaddcoin,
        deleteitem,
        setdeleteditem,
        handleToken,
        spinner,
        SpinnerLoading,
        modal,
        setmodal,
        translate,
        settranslate,
        miniSideBarTranslate,
        setminiSideBarTranslate,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
