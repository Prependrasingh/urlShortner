const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const {HandleGenerateNewShortUrl} = require("../controllers/urlControllers");

router.post("/" , HandleGenerateNewShortUrl);



module.exports = router;