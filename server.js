const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();
mongoose.connect(
  "mongodb+srv://admin:sLNq6URF2KDxvDlh@cluster0.5cdft.mongodb.net/urls"
);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (request, response) => {
  const shortUrls = await ShortUrl.find();
  response.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (request, response) => {
  await ShortUrl.create({ full: request.body.fullUrl });
  response.redirect("/");
});

app.get("/:shortUrl", async (request, response) => {
  const shortUrl = await ShortUrl.findOne({ short: request.params.shortUrl });
  if (shortUrl == null) return response.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  response.redirect(shortUrl.full);
});

app.listen(process.env.port || 3000);
