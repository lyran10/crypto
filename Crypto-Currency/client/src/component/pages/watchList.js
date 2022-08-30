import { useEffect } from "react";
import { numberWithCommas } from "./carousel";
import { CryptoState } from "../../cryptoContext";
import axios from "axios";

export const WatchList = () => {
  const {
    userlist,
    addcoin,
    getdata,
    fetchCoins,
    coins,
    symbol,
    currency,
    deleteitem,
    setdeleteditem,
    setlogin,
  } = CryptoState();

  useEffect(() => {
    fetchCoins();
    getdata();
  }, [addcoin, deleteitem, currency]);

  const handleDelete = async (e) => {
    setlogin(true);
    let id = e.target.id;
    const { data } = await axios.delete(
      "/deletecoin",
      { data: { id: id } },
      { withCredentials: true }
    );
    setdeleteditem(data);
  };

  return (
    <div>
      {userlist
        ? coins.map((coin) => {
            if (userlist.includes(coin.id)) {
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
