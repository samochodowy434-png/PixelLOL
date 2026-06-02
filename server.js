const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static("public"));

let players = {};
let bullets = [];

io.on("connection", (socket) => {

    players[socket.id] = {
        x: 200,
        y: 200,
        hp: 100,
        team: Math.random() > 0.5 ? "red" : "blue"
    };

    socket.emit("init", { players, id: socket.id });

    socket.on("move", (data) => {
        if(players[socket.id]){
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
        }
    });

    socket.on("shoot", (data) => {

        bullets.push({
            x: data.x,
            y: data.y,
            dx: data.dx,
            dy: data.dy,
            owner: socket.id
        });

    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });

});

// 🔥 game loop serwera
setInterval(()=>{

    // bullet movement
    for(let i = bullets.length - 1; i >= 0; i--){

        let b = bullets[i];
        b.x += b.dx;
        b.y += b.dy;

        for(let id in players){

            if(id === b.owner) continue;

            let p = players[id];

            let dx = p.x - b.x;
            let dy = p.y - b.y;

            if(Math.sqrt(dx*dx + dy*dy) < 15){
                p.hp -= 25;
                bullets.splice(i,1);

                if(p.hp <= 0){
                    p.hp = 100;
                    p.x = 200;
                    p.y = 200;
                }
                break;
            }
        }
    }

    io.emit("state", {players, bullets});

}, 1000/30);

http.listen(process.env.PORT || 3000);
