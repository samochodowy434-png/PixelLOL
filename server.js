const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

let blocks = [
  {x:0,y:0,z:0,type:0},
  {x:2,y:0,z:0,type:1},
  {x:4,y:0,z:0,type:2}
];

io.on("connection",(socket)=>{

players[socket.id] = {
x:0,
y:2,
z:0,
rotY:0
};

socket.emit("init",{id:socket.id,players,blocks});

// MOVE
socket.on("move",(p)=>{
if(!players[socket.id]) return;

players[socket.id].x = p.x;
players[socket.id].y = p.y;
players[socket.id].z = p.z;
players[socket.id].rotY = p.rotY;
});

// ADD BLOCK
socket.on("addBlock",(b)=>{
blocks.push(b);
io.emit("world",blocks);
});

// REMOVE BLOCK
socket.on("removeBlock",(index)=>{
if(blocks[index]){
blocks.splice(index,1);
io.emit("world",blocks);
}
});

// UPDATE PLAYERS
setInterval(()=>{
io.emit("players",players);
},50);

socket.on("disconnect",()=>{
delete players[socket.id];
});

});

http.listen(process.env.PORT || 3000);
