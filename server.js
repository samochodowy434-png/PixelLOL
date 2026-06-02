const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection",(socket)=>{

players[socket.id] = {
x: 200,
y: 200,
hp: 100,
kills: 0
};

socket.on("move",(data)=>{
if(!players[socket.id]) return;

players[socket.id].x = data.x;
players[socket.id].y = data.y;
});

socket.on("shoot",(data)=>{

for(let id in players){
if(id === socket.id) continue;

let p = players[id];

let dx = p.x - data.x;
let dy = p.y - data.y;

let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 40){
p.hp -= 25;

if(p.hp <= 0){
p.hp = 100;
p.x = 200;
p.y = 200;

players[socket.id].kills++;
}
}
}

io.emit("players",players);
});

socket.on("disconnect",()=>{
delete players[socket.id];
});

setInterval(()=>{
io.emit("players",players);
},50);

});

http.listen(3000,()=>{
console.log("2D MIASTO działa");
});
