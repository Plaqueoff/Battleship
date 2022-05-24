import store from "../../config/store";

export default function handleHover(e, int) {
  var props = Object.assign({}, store.getState().grid);
  var newBoard = Object.assign({}, store.getState().grid.board);
  if (int === -1) {
    for (let h = 1; h < 11; h++) {
      for (let e = 1; e < 11; e++) {
        if (newBoard[h][e] === 5) {
          newBoard[h][e] = 0;
        } else if (newBoard[h][e] === 7) {
          newBoard[h][e] = 2;
        } else if (newBoard[h][e] === 9) {
          newBoard[h][e] = 4;
        }
      }
    }
    store.dispatch({
      type: "SHIP",
      payload: {
        board: newBoard,
      },
    });
    return;
  }
  var [x, y] = e.target.id.split(",");
  [x, y] = [parseInt(x), parseInt(y)];
  if (x * y === 0) {
    return;
  }
  if (props.gameState === "Ship") {
    var i;
    if (props.shipDir === 0) {
      if (x > 11 - props.shipLen) {
        x = 11 - props.shipLen;
      }
      for (i = 0; i < props.shipLen; i++) {
        newBoard[y][x + i] = newBoard[y][x + i] + 5;
      }
    } else {
      if (y > 11 - props.shipLen) {
        y = 11 - props.shipLen;
      }
      for (i = 0; i < props.shipLen; i++) {
        newBoard[y + i][x] = newBoard[y + i][x] + 5;
      }
    }
    store.dispatch({
      type: "SHIP",
      payload: {
        board: newBoard,
      },
    });
  }
}
