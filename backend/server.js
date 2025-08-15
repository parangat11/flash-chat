const express = require("express");
const { chats } = require("./data/data.js");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.get("/api/chat", (req, res) => {
    console.log(chats);
    console.log("reached chat endpoint");
    res.send(chats);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
