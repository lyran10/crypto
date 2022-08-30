import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { CryptoState } from "../../cryptoContext";
import "../styles/coinstable.css";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./carousel";

export const CoinsTable = () => {
  const [search, setsearch] = useState("");
  const { symbol, currency, coins, loading, fetchCoins } = CryptoState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoins();
  }, [symbol, currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search) ||
        coin.name.toUpperCase().includes(search) ||
        coin.symbol.toUpperCase().includes(search)
    );
  };

  return (
    <section>
      <Container
        className="coinTable d-flex justify-content-center flex-column"
        style={{
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          maxWidth: "100%",
          margin: "0px 0px 0px 0px",
        }}
      >
        <span className="fw-normal h2 pt-5">
          Crypto Currency Prices By Market Cap
        </span>

        <form className="mt-3 mb-3">
          <label className="custom-field one">
            <input
              className="text-light inputField"
              onChange={(e) => setsearch(e.target.value)}
              type="text"
              placeholder=" "
            />
            <span className="placeholder">Enter Text</span>
          </label>
        </form>

        {loading ? (
          <Spinner animation="border" variant="warning" />
        ) : handleSearch().length === 0 ? (
          <h1>Not Found</h1>
        ) : (
          <Table variant="dark" className="coinTable w-auto">
            <thead>
              <tr style={{ color: "black" }}>
                <th style={{ backgroundColor: "gold" }}>Coin</th>
                <th style={{ backgroundColor: "gold" }}>Price</th>
                <th style={{ backgroundColor: "gold" }}>24h Change</th>
                <th style={{ backgroundColor: "gold" }}>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {handleSearch().map((row) => {
                let profit = row.price_change_percentage_24h >= 0;
                return (
                  <tr
                    className="tableRow"
                    key={row.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/coin/${row.id}`)}
                  >
                    <td className="text-start p-2">
                      <img src={row?.image} height="30" />
                      <div className="d-flex justify-content-center flex-column">
                        <span className="fs-4">{row.symbol}</span>
                        <span style={{ fontSize: "12px" }}>{row.name}</span>
                      </div>
                    </td>

                    <td className="m-auto" style={{ paddingTop: "40px" }}>
                      {symbol} {numberWithCommas(row?.current_price.toFixed(2))}
                    </td>

                    <td style={{ paddingTop: "40px" }}>
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "800",
                          color: profit > 0 ? "rgb(14,203,129)" : "red",
                          paddingTop: "50px",
                        }}
                      >
                        {profit && "+"}{" "}
                        {row?.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>

                    <td className="" style={{ paddingTop: "40px" }}>
                      <span>
                        {symbol}{" "}
                        {numberWithCommas(
                          row?.market_cap.toString().slice(0, -6)
                        )}{" "}
                        M
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </section>
  );
};
