// src/components/analysis/AnalysisResults.jsx
import React from "react";

const AnalysisResults = ({ analysisData, onSearchHospitals }) => {
  // Helper function to safely render data
  const renderData = (data, fallback = "Not available") => {
    if (data === null || data === undefined) return fallback;
    if (typeof data === "string") return data;
    if (typeof data === "object") {
      // If it's an object, try to extract meaningful information
      if (data.summary) return data.summary;
      if (data.symptoms) return data.symptoms;
      return JSON.stringify(data);
    }
    return String(data);
  };

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "#48bb78";
      case "medium":
        return "#f6ad55";
      case "high":
        return "#fc8181";
      default:
        return "#a0aec0";
    }
  };

  // Helper function to get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "routine":
        return "#48bb78";
      case "urgent":
        return "#f6ad55";
      case "emergency":
        return "#fc8181";
      default:
        return "#a0aec0";
    }
  };

  if (!analysisData) return null;

  return (
    <div
      className="slide-in"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        padding: "40px",
        borderRadius: "25px",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "200%",
          height: "200%",
          background: `
            radial-gradient(circle at 30% 30%, rgba(99,102,241,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(139,92,246,0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h2
          className="glow-effect"
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "30px",
            color: "#2d3748",
            background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        ></h2>

        {analysisData.error ? (
          <div
            style={{
              background: "linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)",
              color: "#c53030",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              fontWeight: "600",
              border: "2px solid #fc8181",
            }}
          >
            ⚠️ {analysisData.error}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "25px" }}>
            {/* Symptoms Summary */}
            <div
              className="fade-in-up"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                padding: "25px",
                borderRadius: "20px",
                border: "2px solid rgba(99,102,241,0.3)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  color: "#667eea",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                📋 Detected Symptoms
              </h3>
              <p
                style={{
                  color: "#4a5568",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {renderData(
                  analysisData.detectedSymptoms,
                  "No symptoms detected"
                )}
              </p>
            </div>

            {/* Severity and Urgency */}
            <div
              className="fade-in-up"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              {/* Severity Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${getSeverityColor(
                    analysisData.severity
                  )}15 0%, rgba(255,255,255,0.95) 100%)`,
                  backdropFilter: "blur(15px)",
                  padding: "20px",
                  borderRadius: "18px",
                  border: `2px solid ${getSeverityColor(analysisData.severity)}40`,
                  boxShadow: `0 8px 25px ${getSeverityColor(
                    analysisData.severity
                  )}20, inset 0 1px 0 rgba(255,255,255,0.5)`,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow effect overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at center, ${getSeverityColor(
                      analysisData.severity
                    )}10 0%, transparent 70%)`,
                    borderRadius: "16px",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "8px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    ⚡
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#4a5568",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Severity
                  </h4>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${getSeverityColor(
                        analysisData.severity
                      )} 0%, ${getSeverityColor(
                        analysisData.severity
                      )}80 100%)`,
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "25px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      boxShadow: `0 4px 15px ${getSeverityColor(
                        analysisData.severity
                      )}40`,
                    }}
                  >
                    {renderData(analysisData.severity, "Unknown")}
                  </div>
                </div>
              </div>

              {/* Urgency Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${getUrgencyColor(
                    analysisData.urgency
                  )}15 0%, rgba(255,255,255,0.95) 100%)`,
                  backdropFilter: "blur(15px)",
                  padding: "20px",
                  borderRadius: "18px",
                  border: `2px solid ${getUrgencyColor(
                    analysisData.urgency
                  )}40`,
                  boxShadow: `0 8px 25px ${getUrgencyColor(
                    analysisData.urgency
                  )}20, inset 0 1px 0 rgba(255,255,255,0.5)`,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow effect overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at center, ${getUrgencyColor(
                      analysisData.urgency
                    )}10 0%, transparent 70%)`,
                    borderRadius: "16px",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "8px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    🚨
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#4a5568",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Urgency
                  </h4>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${getUrgencyColor(
                        analysisData.urgency
                      )} 0%, ${getUrgencyColor(analysisData.urgency)}80 100%)`,
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "25px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      boxShadow: `0 4px 15px ${getUrgencyColor(
                        analysisData.urgency
                      )}40`,
                    }}
                  >
                    {renderData(analysisData.urgency, "Unknown")}
                  </div>
                </div>
              </div>
            </div>

            {/* Possible Reasons */}
            {analysisData["possible-reasons"] && (
              <div
                className="fade-in-up"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  padding: "25px",
                  borderRadius: "20px",
                  border: "2px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#8b5cf6",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  🧠 Possible Reasons
                </h3>
                {Array.isArray(analysisData["possible-reasons"]) ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {analysisData["possible-reasons"].map((reason, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          marginBottom: "12px",
                          padding: "12px",
                          background: "rgba(139,92,246,0.1)",
                          borderRadius: "12px",
                          border: "1px solid rgba(139,92,246,0.2)",
                        }}
                      >
                        <span
                          style={{
                            color: "#8b5cf6",
                            fontSize: "16px",
                            fontWeight: "bold",
                            minWidth: "20px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            color: "#4a5568",
                            fontSize: "15px",
                            lineHeight: "1.5",
                          }}
                        >
                          {reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      color: "#4a5568",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {renderData(
                      analysisData["possible-reasons"],
                      "No possible reasons available"
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Diet Plan */}
            {analysisData.dietPlan && (
              <div
                className="fade-in-up"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  padding: "25px",
                  borderRadius: "20px",
                  border: "2px solid rgba(72,187,120,0.3)",
                  boxShadow: "0 4px 20px rgba(72,187,120,0.15)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#48bb78",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  🥗 Recommended Diet Plan
                </h3>
                {Array.isArray(analysisData.dietPlan) ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {analysisData.dietPlan.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          marginBottom: "12px",
                          padding: "12px",
                          background: "rgba(72,187,120,0.1)",
                          borderRadius: "12px",
                          border: "1px solid rgba(72,187,120,0.2)",
                        }}
                      >
                        <span
                          style={{
                            color: "#48bb78",
                            fontSize: "16px",
                            fontWeight: "bold",
                            minWidth: "20px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            color: "#4a5568",
                            fontSize: "15px",
                            lineHeight: "1.5",
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      color: "#4a5568",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {renderData(
                      analysisData.dietPlan,
                      "No diet plan available"
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Hospital Search Button */}
            {analysisData.hospitalType && onSearchHospitals && (
              <button
                onClick={() => onSearchHospitals(analysisData.hospitalType)}
                className="pulse-hover glow-effect"
                style={{
                  width: "100%",
                  padding: "20px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                🏥 Find Nearby {analysisData.hospitalType} Hospitals
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
