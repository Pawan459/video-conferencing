const express = require("express");
const { v1: uuidV1 } = require("uuid");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const roomHandler = require("./Room");

const PORT = 3000 || process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV1()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening At PORT ${PORT}`);
});
