import React from "react";
import "./app.css";

function Background() {
  return (
    <div className="co2-background">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="co2-bubble"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 12}s`,
          }}
        >
          <span className="co2-label">CO₂</span>
        </div>
      ))}
    </div>
  );
}

export default Background;
