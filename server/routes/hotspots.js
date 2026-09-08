const express = require("express");

const router = express.Router();

const { getHotspots } = require("../controllers/firmsController");

router.get("/", getHotspots);

module.exports = router;