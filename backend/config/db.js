const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const { connect } = mongoose;

const connectDB = asyncHandler(async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        console.log(`MongoDB connected ${conn.connection.host}`);
    } catch (error) {
        throw new Error("Couldn't connect to the DB");
    }
});

module.exports = connectDB;
