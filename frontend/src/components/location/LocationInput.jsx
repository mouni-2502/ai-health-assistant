// src/components/location/LocationInput.jsx
import React from "react";

const LocationInput = ({
  lat,
  lng,
  address,
  onGetLocation,
  isGettingLocation,
  locationError,
}) => {
  return (
    <div>
      <button
        onClick={onGetLocation}
        disabled={isGettingLocation}
        style={{
          width: "100%",
          backgroundColor: isGettingLocation
            ? "#a0aec0"
            : lat && lng
            ? "#48bb78"
            : "#667eea",
          color: "white",
          padding: "20px",
          fontSize: "16px",
          fontWeight: "600",
          border: "none",
          borderRadius: "15px",
          marginBottom: "25px",
          cursor: isGettingLocation ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          opacity: isGettingLocation ? 0.7 : 1,
        }}
      >
        {isGettingLocation
          ? "🔄 Getting Location..."
          : lat && lng
          ? "✅ Location Obtained"
          : "📍 Get My Location"}
      </button>

      {locationError && (
        <div
          style={{
            backgroundColor: "#fed7d7",
            color: "#c53030",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
            border: "2px solid #fc8181",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "8px 0", fontWeight: "600" }}>
            ⚠️ Location Error
          </p>
          <p style={{ margin: "8px 0", fontSize: "14px", lineHeight: "1.5" }}>
            {locationError}
          </p>
          <p style={{ margin: "8px 0", fontSize: "13px", color: "#9b2c2c" }}>
            💡 <strong>Tip:</strong> Make sure location services are enabled in
            your browser settings and try again.
          </p>
        </div>
      )}

      {address &&
        lat &&
        lng &&
        address !== "Address not available" &&
        address !== "Address not found" && (
          <div
            style={{
              backgroundColor: "#f0f9ff",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
              border: "2px solid #bfdbfe",
            }}
          >
            <p style={{ margin: "8px 0", color: "#1e40af", fontWeight: "600" }}>
              <strong>📌 Current Location:</strong>
            </p>
            <p style={{ margin: "8px 0", color: "#3730a3", fontSize: "15px" }}>
              {address}
            </p>
            <p style={{ margin: "8px 0", color: "#6366f1", fontSize: "13px" }}>
              <strong>Coordinates:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
            <div
              style={{
                backgroundColor: "#dbeafe",
                padding: "12px",
                borderRadius: "10px",
                marginTop: "15px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0",
                  color: "#1e40af",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                ✅ You can now proceed to describe your symptoms!
              </p>
            </div>
          </div>
        )}

      {lat &&
        lng &&
        (address === "Address not available" ||
          address === "Address not found" ||
          !address) && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              color: "#92400e",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
              border: "2px solid #f59e0b",
            }}
          >
            <p style={{ margin: "8px 0", fontWeight: "600" }}>
              ⚠️ Location Partially Available
            </p>
            <p style={{ margin: "8px 0", fontSize: "14px", lineHeight: "1.5" }}>
              <strong>Coordinates:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
            <p style={{ margin: "8px 0", fontSize: "14px", lineHeight: "1.5" }}>
              <strong>Address:</strong> Could not determine your address
            </p>
            <p style={{ margin: "8px 0", fontSize: "13px", color: "#78350f" }}>
              💡 <strong>Please try again</strong> or check your internet
              connection to get the complete address.
            </p>
          </div>
        )}

      {!locationError && !lat && !lng && !isGettingLocation && (
        <div
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #f59e0b",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0", fontSize: "14px" }}>
            📍 Location is required to find nearby hospitals and provide
            personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
