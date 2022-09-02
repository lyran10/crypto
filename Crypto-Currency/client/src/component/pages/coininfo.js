import { useEffect, useState } from "react";
import { CryptoState } from "../../cryptoContext";
import axios from "axios";
import "../styles/coinpage.css";
import { HistoricalChart } from "../config/coinapi";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { SelectButton } from "./selectbutton";
import { chartDays } from "../config/data";
Chart.register(CategoryScale);

export const CoinInfo = ({ coin }) => {
  const [history, sethistory] = useState();
  const [days, setdays] = useState(1);
  const { currency, handleToken } = CryptoState();

  const fetchHistory = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency), {
      withCredentials: false,
    });
    sethistory(data.prices);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("id") !== null)) {
      handleToken();
    }
    fetchHistory();
  }, [currency, days, JSON.parse(localStorage.getItem("id"))]);

  return (
  <section>
    <Container
      className="coinInfo text-light d-flex justify-content-center align-items-center flex-column"
      style={{ backgroundColor: "black" }}
    >
      <div className="chart p-3" style={{ marginTop: "100px" }}>
        {!history ? (
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "25%" }}
          >
            <Spinner className="m-auto" animation="border" variant="warning" />{" "}
          </div>
        ) : (
          <Line
            data={{
              labels: history.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12} : ${date.getMinutes()} PM`
                    : `${date.getHours()} : ${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: history.map((coin) => coin[1]),
                  label: `Price (Past ${days} ${
                    days === 1 ? "Day" : "Days"
                  }) in ${currency}`,
                  borderColor: "#EEBC1D",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              elements: {
                point: {
                  radius: 2.5,
                },
              },
            }}
          />
        )}
      </div>
      <div
        className="buttons d-flex justify-content-center gap-3 text-light flex-wrap mb-3"
        style={{ width: "100%" }}
      >
        {chartDays.map((data) => {
          return (
            <SelectButton
              key={data.id}
              onClick={() => {
                setdays(data.value);
              }}
              selected={data.value === days}
            >
              {data.label}
            </SelectButton>
          );
        })}
      </div>
    </Container>
  </section>
  );
};
