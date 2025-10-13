import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerFeedback.css";

export default function CustomerFeedback({ feedbacks = [] }) {
  const [analysis, setAnalysis] = useState({}); // { reviewId: { sentiment, keywords } }

  // Whenever feedbacks change, analyze them
  useEffect(() => {
    const runAnalysis = async () => {
      const results = {};
      for (const f of feedbacks) {
        try {
          const res = await axios.post("http://localhost:3000/api/analyze", {
            text: f.description,
          });
          results[f._id] = res.data; // {sentiment, keywords}
        } catch (err) {
          console.error("Analysis failed for", f._id, err);
        }
      }
      setAnalysis(results);
    };
    if (feedbacks.length) runAnalysis();
  }, [feedbacks]);

  return (
    <>
      {feedbacks.map((f) => {
        const a = analysis[f._id];
        return (
          <div key={f._id} className="feedback-card">
            <img
              src={`https://i.pravatar.cc/100?u=${encodeURIComponent(f.name)}`}
              alt={f.name}
              className="feedback-avatar"
            />
            <div className="feedback-body">
              <p className="feedback-name">{f.name}</p>
              <p className="feedback-comment">{f.description}</p>
              <p className="feedback-rating">
                {"★".repeat(Number(f.rating))}
                {"☆".repeat(5 - Number(f.rating))}
              </p>

              {/* === NEW INNOVATIVE SECTION === */}
              {a && (
                <div className="feedback-analysis">
                  <p className={`sentiment ${a.sentiment.toLowerCase()}`}>
                    Sentiment: {a.sentiment}
                  </p>
                  {a.keywords?.length > 0 && (
                    <p className="keywords">
                      Keywords: {a.keywords.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

