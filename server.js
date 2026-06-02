const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    players[socket.id] = {
        x: 100,
        y: 100,
        hp: 100,
        team: Math.random() > 0.5 ? "red" : "blue"
    };

    socket.emit("init", players);

    socket.on("move", (data) => {
        if(players[socket.id]){
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
        }
        io.emit("players", players);
    });

    socket.on("shoot", (data) => {

        for(let id in players){

            if(id === socket.id) continue;

            let p = players[id];

            let dx = p.x - data.x;
            let dy = p.y - data.y;

            let dist = Math.sqrt(dx*dx + dy*dy);

            if(dist < 50){
                p.hp -= 20;
            }

            if(p.hp <= 0){
                p.hp = 100;
                p.x = 100;
                p.y = 100;
            }
        }

        io.emit("players", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });

});

http.listen(process.env.PORT || 3000);
