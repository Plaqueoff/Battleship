import React, { Component } from "react";
import Grid from "./features/grid";
import Grid2 from "./features/gridVastustaja";
import AloitusBtn from "./features/AloitusBtn";
import { winOrLose } from "./";

export default class App extends Component {
  state = {
    x: 11,
    y: 11,
  };

  render() {
    return (
      <div
        style={{
          backgroundImage: "url(http://localhost:3000/tiles/BI.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          id="OwnBoard"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginRight: "60px",
          }}
        >
          <h1 style={{ textAlign: "center" }}>YOUR BOARD</h1>
          <Grid />
          <AloitusBtn />
        </div>
        <div id="OppBoard">
          <h1 style={{ textAlign: "center" }}>OPPONENT BOARD</h1>
          <Grid2 />
        </div>
      </div>
    );
  }
}
