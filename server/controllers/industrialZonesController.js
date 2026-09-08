const axios = require("axios");

const getIndustrialZones = async (req, res) => {
  try {
    const query = `
      [out:json][timeout:25];
      area["name"="India"]->.searchArea;
      (
        way["landuse"="industrial"](area.searchArea);
        relation["landuse"="industrial"](area.searchArea);
      );
      out geom;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getIndustrialZones };