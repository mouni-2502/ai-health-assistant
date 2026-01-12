// src/components/symptoms/FileUpload.jsx
import React, { useRef } from "react";

const FileUpload = ({ file, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const syntheticEvent = {
        target: { files: [files[0]] },
      };
      onFileChange(syntheticEvent);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginBottom: "20px", height: "100%" }}>
      <label
        style={{
          display: "block",
          marginBottom: "12px",
          fontWeight: "700",
          color: "#4a5568",
          fontSize: "16px",
        }}
      >
        📎 Upload Medical Reports
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "20px",
          borderRadius: "16px",
          border: file ? "3px solid #48bb78" : "3px dashed #cbd5e0",
          backgroundColor: file ? "#f0fff4" : "#f7fafc",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background: file
            ? "linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%)"
            : "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          if (!file) {
            e.target.style.borderColor = "#667eea";
            e.target.style.backgroundColor = "#f1f5f9";
          }
        }}
        onMouseLeave={(e) => {
          if (!file) {
            e.target.style.borderColor = "#cbd5e0";
            e.target.style.backgroundColor = "#f7fafc";
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
          onChange={onFileChange}
          style={{ display: "none" }}
        />

        {!file ? (
          <>
            <div
              style={{ fontSize: "48px", marginBottom: "10px", opacity: "0.6" }}
            >
              📁
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#4a5568",
                margin: "0 0 8px 0",
              }}
            >
              Click or drag files here
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#718096",
                margin: "0",
              }}
            >
              PDF, DOC, TXT, JPG, PNG (Max 10MB)
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
            <p
              style={{
                color: "#48bb78",
                fontSize: "16px",
                fontWeight: "700",
                margin: "0 0 8px 0",
              }}
            >
              {file.name}
            </p>
            <p
              style={{
                color: "#38a169",
                fontSize: "12px",
                margin: "0",
              }}
            >
              AI will analyze your medical report along with symptoms
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
