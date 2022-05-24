import React, { Component } from "react";
import store from "../../config/store";
import {startGame} from "../../Client";

export class AloitusBtn extends Component {
  render() {
    return (
      <button
        style={{
          margin: "auto",
          width: "400px",
          height: "100px",
          backgroundColor: "white",
          fontSize: "30px",
        }}
        value={"AloitusBtn"}
        onClick={function (e) {
          return napinPainallus();
        }}
      >
        {" "}
        Aloita Peli
      </button>
    );
  }
}

function napinPainallus() {
  if (store.getState().grid.oppTurn === 1) {
    return;
  }
  if (store.getState().grid.placedShips.length < 10) {
    return alert("Laita kaikki laivat");
  } else {
    //disabloi oman laudan
    store.dispatch({
      type: "START",
      payload: {
        turn: 1,
      },
    });
    startGame({ fleet: store.getState().grid.placedShips });

  }
}

export default AloitusBtn;
