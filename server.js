const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    players[socket.id] = {
        x: 100,
        y: 100,
        team: "red"
    };

    socket.emit("init", players);

    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
        }

        io.emit("players", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });

});

server.listen(process.env.PORT || 3000);
