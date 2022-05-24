import store from "../../config/store";
import {shoot} from "../../Client";

export default function handleclick(e) {
  let props = Object.assign({}, store.getState().grid2);
  let [x, y] = e.target.id.split(",");
  [x, y] = [parseInt(x), parseInt(y)];

  if (props.oppboard[y][x] !== 10) {
    return;
  }

  shoot([x,y]);


  //tänne Socket.io jutut
}
