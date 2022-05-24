const express = require('express');
const app = express();
const JWT = require('jsonwebtoken');
const http = require('http').createServer();
const io = require('socket.io')(http);

var Game = require('./Game.js'); // Oma skripti, sisältää pelin luokat

process.title = "Battleships -  Server";
const port = 5000;
var lobby = [];   // Vapaat pelaajat (odottavat toista pelaajaa)


io.on("connection", socket => {

    console.log("connected: [" + socket.id + "]");
    let player;
    
    socket.on("disconnect", () => {
        console.log(`~disconnected: [${socket.id}]`);
        if(player && player.IsInSession())
            player.GetOpponent().GetSocket().emit("opponentDisconnected");
        removeFromLobby(socket.id);
    });

    socket.on("play", (data) => {

        let fleet = [];
        for (var ship in data.fleet) {
            if (data.fleet.hasOwnProperty(ship)) {
                let newShip = new Game.Ship(data.fleet[ship].x, data.fleet[ship].y, data.fleet[ship].direction, data.fleet[ship].length);
                fleet.push(newShip);
            }
        }
        if(fleet.length != Game.shipCount) {
            socket.emit("error", { error: "Cannot create player", msg: "Invalid fleet size ("+fleet.length+"/"+Game.shipCount+")" });
            return;
        }

        console.log(`Player is ready [${socket.id}]`);
        player = new Game.Player(socket, fleet);
        lobby.push(player);
        matchPlayers();
    });

    socket.on("fire", (data) => {
        if(player == null)
        {
            socket.emit("error", { error: "Cannot fire", msg: "You haven't started a game yet" });
            return;
        }
        if(!player.IsInSession())
        {
            socket.emit("error", { error: "Cannot fire", msg: "You haven't been matched to a session yet" });
            return;
        }
        player.fire(data.x, data.y);
    });
});

http.listen(port, () => {
    console.log(`Server online at http://localhost:${port}`);
});

function matchPlayers() {
    if(lobby.length > 1) {
        lobby[0].SetOpponent(lobby[1]);
        lobby[1].SetOpponent(lobby[0]);

        lobby[0].GetSocket().emit("matchFound", { turn: true });
        lobby[0].SetTurn(true);
        lobby[1].GetSocket().emit("matchFound", { turn: false });
        lobby[1].SetTurn(false);

        lobby.shift();
        lobby.shift();

        console.log("2 players matched to a game session.");
    }
}

function removeFromLobby(id) {
    for(let i = 0; i < lobby.length; i++)
    {
        if(lobby[i].GetID() == id)
        {
            lobby.splice(i, 1);
            console.log(`[${id}] removed from lobby. (lobby: ${lobby.length})`);
        }
    }
}

/* 
    JWT.sign( { id: connection.id }, connection.secret, (err, token) => {
        player = new Game.Player(token, newFleet);
        connections.push(player);
        freePlayers.push(player);
        res.send({ error: err, token: token});
        matchPlayers();
    });
*/