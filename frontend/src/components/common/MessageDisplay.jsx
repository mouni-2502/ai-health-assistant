// src/components/common/MessageDisplay.jsx
import React from "react";

const MessageDisplay = ({ message }) => {
  if (!message.text) return null;

  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "600",
        backgroundColor:
          message.type === "error"
            ? "#fed7d7"
            : message.type === "success"
            ? "#d4edda"
            : "#cce5ff",
        color:
          message.type === "error"
            ? "#c53030"
            : message.type === "success"
            ? "#155724"
            : "#004085",
        border: `1px solid ${
          message.type === "error"
            ? "#f5c6cb"
            : message.type === "success"
            ? "#c3e6cb"
            : "#b8daff"
        }`,
      }}
    >
      {message.text}
    </div>
  );
};

export default MessageDisplay;
