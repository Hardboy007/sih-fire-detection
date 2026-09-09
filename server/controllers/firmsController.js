const axios = require("axios");
const parseCSV = require("../utils/csvParser");

const getHotspots = async (req, res) => {
  try {
    const apiKey = process.env.FIRMS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "FIRMS API key is missing",
      });
    }

    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/MODIS_NRT/world/2`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/csv,text/plain,*/*",
      },
    });

    const hotspots = parseCSV(response.data);
    // India ke hotspots filter karo
    const indiaHotspots = hotspots.filter((h) => {
      const lat = parseFloat(h.latitude);
      const lng = parseFloat(h.longitude);
      return lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97;
    });
    // Top 20 hotspots ke liye city name fetch karo
    const top20 = indiaHotspots.slice(0, 20);

    const withCities = await Promise.all(
      top20.map(async (h) => {
        try {
          const geoRes = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${h.latitude}&longitude=${h.longitude}&localityLanguage=en`,
          );
          const geo = geoRes.data;
          h.city =
            geo.city || geo.locality || geo.principalSubdivision || "Unknown";
          h.country = geo.countryName || "";
        } catch {
          h.city = "Unknown";
          h.country = "";
        }
        return h;
      }),
    );

    res.json({
      success: true,
      count: withCities.length,
      data: withCities,
    });
  } catch (error) {
    console.error("FIRMS API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FIRMS hotspot data",
    });
  }
};

module.exports = {
  getHotspots,
};
