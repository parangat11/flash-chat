const express = require("express");
const { chats } = require("./data/data.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
dotenv.config();

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
