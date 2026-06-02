const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

let blocks = [
{ x:0, y:0, z:0, type:0 },
{ x:2, y:0, z:0, type:1 },
{ x:4, y:0, z:0, type:2 }
];

io.on("connection",(socket)=>{

players[socket.id] = {
x:0,
y:2,
z:0
};

socket.emit("init",{
id:socket.id,
blocks,
players
});

socket.on("move",(data)=>{
let p = players[socket.id];
if(!p) return;

p.x = data.x;
p.y = data.y;
p.z = data.z;
});

socket.on("addBlock",(b)=>{
blocks.push(b);
io.emit("worldUpdate",blocks);
});

socket.on("removeBlock",(index)=>{
blocks.splice(index,1);
io.emit("worldUpdate",blocks);
});

socket.on("disconnect",()=>{
delete players[socket.id];
io.emit("playersUpdate",players);
});

setInterval(()=>{
io.emit("playersUpdate",players);
},1000/20);

});

http.listen(process.env.PORT || 3000);
