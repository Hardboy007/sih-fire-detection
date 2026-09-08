const axios = require("axios");
const parseCSV = require("../utils/csvParser");

const getHotspots = async (req, res) => {
    try {
        const apiKey = process.env.FIRMS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "FIRMS API key is missing"
            });
        }

        const url =
            `https://firms.modaps.eosdis.nasa.gov/api/area/csv/` +
            `${apiKey}/MODIS_NRT/world/1`;

        const response = await axios.get(url);

        const hotspots = parseCSV(response.data);

        res.json({
            success: true,
            count: hotspots.length,
            data: hotspots
        });

    } catch (error) {
        console.error("FIRMS API Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch FIRMS hotspot data"
        });
    }
};

module.exports = {
    getHotspots
};