const asyncHandler = require("express-async-handler");
const generateSignature = require("../config/generateSignature");

const createImageUpload = asyncHandler(async () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp);
    return { timestamp, signature };
});

module.exports = { createImageUpload };
