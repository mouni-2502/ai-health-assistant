// src/components/hospitals/HospitalsList.jsx
import React from "react";
import RadiusSlider from "./RadiusSlider";

const HospitalsList = ({
  hospitals,
  loadingHospitals,
  radius = 15,
  onRadiusChange,
  onSearchHospitals,
  hospitalType = "",
}) => {
  return (
    <div
      style={{
        marginTop: "30px",
        background: "rgba(255, 255, 255, 0.95)",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "25px",
          color: "#2d3748",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        🏥 Nearby Hospitals
      </h2>

      {/* Radius Slider */}
      <RadiusSlider radius={radius} onRadiusChange={onRadiusChange} />

      {loadingHospitals ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            fontSize: "1.2rem",
            color: "#667eea",
            background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
            borderRadius: "16px",
            border: "2px dashed #cbd5e0",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>⏳</div>
          Loading nearby hospitals within {radius}km...
        </div>
      ) : !hospitals || hospitals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            fontSize: "1.1rem",
            color: "#718096",
            background: "linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)",
            borderRadius: "16px",
            border: "2px solid #f56565",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔍</div>
          <p style={{ margin: "0 0 10px 0", fontWeight: "600" }}>
            No hospitals found within {radius}km radius
          </p>
          <p style={{ margin: "0", fontSize: "14px", opacity: "0.8" }}>
            Try increasing the search radius or check your location
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "20px",
                padding: "30px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginRight: "20px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "15px",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  🏥
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#2d3748",
                      margin: "0 0 8px 0",
                      lineHeight: "1.3",
                    }}
                  >
                    {hospital.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "#48bb78",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        background: "#f0fff4",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #9ae6b4",
                      }}
                    >
                      ⭐ {hospital.rating || "N/A"}
                    </span>
                    {hospital.distance && (
                      <span
                        style={{
                          color: "#667eea",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          background: "#edf2f7",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e0",
                        }}
                      >
                        📍 {hospital.distance}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address with better styling */}
              <div
                style={{
                  background: "rgba(102, 126, 234, 0.05)",
                  padding: "15px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  border: "1px solid rgba(102, 126, 234, 0.1)",
                }}
              >
                <p
                  style={{
                    color: "#4a5568",
                    fontSize: "0.95rem",
                    margin: "0",
                    lineHeight: "1.5",
                    fontWeight: "500",
                  }}
                >
                  📍{" "}
                  {hospital.vicinity ||
                    hospital.address ||
                    "Address not available"}
                </p>
              </div>

              {hospital.phone && (
                <p
                  style={{
                    color: "#48bb78",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    margin: "12px 0",
                    background: "#f0fff4",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #9ae6b4",
                  }}
                >
                  📞 {hospital.phone}
                </p>
              )}

              {hospital.openingHours && (
                <p
                  style={{
                    color: hospital.openingHours.includes("Open")
                      ? "#48bb78"
                      : "#ed8936",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    margin: "12px 0",
                    padding: "8px 12px",
                    background: hospital.openingHours.includes("Open")
                      ? "#f0fff4"
                      : "#fffaf0",
                    borderRadius: "8px",
                    border: hospital.openingHours.includes("Open")
                      ? "1px solid #9ae6b4"
                      : "1px solid #fbd38d",
                  }}
                >
                  🕒 {hospital.openingHours}
                </p>
              )}

              {hospital.types && hospital.types.length > 0 && (
                <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {hospital.types.slice(0, 3).map((type, typeIndex) => (
                      <span
                        key={typeIndex}
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "15px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {type.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Button with place_id */}
              <button
                onClick={() => {
                  const placeId = hospital.place_id;
                  const hospitalName = encodeURIComponent(hospital.name);
                  let mapsUrl;

                  if (placeId) {
                    // Use place_id if available
                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospitalName}&query_place_id=${placeId}`;
                  } else {
                    // Fallback to name and address search
                    const address = encodeURIComponent(
                      hospital.vicinity || hospital.address || ""
                    );
                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospitalName}+${address}`;
                  }

                  window.open(mapsUrl, "_blank");
                }}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "15px 20px",
                  background:
                    "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                🗺️ Navigate to Hospital
              </button>
            </div>
          ))}
        </div>
      )}

      {hospitals && hospitals.length > 0 && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)",
            borderRadius: "12px",
            border: "2px solid #81e6d9",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              color: "#285e61",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ✅ Found {hospitals.length} hospitals within {radius}km radius
          </p>
        </div>
      )}
    </div>
  );
};

export default HospitalsList;
