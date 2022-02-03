const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");
const messageRoutes = require("./routes/message.route");
const { notFound, errorHandler } = require("./middleware/error.middleware");
dotenv.config();

const app = express();
connectDB();

app.use(express.json());

// ------------- Deployment Code -------------------

const pwd = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(pwd, "/frontend/build")));
} else {
  app.get("/", (req, res) => {
    res.send("Api is running sucessfully");
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(pwd, "frontend", "build", "index.html"));
  });
}

// ------------- Deployment Code -------------------

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log("Server is listening on port 5000".rainbow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("User joined room", room);
  });

  socket.on("newMessage", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.user not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("messageReceived", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
