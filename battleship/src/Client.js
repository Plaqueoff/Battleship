import store from "./config/store";
const io = require("socket.io-client");
var socket = io.connect("http://localhost:5000");
process.title = "Client";

socket.on("matchFound", (data) => {
  console.log(data);

  if (data.turn) {
    //Kun oppturn = 1, gridVastustaja on enabloitu.
    store.dispatch({
      type: "TURN",
      payload: {
        turn: 1,
      },
    });
    return alert("Game has started, it's your turn!");
  } else {
    //Vice versa oppturn = 0:lle
    store.dispatch({
      type: "TURN",
      payload: {
        turn: 0,
      },
    });
  return alert("Game has started, wait for opponents turn");
  }

});

socket.on("fireResults", (data) => {
  let newBoard = Object.assign({}, store.getState().grid.board);
  let oppBoard = Object.assign({}, store.getState().grid2.oppboard);
  let newTurn = store.getState().grid2.oppTurn;
  newTurn = (newTurn + 1) % 2;

  if (data.myShot) {
    if (data.hit) {
      oppBoard[data.y][data.x] = 3;
    } else {
      oppBoard[data.y][data.x] = 1;
    }

    store.dispatch({
      type: "BOMB",
      payload: {
        board: oppBoard,
      },
    });
  } else {
    if (data.hit) {
      newBoard[data.y][data.x] = 3;
    } else {
      newBoard[data.y][data.x] = 1;
    }
    store.dispatch({
      type: "SHIP",
      payload: {
        board: newBoard,
        turn: 1,
      },
    });
  }

  store.dispatch({
    type: "TURN",
    payload: {
      turn: newTurn,
    },
  });
});

socket.on("error", (error) => {
  console.log(error);
});


  socket.on("gameover", (data) => {
    if(data.victory === true)
        return alert("VICTORY!")
    else
        return alert("YOU'VE LOST THE GAME YOU PATHETIC FAILURE!")
  });

  socket.on("opponentDisconnected", () => {
    return alert("Opponent has disconnected")
});


export function startGame(fleet) {
  //Lähetetään servulle laivat

  socket.emit("play", fleet);
}

export function shoot([xx, yy]) {
  socket.emit("fire", { x: xx, y: yy });
}
