const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    },
    {
        timestamps: true,
    }
);

const Messages = model("Messages", messageSchema);

module.exports = Messages;
