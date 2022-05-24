// - - - - - - BACKEND TESTAUSTA VARTEN - - - - - - 

const io = require('socket.io-client');

process.title = "Client";
var socket = io.connect("http://localhost:5000");

var playing = true;
var map = {};
var fireCount = 0;

function Shoot()
{
    if(fireCount >= 100) return;

    let xCoord, yCoord;
    let freeCellFound = false;
    while(!freeCellFound)
    {
        xCoord = Math.floor(Math.random(socket.id) * 10);
        yCoord = Math.floor(Math.random(socket.id) * 10);

        if(map[`${xCoord}-${yCoord}`] == null)
        {
            map[`${xCoord}-${yCoord}`] = true;
            freeCellFound = true;
        }
    }

    fireCount++;
    if(fireCount >= 100) 
        console.log(`All cells exhausted (${fireCount})`);

    socket.emit("fire", { x: xCoord, y: yCoord });
}

socket.on("matchFound", (data) => {
    console.log("Match found");
    console.log(data);

    if(data.turn == true)
        socket.emit("fire", { x: 0, y: 0 });
});

socket.on("fireResults", (data) => {

    if(data.myShot == false)
    {
        if(data.hit)
            console.log(`You got hit (${data.x}, ${data.y})`);

        if(playing == true)
        {
            setTimeout(Shoot, 100);
            //Shoot();
        }
    }
    else if(data.myShot == true)
    {
        if(data.hit)
            console.log(`Successful shot (${data.x}, ${data.y})`);
    }
});

socket.on("gameover", (data) => {
    playing = false;
    if(data.victory == true)
        console.log("VICTORY!")
    else
        console.log("PATHETIC FAILURE!")
});

socket.on("opponentDisconnected", () => {
    console.log("Opponent disconnected.");
    playing = false;
});

socket.on("error", (error) => {
    console.log(error);
    process.exit();
});

let fleet = [ 
    { x:0, y:0, direction: 0, length: 1}, 
    { x:0, y:1, direction: 0, length: 2},
    { x:0, y:2, direction: 0, length: 2},
    { x:0, y:3, direction: 0, length: 2},
    { x:0, y:4, direction: 0, length: 3},
    { x:0, y:5, direction: 0, length: 3},
    { x:0, y:6, direction: 0, length: 2},
    { x:0, y:7, direction: 0, length: 3},
    { x:0, y:8, direction: 0, length: 1},
    { x:0, y:9, direction: 0, length: 5}
]

socket.emit("play", { fleet:fleet });