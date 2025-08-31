const express = require("express");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db.js");
const { Server } = require("socket.io");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();

app.use(express.json());
const cors = require("cors");

app.use(cors());

dotenv.config();
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));
const io = new Server(server, {
    path: "/socket.io",
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("connected to the frontend");

    socket.on("setup", (userData) => {
        socket.userId = userData._id;
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
        socket.leave(socket.userId);
    });
});

// Deploment code start

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(
        express.static(path.join(__dirname1, "frontend/dist"), {
            index: false,
            redirect: false,
        })
    );

    app.get(/^\/(?!api|socket\.io).*/, (req, res) => {
        res.sendFile(path.join(__dirname1, "frontend/dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running");
    });
}

// Deployment code end

app.use(notFound);
app.use(errorHandler);
