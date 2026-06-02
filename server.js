const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    players[socket.id] = {
        x: 400 + Math.random() * 400,
        y: 300 + Math.random() * 300,
        hp: 100,
        team: Math.random() > 0.5 ? "red" : "blue"
    };

    io.emit("players", players);

    socket.on("move", (data) => {
        if (!players[socket.id]) return;

        players[socket.id].x = data.x;
        players[socket.id].y = data.y;

        io.emit("players", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("players", players);
    });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("FPS SERVER ON"));
