const cloudinary = require("cloudinary").v2;

const generateSignature = async (timestamp) =>
    await cloudinary.utils.api_sign_request(
        {
            timestamp,
        },
        process.env.CLOUDINARY_SECRET
    );

module.exports = { generateSignature };
