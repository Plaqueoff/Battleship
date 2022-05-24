const initialState = {
  board: [
    ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    ["1", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["2", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["3", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["4", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["5", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["6", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["7", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["8", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["9", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["10", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  placedShips: [],
  ships: [4, 3, 2, 1],
  gameState: "Ship",
  shipDir: 1,
  shipLen: 5,
  oppTurn: 0,
};

const gridReducer = (state = initialState, action) => {
  switch (action.type) {
    case "START":
      return {
        ...state,
        oppTurn: action.payload.turn,
      };
    case "SHIP":
      if (typeof action.payload.ships === "undefined") {
        return {
          ...state,
          board: action.payload.board,
        };
      } else {
        return {
          ...state,
          board: action.payload.board,
          ships: action.payload.ships,
          placedShips: action.payload.placedShips,
        };
      }
    case "PLACESHIP":
      return {
        ...state,
        placedShips: action.payload.placedShips,
      };
    case "DIR":
      return {
        ...state,
        shipDir: action.payload.shipDir,
      };
    case "LEN":
      return {
        ...state,
        shipLen: action.payload.shipLen,
      };
    default:
      return state;
  }
};

export default gridReducer;
