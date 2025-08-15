const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            required: true,
            default: "https://shorturl.at/k7XmD",
        },
    },
    {
        timestamps: true,
    }
);

const User = model("Messages", userSchema);

module.exports = User;
