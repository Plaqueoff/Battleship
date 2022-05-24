const shipCount = 10;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Ship {
  constructor(x, y, direction, length) {
    this.cells = [];
    for (let i = 0; i < length; i++) {
      switch (direction) {
        case 0:
          this.cells.push(new Cell(x + i, y));
          break;
        case 1:
          this.cells.push(new Cell(x, y + i));
          break;
      }
    }
  }
  Hit(x, y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].x == x && this.cells[i].y == y) {
        this.cells.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  IsDestroyed() {
    return this.cells.length <= 0;
  }
}
class Player {
  constructor(socket, fleet) {
    this.socket = socket;
    this.fleet = fleet;
    this.turn = false;
  }
  GetID() {
    return this.socket.id;
  }
  GetOpponent() {
    return this.opponent;
  }
  GetFleet() {
    return this.fleet;
  }
  SetOpponent(opponent) {
    this.opponent = opponent;
  }
  SetTurn(value) {
    this.turn = value;
  }

  IsInSession() {
    return this.opponent != null;
  }

  GetSocket() {
    return this.socket;
  }

  fire(x, y) {
    let result = {
      x: x,
      y: y,
      hit: false,
      sink: false,
    };
    if (this.turn == true) {
      this.SetTurn(false);
      this.opponent.SetTurn(true);

      let enemyFleet = this.opponent.GetFleet();
      for (let i = 0; i < enemyFleet.length; i++) {
        result.hit = enemyFleet[i].Hit(x, y);
        result.sink = enemyFleet[i].IsDestroyed();

        if (result.sink == true) {
          enemyFleet.splice(i, 1);
          if (enemyFleet.length <= 0) {
            this.socket.emit("gameover", { victory: true });
            this.opponent.GetSocket().emit("gameover", { victory: false });

            console.log(
              `Game over [${this.GetID()} & ${this.opponent.GetID()}]`
            );
            console.log(
              `[${this.GetID()}] was victorious with ${
                this.fleet.length
              } ships left.`
            );
          }
        }
        if (result.hit) break;
      }
      if (result.sink == true)
        console.log(
          `[${this.GetID()}] downed a ship (${enemyFleet.length} / ${
            this.fleet.length
          })`
        );

      result.myShot = true;
      this.socket.emit("fireResults", result);
      result.myShot = false;
      this.opponent.GetSocket().emit("fireResults", result);
    } else {
      this.socket.emit("error", {
        error: "Cannot fire",
        msg: "Client is out of turn",
      });
    }
  }
}

exports.Ship = Ship;
exports.Player = Player;
exports.shipCount = shipCount;
