import { useEffect, useState } from "react";
import axios from "axios";
import "./Review.css";
import RatingSummary from "../components/RatingsSummary";
import CustomerFeedback from "../components/CustomerFeedback";

export default function Reviews() {
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    description: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");

  // ---------- Fetch reviews ----------
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/reviews")
      .then((res) => setReviews(res.data.Reviews || []))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  // ---------- Form helpers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const e = {};

    // --- Name ---
    if (!form.name.trim()) e.name = "Name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(form.name))
      e.name = "Name can contain letters and spaces only.";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";

    // --- Email ---
    if (!form.gmail.trim()) e.gmail = "Email is required.";
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.gmail) ||
      !/\.(com|net)$/i.test(form.gmail)
    )
      e.gmail = "Enter a valid .com or .net email.";

    // --- Description ---
    if (!form.description.trim()) e.description = "Review is required.";
    else if (form.description.trim().length < 20)
      e.description = "Review must be at least 20 characters long.";
    else {
      // Check for a single word repeated more than 3 times
      const words = form.description.toLowerCase().split(/\s+/);
      const counts = {};
      for (const w of words) counts[w] = (counts[w] || 0) + 1;
      if (Object.values(counts).some((c) => c > 3))
        e.description = "Avoid repeating the same word too many times.";
    }

    // --- Rating ---
    if (form.rating === "") e.rating = "Rating required.";
    else if (!Number.isInteger(Number(form.rating)))
      e.rating = "Rating must be a whole number.";
    else if (Number(form.rating) < 0 || Number(form.rating) > 5)
      e.rating = "Rating must be between 0 and 5.";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateForm();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      // Optional: backend sentiment/keyword analysis
      const analysis = await axios.post("http://localhost:3000/api/analyze", {
        text: form.description,
      });

      const res = await axios.post("http://localhost:3000/api/reviews", {
        ...form,
        rating: Number(form.rating),
        sentiment: analysis.data.sentiment,
        keywords: analysis.data.keywords,
      });

      alert("Review submitted!");
      setReviews([res.data, ...reviews]);
      setForm({ name: "", gmail: "", description: "", rating: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  // ---------- Filter reviews ----------
  const filtered =
    filter === "All" ? reviews : reviews.filter((r) => r.sentiment === filter);

  return (
    <div className="review-page">
      {/* LEFT: analytics + scrollable feedback list */}
      <div className="review-content">
        <RatingSummary reviews={reviews} />

        <div className="sentiment-filter">
          <label>Filter by Sentiment: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>
        </div>

        <div className="reviews-list">
          <CustomerFeedback feedbacks={filtered} />
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="review-form">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <input
            name="gmail"
            placeholder="Your Email"
            value={form.gmail}
            onChange={handleChange}
          />
          {errors.gmail && <span className="error">{errors.gmail}</span>}

          <textarea
            name="description"
            placeholder="Write your review"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            placeholder="Rating (0-5)"
            value={form.rating}
            onChange={handleChange}
          />
          {errors.rating && <span className="error">{errors.rating}</span>}

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}
