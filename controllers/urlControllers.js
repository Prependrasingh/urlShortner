const shortid = require("shortid");
const URL = require("../models/urlSchema");

async function HandleGenerateNewShortUrl(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({
        success: false,
        message: "No URL provided",
      });
    }

    const shortId = shortid.generate();

    console.log("Generated shortId:", shortId);
    await URL.create({
      shortId: shortId,
      redirectUrl: body.url,
      visitHistory: [],
    });

    return res.status(201).json({
      success: true,
      message: "URL generated successfully",
      id: shortId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  HandleGenerateNewShortUrl,
};
