// src/components/common/StepLabels.jsx
import React from "react";

const StepLabels = ({ currentStep }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "40px",
      gap: "100px",
      fontSize: "14px",
      fontWeight: "600",
    }}
  >
    <span style={{ color: currentStep >= 1 ? "#667eea" : "#a0aec0" }}>
      Location
    </span>
    <span style={{ color: currentStep >= 2 ? "#667eea" : "#a0aec0" }}>
      Symptoms
    </span>
    <span style={{ color: currentStep >= 3 ? "#667eea" : "#a0aec0" }}>
      Analysis
    </span>
    <span style={{ color: currentStep >= 4 ? "#667eea" : "#a0aec0" }}>
      Hospitals
    </span>
  </div>
);

export default StepLabels;
