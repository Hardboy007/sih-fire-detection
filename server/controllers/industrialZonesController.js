const axios = require("axios");

const getIndustrialZones = async (req, res) => {
  try {
    const query = `[out:json][timeout:25];area["name"="India"]["admin_level"="2"]->.searchArea;(way["landuse"="industrial"](area.searchArea);relation["landuse"="industrial"](area.searchArea););out geom qt 50;`;

    const response = await axios.get(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getIndustrialZones };