const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection",(socket)=>{

players[socket.id] = {
x:200,
y:200,
hp:100,
team: Math.random()>0.5?"red":"blue"
};

socket.emit("init", socket.id);

socket.on("move",(data)=>{
if(players[socket.id]){
players[socket.id].x = data.x;
players[socket.id].y = data.y;
}
io.emit("players",players);
});

socket.on("shoot",()=>{
// prosty damage radius
let p1 = players[socket.id];
if(!p1) return;

for(let id in players){
if(id === socket.id) continue;

let p2 = players[id];

let dx = p2.x - p1.x;
let dy = p2.y - p1.y;

if(Math.sqrt(dx*dx+dy*dy) < 40){
p2.hp -= 20;

if(p2.hp <= 0){
p2.hp = 100;
p2.x = 200;
p2.y = 200;
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
