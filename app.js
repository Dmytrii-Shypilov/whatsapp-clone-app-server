const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const usersRouter = require("./routes/users");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ name: "Dima" });
// });

app.use("/users", usersRouter);


app.use((error, req, res)=> {
  res.status(error.status).res({message: error.message})
})

// SOCKET

global.onlineUsers = new Object()

io.on("connection", (socket) => {
//   console.log("I'm connected");
//   console.log(socket.id);
  global.socket = socket 
  socket.on("add-user", ({ id }) => {
   onlineUsers[socket.id] = id
   console.log(onlineUsers)
   io.emit('notify', {users: onlineUsers})
  });
 
});



module.exports = server;
