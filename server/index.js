const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const hotspotRoutes = require("./routes/hotspots");

app.use("/api/hotspots", hotspotRoutes);

const industrialZoneRoutes = require("./routes/industrialZones");
app.use("/api/industrial-zones", industrialZoneRoutes);

app.get("/", (req, res) => {
    res.send("Fire Detection Server is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});