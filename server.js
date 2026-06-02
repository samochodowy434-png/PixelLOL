const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};
let cars = [
  {id:"c1", x:400, y:300, color:"red", driver:null},
  {id:"c2", x:700, y:500, color:"yellow", driver:null}
];

io.on("connection",(socket)=>{

players[socket.id] = {
x:200,
y:200,
hp:100,
weapon:"pistol",
inCar:null
};

socket.emit("init", socket.id);

socket.on("move",(data)=>{
if(!players[socket.id]) return;
if(players[socket.id].inCar) return;

players[socket.id].x = data.x;
players[socket.id].y = data.y;
});

socket.on("shoot",(data)=>{

let shooter = players[socket.id];
if(!shooter) return;

for(let id in players){
if(id === socket.id) continue;

let p = players[id];

let dx = p.x - data.x;
let dy = p.y - data.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < data.range){
p.hp -= data.damage;

if(p.hp <= 0){
p.hp = 100;
p.x = 200;
p.y = 200;
}
}
}

io.emit("players",players);
});

socket.on("enterCar",(carId)=>{

let p = players[socket.id];
let car = cars.find(c=>c.id===carId);

if(!p || !car) return;

if(p.inCar === carId){
p.inCar = null;
car.driver = null;
}else{
p.inCar = carId;
car.driver = socket.id;
}

io.emit("cars",cars);
});

socket.on("disconnect",()=>{
delete players[socket.id];
});

});

http.listen(process.env.PORT || 3000);
