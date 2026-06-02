const express = require("express");
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    console.log("Nowy gracz:", socket.id);

    players[socket.id] = {
        x: 2500,
        y: 2500,
        team: "red"
    };

    io.emit("players", players);

    socket.on("move", (data) => {

        if(players[socket.id]){

            players[socket.id].x = data.x;
            players[socket.id].y = data.y;

        }

        io.emit("players", players);

    });

    socket.on("disconnect", () => {

        delete players[socket.id];

        io.emit("players", players);

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log("Serwer działa na porcie", PORT);

});
