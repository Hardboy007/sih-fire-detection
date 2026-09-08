const express = require("express");
const router = express.Router();
const { getIndustrialZones } = require("../controllers/industrialZonesController");

router.get("/", getIndustrialZones);

module.exports = router;