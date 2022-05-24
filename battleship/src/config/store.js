import { createStore, combineReducers } from "redux";
import gridReducer from "../features/grid/reducer";
import gridReducer2 from "../features/gridVastustaja/reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
  grid: gridReducer,
  grid2: gridReducer2,
  
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
