import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./RatingsSummary.css";

export default function RatingsSummary({ reviews = [] }) {
  if (!reviews.length) return <p>No reviews yet.</p>;

  // star breakdown / sentiment
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const sentimentCount = { Positive: 0, Neutral: 0, Negative: 0 };
  let total = 0;
  let sum = 0;

  // keyword map (from r.keywords OR extracted)
  const keywordMap = {};
  const STOP = new Set([
    "the","and","for","that","with","this","have","has","are","was","were","you",
    "your","our","from","they","them","their","about","into","over","under",
    "a","an","of","on","in","to","it","is","as","at","by","be","or","not","but",
    "very","really","just","than","then","too","also","can","could","would",
    "will","i","we","he","she","my","me","us","so"
  ]);

  const addKeyword = (w) => {
    if (!w) return;
    const word = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (word.length < 3 || STOP.has(word)) return;
    keywordMap[word] = (keywordMap[word] || 0) + 1;
  };

  reviews.forEach((r) => {
    const stars = Math.round(Number(r.rating) || 0);
    breakdown[stars] = (breakdown[stars] || 0) + 1;

    const s = r.sentiment || "Neutral";
    sentimentCount[s] = (sentimentCount[s] || 0) + 1;

    total += 1;
    sum += Number(r.rating) || 0;

    if (Array.isArray(r.keywords) && r.keywords.length) {
      r.keywords.forEach(addKeyword);
    } else if (typeof r.description === "string") {
      r.description.split(/\s+/).forEach(addKeyword);
    }
  });

  const average = total ? sum / total : 0;
  const maxCount = Math.max(...Object.values(breakdown));
  const pieData = Object.keys(sentimentCount).map((k) => ({
    name: k,
    value: sentimentCount[k],
  }));
  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  // top keywords (fallback to at least some tags)
  let topKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  if (!topKeywords.length) {
    topKeywords = [
      ["service", 1],
      ["quality", 1],
      ["value", 1],
      ["support", 1],
    ];
  }

  // sentiment percentages
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const posPct = pct(sentimentCount.Positive);
  const neuPct = pct(sentimentCount.Neutral);
  const negPct = pct(sentimentCount.Negative);

  // recent comments (latest two)
  const recent = [...reviews]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 2)
    .map((r) => ({
      name: r.name || "Anonymous",
      txt:
        typeof r.description === "string"
          ? r.description.length > 120
            ? r.description.slice(0, 117) + "..."
            : r.description
          : "",
    }));

  return (
    <div className="ratings-container">
      {/* LEFT column: bars + gap fillers */}
      <div className="left-col">
        <div className="breakdown">
          {Object.entries(breakdown)
            .reverse()
            .map(([stars, count]) => (
              <div key={stars} className="rating-row">
                <span>{stars} ★</span>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: maxCount ? `${(count / maxCount) * 100}%` : "0%" }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
        </div>

        {/* Fills the space under the bars */}
        <div className="left-panels">
          <div className="highlights-box">
            <div className="highlights-header">
              <h4>Highlights</h4>
              <span className="chip chip-primary">Top mentions</span>
            </div>
            <div className="keyword-tags">
              {topKeywords.map(([k, count]) => (
                <span key={k} className="tag">
                  {k} <b>×{count}</b>
                </span>
              ))}
            </div>
          </div>

          {recent.length > 0 && (
            <div className="recent-box">
              <h4>Recent comments</h4>
              <ul className="recent-list">
                {recent.map((r, i) => (
                  <li key={i}>
                    <span className="recent-name">{r.name}:</span>{" "}
                    <span className="recent-text">{r.txt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT column: average + chips + pie */}
      <div className="average-box">
        <div className="avg-rating">{average.toFixed(1)}</div>
        <div className="stars">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < Math.round(average) ? "filled" : ""}>
              ★
            </span>
          ))}
        </div>
        <p className="muted">{total} Ratings</p>

        <div className="sentiment-chips">
          <span className="chip chip-pos">{posPct}% Positive</span>
          <span className="chip chip-neu">{neuPct}% Neutral</span>
          <span className="chip chip-neg">{negPct}% Negative</span>
        </div>

        <h4>Sentiment Overview</h4>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}



