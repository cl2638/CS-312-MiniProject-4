
// setting up tools and helpers needed for server and uv data fetching
const express = require("express");
const path = require("path");
const getUVData = require("./utils/weatherData");

// initializing express app and deciding what port it will listen on
const app = express();
const port = process.env.PORT || 4000;

// serve React static files after build
const clientBuildPath = path.join(__dirname, "..", "build");
app.use(express.static(clientBuildPath));

// API route calling UV weather data
app.get("/api/weather", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Please enter latitude and longitude." });
  }

  try {
    const data = await getUVData(lat, lng);
    const uv = data.result.uv_max;

    // current local time at the server
    const nowLocalTime = new Date().toLocaleString("en-US", { timeZoneName: "short" });

    let message;
    if (uv >= 6) message = "Yes! Wear sunscreen. UV is high.";
    else if (uv >= 3) message = "Yes, it's a good idea. UV is moderate.";
    else message = "Probably not needed. UV is low.";

    res.json({ 
      lat, 
      lng, 
      uv, 
      currentLocalTime: nowLocalTime, // current time now
      message,
      note: "UV index shown is the maximum expected for the day."
    });
  } catch (err) {
    console.error("UV fetch error:", err.message);
    res.status(500).json({ error: "Error fetching UV data." });
  }
});

// serve React app fallback
app.get("*", (req, res) => {
  const indexPath = path.join(clientBuildPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send("React build not found. Run: npm run build");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
