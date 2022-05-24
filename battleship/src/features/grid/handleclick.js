import store from "../../config/store";
import handleHover from "./handlehover";

export default function handleClick(e) {
  let props = Object.assign({}, store.getState().grid);
  let newBoard = Object.assign({}, store.getState().grid.board);
  let newPlacedShips = Object.assign([], store.getState().grid.placedShips);
  let newShips = Object.assign([], store.getState().grid.ships);
  let [x, y] = e.target.id.split(",");
  [x, y] = [parseInt(x), parseInt(y)];

  if (x * y === 0) {
    return;
  }
  if (props.gameState === "Ship") {
    if ((newBoard[y][x] === 2 && props.shipLen === 0) || newBoard[y][x] === 7) {
      deleteShip(x, y, newBoard, newPlacedShips, newShips);
    } else if (props.shipLen === 0) {
      return;
    } else if (createNewBoard(x, y, newBoard, newPlacedShips, newShips)) {
      return;
    }

    handleHover(e, -1);
    handleHover(e, 1);
  } else {
    //code for dropping a bomb
    if (typeof props.board[y][x] !== "number") {
      return;
    }
    let newBoard = Object.assign({}, props.board); //turhaa
    let value = parseInt(e.target.value); //eimtn
    newBoard[x][y] = 1 + value; //jotain
    store.dispatch({
      type: "BOMB",
      payload: {
        board: newBoard,
        ships: [],
      },
    });
  }

  function deleteShip(x, y, newBoard, newPlacedShips, newShips) {
    let [newX, newY, dir] = findDir(x, y, newBoard);
    let len;
    for (let i = 0; i < newPlacedShips.length; i++) {
      if (newPlacedShips[i].x === newX && newPlacedShips[i].y === newY) {
        len = newPlacedShips[i].length;
        let apu = newPlacedShips[i];
        newPlacedShips[i] = newPlacedShips[0];
        newPlacedShips[0] = apu;
        newPlacedShips.shift();
      }
    }
    let [shipTiles, outerTiles] = getBoardTiles(newX, newY, dir, len);
    setTiles(newBoard, shipTiles, 0);
    setTiles(newBoard, outerTiles, 0);

    newShips[len - 2] += 1;

    for (let e = 0; e < newPlacedShips.length; e++) {
      let [x1, y1, dir1, len1] = [
        newPlacedShips[e].x,
        newPlacedShips[e].y,
        newPlacedShips[e].direction,
        newPlacedShips[e].length,
      ];
      let [shipTiles1, outerTiles1] = getBoardTiles(x1, y1, dir1, len1);
      setTiles(newBoard, shipTiles1, 2);
      setTiles(newBoard, outerTiles1, 4);
    }
    store.dispatch({
      type: "LEN",
      payload: {
        shipLen: len,
      },
    });
    store.dispatch({
      type: "SHIP",
      payload: {
        ships: newShips,
        board: newBoard,
        placedShips: newPlacedShips,
      },
    });
  }

  function findDir(x, y, newBoard) {
    let dir;
    if (x > 1) {
      if (newBoard[y][x - 1] === 2) {
        dir = 0;
      }
    }
    if (y > 1) {
      if (newBoard[y - 1][x] === 2) {
        dir = 1;
      }
    }
    if (x < 10) {
      if (newBoard[y][x + 1] === 2 || newBoard[y][x + 1] === 7) {
        dir = 0;
      }
    }
    if (y < 10) {
      if (newBoard[y + 1][x] === 2 || newBoard[y + 1][x] === 7) {
        dir = 1;
      }
    }
    let i = 0;
    if (dir === 0) {
      while (newBoard[y][x - i] === 2 || newBoard[y][x - i] === 7) {
        i += 1;
      }
      return [x - i + 1, y, dir];
    } else {
      while (newBoard[y - i][x] === 2 || newBoard[y - i][x] === 7) {
        i += 1;
      }
      return [x, y - i + 1, dir];
    }
  }

  function createNewBoard(x, y, newBoard, newPlacedShips, newShips) {
    let props = Object.assign({}, store.getState().grid);
    if (newBoard[y][x] === 6) {
    }

    if (props.shipDir === 0) {
      if (x > 11 - props.shipLen) {
        x = 11 - props.shipLen;
      }
      for (let i = 0; i < props.shipLen; i++) {
        if (newBoard[y][x + i] !== 5) {
          return false;
        }
      }
      let [shipTiles, outerTiles] = getBoardTiles(x, y, 0, props.shipLen);
      setTiles(newBoard, shipTiles, 2);
      setTiles(newBoard, outerTiles, 4);
    } else {
      if (y > 11 - props.shipLen) {
        y = 11 - props.shipLen;
      }
      for (let i = 0; i < props.shipLen; i++) {
        if (newBoard[y + i][x] !== 5) {
          return false;
        }
      }
      let [shipTiles, outerTiles] = getBoardTiles(x, y, 1, props.shipLen);
      setTiles(newBoard, shipTiles, 2);
      setTiles(newBoard, outerTiles, 4);
    }
    updateShips(newShips);
    newPlacedShips.push({
      x: x,
      y: y,
      direction: props.shipDir,
      length: props.shipLen,
    });
    store.dispatch({
      type: "SHIP",
      payload: {
        ships: newShips,
        board: newBoard,
        placedShips: newPlacedShips,
      },
    });
  }

  function getBoardTiles(x, y, dir, len) {
    let outerTiles = [];
    let shipTiles = [];

    if (dir === 0) {
      if (x > 1) {
        outerTiles.push([x - 1, y]);
      }
      if (x + len <= 10) {
        outerTiles.push([x + len, y]);
      }
      for (let i = 0; i < len; i++) {
        shipTiles.push([x + i, y]);
        if (y > 1) {
          outerTiles.push([x + i, y - 1]);
        }
        if (y < 10) {
          outerTiles.push([x + i, y + 1]);
        }
      }
    } else {
      if (y > 1) {
        outerTiles.push([x, y - 1]);
      }
      if (y + len <= 10) {
        outerTiles.push([x, y + len]);
      }
      for (let i = 0; i < len; i++) {
        shipTiles.push([x, y + i]);
        if (x > 1) {
          outerTiles.push([x - 1, y + i]);
        }
        if (x < 10) {
          outerTiles.push([x + 1, y + i]);
        }
      }
    }

    return [shipTiles, outerTiles];
  }

  function setTiles(board, tiles, type) {
    for (let i = 0; i < tiles.length; i++) {
      board[tiles[i][1]][tiles[i][0]] = type;
    }
  }

  function updateShips(newShips) {
    let props = Object.assign({}, store.getState().grid);
    newShips[props.shipLen - 2] -= 1;

    if (newShips[props.shipLen - 2] === 0) {
      let nextShipSize = ((props.shipLen + 1) % 4) + 2;
      let shipIndex = nextShipSize - 2;
      let count = 0;

      while (newShips[shipIndex] === 0 && count < 4) {
        nextShipSize = ((nextShipSize + 1) % 4) + 2;
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
  }
}
