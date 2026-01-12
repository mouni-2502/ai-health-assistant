// src/components/common/ProgressIndicator.jsx
import React from "react";

const ProgressIndicator = ({ currentStep }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
      padding: "25px",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      backdropFilter: "blur(10px)",
    }}
  >
    {[1, 2, 3, 4].map((step) => (
      <React.Fragment key={step}>
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: currentStep >= step ? "#667eea" : "#e2e8f0",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "20px",
            transition: "all 0.3s ease",
            transform: currentStep >= step ? "scale(1.1)" : "scale(1)",
            boxShadow:
              currentStep >= step
                ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                : "none",
          }}
        >
          {step === 1 && "📍"}
          {step === 2 && "📝"}
          {step === 3 && "🔍"}
          {step === 4 && "🏥"}
        </div>
        {step < 4 && (
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: currentStep > step ? "#667eea" : "#e2e8f0",
              margin: "0 15px",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default ProgressIndicator;
