// src/components/hospitals/RadiusSlider.jsx
import React from "react";

const RadiusSlider = ({ radius, onRadiusChange }) => {
  const handleSliderChange = (e) => {
    onRadiusChange(parseInt(e.target.value));
  };

  return (
    <div
      style={{
        marginBottom: "25px",
        background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        border: "2px solid #e2e8f0",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "15px",
          fontWeight: "700",
          color: "#4a5568",
          fontSize: "16px",
        }}
      >
        🎯 Search Radius: {radius} km
      </label>

      <div style={{ position: "relative", margin: "0 10px" }}>
        {/* Slider track background */}
        <div
          style={{
            height: "8px",
            background:
              "linear-gradient(90deg, #48bb78 0%, #ed8936 50%, #e53e3e 100%)",
            borderRadius: "4px",
            position: "relative",
            marginBottom: "20px",
          }}
        >
          {/* Slider thumb track */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              background: "rgba(255,255,255,0.3)",
              borderRadius: "4px",
            }}
          />
        </div>

        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={radius}
          onChange={handleSliderChange}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            background: "transparent",
            outline: "none",
            position: "absolute",
            top: "0",
            left: "0",
            cursor: "pointer",
            zIndex: 2,
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />

        {/* Custom slider styles */}
        <style>
          {`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: all 0.3s ease;
            }
            
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: all 0.3s ease;
            }
            
            input[type="range"]::-moz-range-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
            }
          `}
        </style>
      </div>

      {/* Radius markers */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
          fontSize: "12px",
          color: "#718096",
          fontWeight: "600",
        }}
      >
        <span>5km</span>
        <span>15km</span>
        <span>30km</span>
      </div>

      {/* Radius description */}
      <div
        style={{
          marginTop: "12px",
          padding: "10px",
          background: "rgba(102, 126, 234, 0.1)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#4c51bf",
          textAlign: "center",
        }}
      >
        {radius <= 10 &&
          "🚗 Nearby hospitals within walking/short drive distance"}
        {radius > 10 &&
          radius <= 20 &&
          "🚙 Moderate distance - quick drive to hospital"}
        {radius > 20 && "🛣️ Extended search area - includes distant hospitals"}
      </div>
    </div>
  );
};

export default RadiusSlider;
