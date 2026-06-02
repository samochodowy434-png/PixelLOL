const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection",(socket)=>{

players[socket.id] = {
x: 100,
y: 100,
hp: 100,
angle: 0,
kills: 0
};

socket.emit("init", socket.id);

socket.on("move",(data)=>{
let p = players[socket.id];
if(!p) return;

p.x = data.x;
p.y = data.y;
p.angle = data.angle;
});

socket.on("shoot",(data)=>{

for(let id in players){
if(id === socket.id) continue;

let p = players[id];

let dx = p.x - data.x;
let dy = p.y - data.y;

let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < 80){
p.hp -= 25;

if(p.hp <= 0){
p.hp = 100;
p.x = 100;
p.y = 100;

players[socket.id].kills++;
}
}
}

io.emit("players",players);
});

socket.on("disconnect",()=>{
delete players[socket.id];
});

});

http.listen(process.env.PORT || 3000);
