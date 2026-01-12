// src/components/symptoms/SymptomsInput.jsx
import React from "react";

const SymptomsInput = ({ symptoms, onSymptomsChange }) => {
  const wordCount = symptoms
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div
      className="fade-in-up"
      style={{
        marginBottom: "30px",
        height: "100%",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(5px)",
        padding: "30px",
        borderRadius: "25px",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "20px",
          fontWeight: "700",
          color: "white",
          fontSize: "20px",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "#2d3748",
          backgroundClip: "text",
        }}
      >
      </label>
      <div style={{ position: "relative" }}>
        <textarea
          placeholder="Describe your symptoms in detail... (e.g., headache since morning, fever 102°F, fatigue, nausea, etc.)"
          value={symptoms}
          onChange={onSymptomsChange}
          className="glow-effect"
          style={{
            width: "100%",
            height: "200px",
            padding: "25px",
            fontSize: "16px",
            borderRadius: "20px",
            border: "2px solid rgba(255,255,255,0.3)",
            resize: "vertical",
            outline: "none",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(5px)",
            boxShadow:
              "inset 0 2px 5px rgba(0,0,0,0.1), 0 4px 10px rgba(255,255,255,0.1)",
            fontFamily: "inherit",
            lineHeight: "1.6",
            color: "#2d3748",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#667eea";
            e.target.style.background = "rgba(255,255,255,0.95)";
            e.target.style.boxShadow =
              "inset 0 2px 10px rgba(0,0,0,0.1), 0 8px 25px rgba(102,126,234,0.2)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
            e.target.style.background = "rgba(255,255,255,0.9)";
            e.target.style.boxShadow =
              "inset 0 2px 10px rgba(0,0,0,0.1), 0 4px 20px rgba(255,255,255,0.1)";
            e.target.style.transform = "translateY(0)";
          }}
        />

        {/* Enhanced word count and helpful tips */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <div>
            {symptoms.trim() && (
              <span
                style={{
                  color: wordCount >= 10 ? "#48bb78" : "#f6ad55",
                  fontWeight: "700",
                  background:
                    wordCount >= 10
                      ? "rgba(72,187,120,0.2)"
                      : "rgba(246,173,85,0.2)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: `1px solid ${
                    wordCount >= 10 ? "#48bb78" : "#f6ad55"
                  }`,
                  backdropFilter: "blur(5px)",
                }}
              >
                {wordCount} words{" "}
                {wordCount < 10 && "(add more details for better analysis)"}
              </span>
            )}
          </div>
          <div
            style={{
              textAlign: "right",
              background: "rgba(255,255,255,0.1)",
              padding: "6px 15px",
              borderRadius: "15px",
              color: "black",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            💡 Include: duration, severity, triggers, location
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsInput;
