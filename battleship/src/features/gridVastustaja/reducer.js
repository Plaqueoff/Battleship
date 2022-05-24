const initialState = {
  oppboard: [
    ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    ["1", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["2", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["3", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["4", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["5", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["6", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["7", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["8", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["9", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    ["10", 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  ],
  gameState: "BOMB",
  oppTurn: 0,
};

const gridReducer2 = (state = initialState, action) => {
  switch (action.type) {
    case "TURN":
      return {
        ...state,
        oppTurn: action.payload.turn,
      };
    case "BOMB":
      return {
        ...state,
        oppboard: action.payload.board,
      };
    default:
      return state;
  }
};

export default gridReducer2;
