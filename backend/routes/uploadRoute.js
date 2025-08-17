const express = require("express");
const { createImageUpload } = require("../controllers/uploadController");

const router = express.Router();

router.get("/", createImageUpload);

module.exports = router;
