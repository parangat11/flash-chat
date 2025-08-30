const express = require("express");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

const allowedOrigins = [
    "http://localhost:5173",
    "https://flash-chat-app-rdan.onrender.com/",
];

const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
    cors({
        origin: allowedOrigins,
    })
);

dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("connected to the frontend");

    socket.on("setup", (userData) => {
        socket.join(userData._id); // Room for a particular user, with his ID - to be used for notify
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room " + room);
    });

    socket.on("new message", (newMessage) => {
        let chat = newMessage.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if (user._id === newMessage.sender._id) {
                return;
            }
            socket.in(user._id).emit("message received", newMessage);
        });
    });

    socket.on("typing", ({ room, userId }) => {
        if (!room || !userId) return;
        socket.to(room).emit("typing", { userId, chatId: room });
    });

    socket.on("stop typing", ({ room, userId }) => {
        if (!room || !userId) return;
        socket.to(room).emit("stop typing", { userId, chatId: room });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
