var express = require('express');
var router = express.Router();

const app = express();
const server = require("http").Server(app);
const {
    v4: uuidv4
} = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const {
    ExpressPeerServer
} = require("peer");

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect(`/rooms/${uuidv4()}`);
});

router.get("/:room", function (req, res, next) {
    res.render("room", {
        roomId: req.params.room
    });
});

module.exports = router;