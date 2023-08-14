const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const findKey = require("./helpers/findKeyInMap");
const authorizationAPI = require("./middlewares/authorization");
const dialogsAPI = require("./controllers/dialogControllers");

require("dotenv").config();

const usersRouter = require("./routes/users");
const dialogsRouter = require("./routes/dialogs");
const Dialog = require("./models/dialog-model");

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

app.use("/users", usersRouter);
app.use("/dialogs", dialogsRouter);

app.use((error, req, res) => {
  res.status(error.status).res({ message: error.message });
});

// SOCKET

io.use(authorizationAPI.authorizeSocket); /// fires during connection and all events

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`SOCKET ID: ${socket.id}`);
  const userName = socket.handshake.auth.userName;
  global.socket = socket;
  onlineUsers.set(userName, socket.id);

  socket.on("disconnect", () => {
    onlineUsers.delete(findKey(onlineUsers, socket.id));
    console.log(onlineUsers);
  });

  socket.on("createDialog", async (data) => {
    const { colocutorId, colocutorName } = data;
    const { id, name } = socket.user;
    const dialog = await dialogsAPI.addDialog(id, colocutorId);

    if (dialog) {
      [name, colocutorName].forEach((part) => {
        io.to(onlineUsers.get(part)).emit("UpdateDialogs", {
          dialog,
        });
      });
    }
  });

  socket.on("acceptInvite", async (data) => {
    try {
      const { id, name } = socket.user;
      const dialog = await dialogsAPI.acceptInvite(data.dialogId, id);
      const parts = [
        dialog.participants[0]["name"],
        dialog.participants[1]["name"],
      ];

      parts.forEach((part) => {
        io.to(onlineUsers.get(part)).emit("InviteAccepted", {
          dialogId: dialog.id,
          acceptedBy: id,
        });
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("addMessage", async (data) => {
    const result = await dialogsAPI.addMessage(data)
    if (result) {
      const {data, colocutorName} = result

      io.to(onlineUsers.get(colocutorName)).emit('MessageAdded', data)
      // parts.forEach(part => {
      //   io.to(onlineUsers.get(part)).emit('Message added', data)
      // })
    }

  });

  console.log(onlineUsers);
  //  io.emit('notify', {users: onlineUsers})'
});

module.exports = server;
