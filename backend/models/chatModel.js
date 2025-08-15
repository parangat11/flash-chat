const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: "Messages",
        },
        groupAdmin: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Chat = model("Chat", chatSchema);

module.exports = Chat;
