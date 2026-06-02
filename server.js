const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

players[socket.id] = { x: 100, y: 100 };

socket.emit("init", players);

socket.on("move", (data) => {
players[socket.id] = data;
io.emit("players", players);
});

socket.on("disconnect", () => {
delete players[socket.id];
});

});

http.listen(process.env.PORT || 3000);
