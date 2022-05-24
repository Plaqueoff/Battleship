import React, { Component } from "react";
import { connect } from "react-redux";
import "./styles.css";
import handleClick from "./handleclick";
import handleHover from "./handlehover";
import handleShipTurnAndChange from "./handleShipTurnAndChange";
import store from "../../config/store";

export class Grid extends Component {
  render() {
    return (
      <div
        style={{
          margin: "0px",
          width: "660px",
          height: "660px",
          backgroundColor: "black",
        }}
      >
        {[...Array(11)].map((_, rowI) => (
          <GridRow tiles={this.props.board[rowI]} y={rowI} key={rowI} />
        ))}
      </div>
    );
  }
}

function GridRow(props) {
  return (
    <div className="row" style={{ height: "60px" }}>
      {[...Array(11)].map((_, tileI) => (
        <Tile
          value={props.tiles[tileI]}
          x={tileI}
          y={props.y}
          key={[tileI, props.y]}
        />
      ))}
    </div>
  );
}

function Tile(props) {
  const btn = (
    <button
      id={[props.x, props.y]}
      value={props.value}
      className={`tile ${getTileSprite(props.value)}`}
      style={{
        height: "60px",
        width: "60px",
        verticalAlign: "top",
      }}
      onMouseEnter={function (e) {
        return hoverHandler(e, 1);
      }}
      onMouseLeave={function (e) {
        return hoverHandler(e, -1);
      }}
      onClick={function (e) {
        return clickHandler(e);
      }}
    >
      <h3 id="Label">{checkValue(props.value)}</h3>
    </button>
  );
  return btn;
}

function clickHandler(e) {
  if (
    typeof e.target.value === "undefined" ||
    e.target.type === undefined ||
    store.getState().grid.oppTurn !== 0
  ) {
    return;
  }
  handleClick(e);
}

function hoverHandler(e, int) {
  if (typeof e.target.value === "undefined") {
    return;
  }
  handleHover(e, int);
}

function checkValue(value) {
  if (typeof value != "number") {
    return value;
  }
}

function getTileSprite(type) {
  switch (type) {
    case 0:
      return "water";
    case 1:
      return "bombHitWater";
    case 2:
      return "ship";
    case 3:
      return "bombHitShip";
    case 4:
      return "shipAdjacent";
    case 5:
      return "shipHover";
    case 6:
      return "bombHover";
    case 7:
      return "shipPlaceError";
    case 9:
      return "shipPlaceError";
    default:
      return "nongame";
  }
}

function mapStateToProps(state) {
  return {
    ...state.grid,
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(handleShipTurnAndChange(Grid));
