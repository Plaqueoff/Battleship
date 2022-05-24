import store from "../../config/store";

export default function handleShipTurnAndChange(Grid) {
  window.addEventListener("contextmenu", (e) => {
    handleRightClick(e);
    clearBoard(e);
  });
  window.addEventListener("wheel", (e) => {
    handleScroll(e);
    clearBoard(e);
  });
  function clearBoard(e) {
    if (e.target.type === undefined || e.target.value === "AloitusBtn") {
      return;
    }
    let newBoard = Object.assign({}, store.getState().grid.board);
    let props = Object.assign({}, store.getState().grid);
    for (let h = 1; h < 11; h++) {
      for (let i = 1; i < 11; i++) {
        if (newBoard[h][i] === 5) {
          newBoard[h][i] = 0;
        } else if (newBoard[h][i] === 7) {
          newBoard[h][i] = 2;
        } else if (newBoard[h][i] === 9) {
          newBoard[h][i] = 4;
        }
      }
    }

    let [x, y] = e.target.id.split(",");
    [x, y] = [parseInt(x), parseInt(y)];

    if (x * y === 0) {
      return;
    }

    let i;
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

  function handleScroll(event) {
    let wheelDir;
    if (event.deltaY < 0) {
      wheelDir = -1;
    } else {
      wheelDir = 1;
    }
    let shipLen = store.getState().grid.shipLen;
    let remShips = Object.assign({}, store.getState().grid.ships);
    let nextShipSize = ((shipLen + wheelDir) % 4) + 2;
    let shipIndex = nextShipSize - 2;
    let count = 0;

    if (shipLen === 0) {
      return;
    }
    while (remShips[shipIndex] === 0 && count < 4) {
      nextShipSize = ((nextShipSize + wheelDir) % 4) + 2;
      shipIndex = nextShipSize - 2;
      count++;
    }

    if (count === 4) {
      nextShipSize = 0;
    }

    store.dispatch({
      type: "LEN",
      payload: {
        shipLen: nextShipSize,
      },
    });
  }

  function handleRightClick(event) {
    event.preventDefault();
    let i = store.getState().grid.shipDir;
    i = (i + 1) % 2;

    store.dispatch({
      type: "DIR",
      payload: {
        shipDir: i,
      },
    });
  }

  return Grid;
}
