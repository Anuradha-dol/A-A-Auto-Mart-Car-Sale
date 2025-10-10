// server/routes/analyze.js
const express = require("express");
const router = express.Router();
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

router.post("/", (req, res) => {
  const { text } = req.body;
  const s = sentiment.analyze(text);
  // simple keyword pick: top 5 frequent words excluding stopwords
  const keywords = Object.entries(s.words.reduce((a, w) => {
    a[w] = (a[w] || 0) + 1; return a;
  }, {}))
    .sort((a,b) => b[1]-a[1])
    .slice(0,5)
    .map(([k]) => k);

  res.json({
    sentiment: s.score > 0 ? "Positive" : s.score < 0 ? "Negative" : "Neutral",
    keywords,
  });
});

module.exports = router;
