const express = require("express");
const app = express();
const cors = require("cors"); // ✅ added — needed so the frontend can call this API
require("dotenv").config();
const url = require("./models/urlSchema");

const port = process.env.PORT || 4000;

app.use(cors()); // ✅ added — must be before routes
app.use(express.json());

const dbConnect = require("./config/database");
dbConnect();

const urlRoute = require("./routes/urlRoutes");
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await url.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
  );

  if (!entry) {
    return res.status(404).send("Short link not found");
  }

  res.redirect(entry.redirectUrl);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});