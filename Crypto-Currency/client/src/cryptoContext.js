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
  const [login, setLogin] = useState(false);
  const [currency, setCurrency] = useState("ILS");
  const [symbol, setSymbol] = useState("₪");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState();
  const [cleared, setCleared] = useState("");
  const [userList, setUserList] = useState();
  const [addingCoin, setAddingCoin] = useState();
  const [deleteItem, setDeletedItem] = useState();
  const [spinner, setSpinner] = useState(false);
  const [modal, setModal] = useState(false);
  const [openSideNav, setOpenSideNav] = useState("translate");
  const [openMiniNav, setOpenMiniNav] =
    useState("minitranslateback");

  // change the symbol of currency when changed
  useEffect(() => {
    if (currency === "USD") setSymbol("$");
    else if (currency === "ILS") setSymbol("₪");
  }, [currency, login]);

// function to show spinner loader when spinner is true
  const SpinnerLoading = () => {
    setSpinner(true);

    setTimeout(() => {
      setSpinner(false);
    }, 1200);
  };

  const userTokenExpired = (error) => {
    setLogin(error);
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setOpenSideNav("translate");
    setOpenMiniNav("minitranslateback");
    setTimeout(() => {
      setModal(true);
    }, 1000);
  }

  const renewIfExpired = () => {
    renewToken()
    .then((data) => {
      setLogin(data.data.status);
    })
    .catch((err) => {
      if (err.response.data.error === "jwt expired") {
        userTokenExpired(err.response.data.status)
      }
    });
  }

  const handleToken = () => {
    tokenFromDataBase(JSON.parse(localStorage.getItem("id")))
      .then((data) => {
        setUserId(data.data.user[0].id);
        setUserName(data.data.user[0].user_name);
        getdata();
        localStorage.setItem("token",data.data.user[0]?.session_id)
        checkTokenExpired(data.data.user[0]?.session_id)
          .then((data) => {
            if(data.data.status){
              setLogin(data.data.status);
            }else if (data.data.error) {
                renewIfExpired()
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

// function to get the user coins which are stored in the watch list from the database to display in the watch list
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
      setUserList(user);
    }
  };

// fetch the data of the coins from an API
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency), {
      withCredentials: false,
    });
    setCoins(data);
    setLoading(false);
  };

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        fetchCoins,
        login,
        setLogin,
        userName,
        userId,
        setUserId,
        setUserName,
        cleared,
        getdata,
        userList,
        addingCoin,
        setAddingCoin,
        deleteItem,
        setDeletedItem,
        handleToken,
        spinner,
        SpinnerLoading,
        modal,
        setModal,
        openSideNav,
        setOpenSideNav,
        openMiniNav,
        setOpenMiniNav,
        renewIfExpired,
        userTokenExpired
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
