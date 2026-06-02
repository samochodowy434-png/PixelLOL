const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

players[socket.id] = {
x: 0,
y: 2,
z: 0,
rotY: 0
};

socket.on("move", (data) => {
if (!players[socket.id]) return;

players[socket.id].x = data.x;
players[socket.id].y = data.y;
players[socket.id].z = data.z;
players[socket.id].rotY = data.rotY;
});

setInterval(() => {
io.emit("players", players);
}, 50);

socket.on("disconnect", () => {
delete players[socket.id];
});

});

http.listen(3000, () => {
console.log("Server działa na 3000");
});
