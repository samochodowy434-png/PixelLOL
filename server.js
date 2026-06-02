const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

let world = [];

// STARTOWA PŁASKA MAPA (ZIEMIA)
for(let x=-20;x<20;x++){
for(let z=-20;z<20;z++){
world.push({x, y:0, z, type:2});
}
}

io.on("connection",(socket)=>{

players[socket.id] = {
x:0,
y:2,
z:0,
rotY:0
};

socket.emit("init",{id:socket.id, world});

socket.on("move",(p)=>{
let pl = players[socket.id];
if(!pl) return;

pl.x = p.x;
pl.y = p.y;
pl.z = p.z;
pl.rotY = p.rotY;
});

socket.on("addBlock",(b)=>{
world.push(b);
io.emit("world",world);
});

socket.on("removeBlock",(index)=>{
world.splice(index,1);
io.emit("world",world);
});

setInterval(()=>{
io.emit("players",players);
},50);

socket.on("disconnect",()=>{
delete players[socket.id];
});

});

http.listen(process.env.PORT || 3000);
