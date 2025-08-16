const mongoose = require("mongoose");

const { connect } = mongoose;

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        });
        console.log(`MongoDB connected ${conn.connection.host}`);
    } catch (error) {}
};

module.exports = connectDB;
