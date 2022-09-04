import { useEffect } from "react";
import { numberWithCommas } from "./carousel";
import { CryptoState } from "../cryptoContext";
import axios from "axios";
import { checkTokenExpired } from "./config/tokenapi";

export const WatchList = () => {
  const {
    userList,
    addingCoin,
    getdata,
    fetchCoins,
    coins,
    symbol,
    currency,
    deleteItem,
    setDeletedItem,
    setLogin,
  } = CryptoState();

  useEffect(() => {
    fetchCoins();
    getdata();
  }, [addingCoin, deleteItem, currency]);

  const deleteCoinFromDataBase = async (userId) => {
    try {
      setLogin(true);
      let id = userId;
      const { data } = await axios.delete(
        "http://localhost:3001/deletecoin",
        { data: { id: id } },
        { withCredentials: true }
      );
      setDeletedItem(data);
    } catch (error) {
      console.log(error)
    }
    
  }

  const handleDelete = async (e) => {
    let token = localStorage.getItem("token")
      checkTokenExpired(`${token}`)
        .then((data) => {
          if (data.data.error) {
            renewIfExpired()
            deleteCoinFromDataBase(e.target.id)
          }else{
            deleteCoinFromDataBase(e.target.id)
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <div>
      {userList
        ? coins.map((coin) => {
            if (userList.includes(coin.id)) {
              return (
                <li
                  key={coin?.id}
                  className="watchListLi d-flex justify-content-between"
                >
                  <span className="mt-1">{coin?.name}</span>
                  <div className="d-flex gap-2">
                    <span
                      className="mt-1"
                      id={coin.id}
                      onClick={(e) => console.log(e.target.id)}
                    >
                      {symbol}{" "}
                      {numberWithCommas(coin?.current_price.toFixed(2))}
                    </span>
                    <span>
                      <button
                        className="text-light p-1"
                        style={{
                          border: "solid 1px gold",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          fontSize: "10px",
                        }}
                        id={coin.id}
                        onClick={(e) => handleDelete(e)}
                      >
                        remove
                      </button>
                    </span>
                  </div>
                </li>
              );
            }
          })
        : null}
    </div>
  );
};
