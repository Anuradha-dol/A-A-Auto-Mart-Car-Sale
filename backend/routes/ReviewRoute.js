// Backend/Route/ReviewRoute.js
const express = require("express");
const router = express.Router();
const Review = require("../Model/ReviewModel");

// ---------- helpers ----------
function bad(res, code, message) {
  return res.status(code).json({ message });
}

function validateBody(body) {
  const errors = {};
  const { name, gmail, description, rating } = body;

  if (!name || !String(name).trim()) errors.name = "Name is required";
  if (!gmail || !String(gmail).trim()) errors.gmail = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(gmail)))
    errors.gmail = "Invalid email";

  if (!description || !String(description).trim())
    errors.description = "Description is required";
  if (rating === undefined || rating === null || rating === "")
    errors.rating = "Rating is required";
  else if (Number(rating) < 0 || Number(rating) > 5)
    errors.rating = "Rating must be 0–5";

  return errors;
}

// ---------- LIST all (with optional search/filter) ----------
router.get("/", async (req, res) => {
  try {
    const { q, sentiment } = req.query;
    const filter = {};

    if (q && String(q).trim()) {
      const rx = new RegExp(String(q).trim(), "i");
      filter.$or = [{ name: rx }, { gmail: rx }, { description: rx }];
    }
    if (sentiment && String(sentiment).trim()) {
      filter.sentiment = String(sentiment).trim();
    }

    const Reviews = await Review.find(filter).sort({ createdAt: -1 });
    // keep capital R to match your frontend
    return res.status(200).json({ Reviews });
  } catch (err) {
    console.error("getAllReviews error:", err);
    return bad(res, 500, "Server error");
  }
});

// ---------- CREATE ----------
router.post("/", async (req, res) => {
  try {
    const { name, gmail, description, rating, sentiment, keywords } = req.body;

    const errors = validateBody({ name, gmail, description, rating });
    if (Object.keys(errors).length) return bad(res, 400, errors);

    const review = await Review.create({
      name: String(name).trim(),
      gmail: String(gmail).toLowerCase().trim(),
      description: String(description).trim(),
      rating: Number(rating),
      // optional fields (ignore if your model doesn't have them)
      ...(sentiment ? { sentiment } : {}),
      ...(Array.isArray(keywords) ? { keywords } : {}),
    });

    // Return the document directly to match your UI: setReviews([res.data, ...])
    return res.status(200).json(review);
  } catch (err) {
    console.error("addReviews error:", err);
    return bad(res, 500, "unable to add reviews");
  }
});

// ---------- READ one by id ----------
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return bad(res, 404, "unable to find reviews");
    return res.status(200).json({ review });
  } catch (err) {
    console.error("getById error:", err);
    return bad(res, 500, "Server error");
  }
});

// ---------- UPDATE ----------
router.put("/:id", async (req, res) => {
  try {
    const { name, gmail, description, rating, sentiment, keywords } = req.body;

    const errors = validateBody({ name, gmail, description, rating });
    if (Object.keys(errors).length) return bad(res, 400, errors);

    const update = {
      name: String(name).trim(),
      gmail: String(gmail).toLowerCase().trim(),
      description: String(description).trim(),
      rating: Number(rating),
    };

    if (sentiment !== undefined) update.sentiment = sentiment;
    if (keywords !== undefined) update.keywords = keywords;

    const review = await Review.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!review) return bad(res, 404, "unable to update reviews");
    return res.status(200).json({ review });
  } catch (err) {
    console.error("updateReview error:", err);
    return bad(res, 500, "Server error");
  }
});

// ---------- DELETE ----------
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return bad(res, 404, "unable to delete reviews");
    return res.status(200).json({ review });
  } catch (err) {
    console.error("deleteReview error:", err);
    return bad(res, 500, "Server error");
  }
});

module.exports = router;

