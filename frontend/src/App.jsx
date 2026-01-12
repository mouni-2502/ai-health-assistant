import React, { useState, useRef, useEffect } from "react";
import NavigationBar from "./components/common/NavigationBar";
import MessageDisplay from "./components/common/MessageDisplay";
import LocationInput from "./components/location/LocationInput";
import SymptomsInput from "./components/symptoms/SymptomsInput";
import AnalysisResults from "./components/analysis/AnalysisResults";
import HospitalsList from "./components/hospitals/HospitalsList";
import useLocation from "./hooks/useLocation";
import useHealthAnalysis from "./hooks/useHealthAnalysis";
import useHospitals from "./hooks/useHospitals";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Refs for auto-scrolling
  const analysisRef = useRef(null);
  const hospitalsRef = useRef(null);

  // Custom hooks
  const {
    lat,
    lng,
    address,
    locationError,
    isGettingLocation,
    getCurrentLocation,
    hasLocation,
  } = useLocation();

  const {
    analysisData,
    loading,
    error: analysisError,
    analyzeSymptoms,
    hasAnalysis,
  } = useHealthAnalysis();

  const {
    hospitals,
    loadingHospitals,
    hospitalsError,
    radius,
    searchNearbyHospitals,
    updateRadius,
    hasHospitals,
  } = useHospitals();

  // Function to display messages to the user
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Auto-scroll to element
  const scrollToElement = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  // Handle location getting with better error handling
  const handleGetLocation = async () => {
    const success = await getCurrentLocation();
    if (success && address && address !== "Address not available") {
      setCurrentStep(2);
      showMessage(
        "✅ Location obtained successfully! You can now proceed to describe your symptoms.",
        "success"
      );
    } else if (success && (!address || address === "Address not available")) {
      // Have coordinates but no proper address
      showMessage(
        "⚠️ Location obtained but address could not be determined. Please try again or check your internet connection.",
        "warning"
      );
      setCurrentStep(1);
    } else if (locationError) {
      if (
        locationError.includes("denied") ||
        locationError.includes("permission")
      ) {
        showMessage(
          "🚫 Location access denied. Please enable location permissions in your browser settings and try again.",
          "error"
        );
      } else if (locationError.includes("unavailable")) {
        showMessage(
          "📡 Location service unavailable. Please check your device's location settings and try again.",
          "error"
        );
      } else if (locationError.includes("timeout")) {
        showMessage(
          "⏱️ Location request timed out. Please try again or check your internet connection.",
          "error"
        );
      } else {
        showMessage(
          `❌ Location Error: ${locationError}. Please try again or enable location services.`,
          "error"
        );
      }
      // Keep user on step 1 until location is obtained
      setCurrentStep(1);
    }
  };

  // Navigation functions - improved to prevent advancing without location
  const handleStepChange = (step) => {
    // Only allow navigation to steps that have been completed
    if (step === 1) {
      setCurrentStep(step);
    } else if (step === 2 && hasLocation) {
      setCurrentStep(step);
    } else if (step === 3 && hasLocation && hasAnalysis) {
      setCurrentStep(step);
    } else if (step === 4 && hasLocation && hasAnalysis && hasHospitals) {
      setCurrentStep(step);
    } else if (step > 1 && !hasLocation) {
      showMessage(
        "Please obtain your location first before proceeding.",
        "error"
      );
    } else if (step === 3 && !hasAnalysis) {
      showMessage("Please complete symptom analysis first.", "error");
    } else if (step === 4 && !hasHospitals) {
      showMessage("Please search for hospitals first.", "error");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClear = () => {
    setSymptoms("");
    setCurrentStep(1);
    setShowAnalysis(false);
    setMessage({ text: "", type: "" });
    // Clear all hook states
    // Note: You might want to add clear functions to your hooks
  };

  const canGoBack = currentStep > 1;

  // Handle symptom analysis with better error handling
  const handleAnalyze = async () => {
    if (!hasLocation) {
      showMessage(
        "📍 Please get your location first before analyzing symptoms.",
        "error"
      );
      setCurrentStep(1);
      return;
    }

    if (!symptoms.trim()) {
      showMessage("📝 Please enter your symptoms before analysis.", "error");
      return;
    }

    const success = await analyzeSymptoms(symptoms);
    if (success) {
      setShowAnalysis(true);
      setCurrentStep(3);
      showMessage(
        "✅ Analysis complete! Review your results below.",
        "success"
      );

      // Auto-scroll to analysis section
      setTimeout(() => {
        scrollToElement(analysisRef);
      }, 500);

      // Automatically search for hospitals if location is available
      if (hasLocation && analysisData?.hospitalType) {
        setTimeout(async () => {
          await handleSearchHospitals(analysisData.hospitalType);
        }, 2000);
      }
    } else if (analysisError) {
      // Handle specific error types with better messaging
      if (
        analysisError.includes("rate limit") ||
        analysisError.includes("quota") ||
        analysisError.includes("too many requests")
      ) {
        showMessage(
          "⏳ Too many requests to the AI service. Please wait a few minutes and try again.",
          "error"
        );
      } else if (
        analysisError.includes("network") ||
        analysisError.includes("connection") ||
        analysisError.includes("fetch")
      ) {
        showMessage(
          "🌐 Network connection issue. Please check your internet and try again.",
          "error"
        );
      } else if (analysisError.includes("timeout")) {
        showMessage(
          "⏱️ Request timed out. The AI service might be busy. Please try again in a moment.",
          "error"
        );
      } else if (
        analysisError.includes("unauthorized") ||
        analysisError.includes("403") ||
        analysisError.includes("401")
      ) {
        showMessage(
          "🔑 Service authorization issue. Please contact support if this persists.",
          "error"
        );
      } else if (
        analysisError.includes("500") ||
        analysisError.includes("server")
      ) {
        showMessage(
          "🛠️ Server error. Please try again in a few minutes.",
          "error"
        );
      } else {
        showMessage(
          `❌ Analysis failed: ${analysisError}. Please check your symptoms and try again.`,
          "error"
        );
      }
      // Stay on current step if analysis fails
    }
  };

  // Handle hospital search with better error handling
  const handleSearchHospitals = async (
    hospitalType = "",
    searchRadius = radius
  ) => {
    if (!hasLocation) {
      showMessage(
        "🗺️ Location required: Please get your location first to find nearby hospitals.",
        "error"
      );
      setCurrentStep(1);
      return;
    }

    if (!hasAnalysis) {
      showMessage(
        "📋 Analysis required: Please analyze your symptoms first to search for appropriate hospitals.",
        "error"
      );
      setCurrentStep(2);
      return;
    }

    const success = await searchNearbyHospitals(
      lat,
      lng,
      hospitalType,
      searchRadius
    );
    if (success) {
      setCurrentStep(4);
      const hospitalCount = hospitals?.length || 0;
      if (hospitalCount > 0) {
        showMessage(
          `🏥 Found ${hospitalCount} hospitals within ${searchRadius}km!`,
          "success"
        );
      } else {
        showMessage(
          `🔍 No hospitals found within ${searchRadius}km. Try increasing the search radius.`,
          "warning"
        );
      }
      // Auto-scroll to hospitals section
      setTimeout(() => {
        scrollToElement(hospitalsRef);
      }, 500);
    } else if (hospitalsError) {
      // Handle specific hospital search errors
      if (
        hospitalsError.includes("rate limit") ||
        hospitalsError.includes("quota")
      ) {
        showMessage(
          "⏳ Too many location requests. Please wait a moment and try again.",
          "error"
        );
      } else if (
        hospitalsError.includes("network") ||
        hospitalsError.includes("connection")
      ) {
        showMessage(
          "🌐 Network issue while searching hospitals. Please check your connection.",
          "error"
        );
      } else if (
        hospitalsError.includes("location") ||
        hospitalsError.includes("coordinates")
      ) {
        showMessage(
          "📍 Invalid location data. Please refresh your location and try again.",
          "error"
        );
        setCurrentStep(1);
      } else {
        showMessage(
          `🏥 Hospital search failed: ${hospitalsError}. Please try again.`,
          "error"
        );
      }
    }
  };

  // Get location on component mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  // Show analysis error messages
  useEffect(() => {
    if (analysisError) {
      showMessage(analysisError, "error");
    }
  }, [analysisError]);

  // Show hospitals error messages
  useEffect(() => {
    if (hospitalsError) {
      showMessage(hospitalsError, "error");
    }
  }, [hospitalsError]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundAttachment: "fixed",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Floating particles animation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.3), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
          animation: "float 20s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-10px) translateX(5px); }
            66% { transform: translateY(5px) translateX(-5px); }
          }
          @keyframes slideIn {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
            50% { box-shadow: 0 0 30px rgba(255,255,255,0.5), 0 0 40px rgba(102,126,234,0.3); }
          }
          .slide-in { animation: slideIn 0.6s ease-out; }
          .fade-in-up { animation: fadeInUp 0.5s ease-out; }
          .pulse-hover:hover { animation: pulse 2s ease-in-out infinite; }
          .glow-effect { animation: glow 3s ease-in-out infinite; }
        `}
      </style>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          className="slide-in"
          style={{
            textAlign: "center",
            marginBottom: "40px",
            padding: "40px 30px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "25px",
            margin: "20px 20px 40px 20px",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            className="glow-effect"
            style={{
              fontSize: "4rem",
              fontWeight: "900",
              background:
                "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e1f5fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 4px 20px rgba(255,255,255,0.3)",
              marginBottom: "20px",
              letterSpacing: "-2px",
              textAlign: "center",
              borderRadius: "10px",
            }}
          >
            🩺 AI Health Assistant
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.95)",
              fontSize: "1.4rem",
              fontWeight: "300",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.6",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Get intelligent health insights powered by advanced AI technology
          </p>
          <div
            style={{
              width: "100px",
              height: "4px",
              background:
                "linear-gradient(90deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%)",
              margin: "25px auto",
              borderRadius: "2px",
              boxShadow: "0 2px 10px rgba(255,255,255,0.3)",
            }}
          />
        </div>

        {/* Message Display */}
        <MessageDisplay message={message} />

        {/* Navigation Bar */}
        <NavigationBar
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onBack={handleBack}
          onClear={handleClear}
          canGoBack={canGoBack}
        />

        {/* Page Content */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            padding: "40px",
            borderRadius: "25px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            minHeight: "500px",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div style={{ animation: "slideIn 0.5s ease-out" }}>
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  marginBottom: "30px",
                  color: "#2d3748",
                  textAlign: "center",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                📍 Step 1: Get Your Location
              </h2>
              <LocationInput
                lat={lat}
                lng={lng}
                address={address}
                onGetLocation={handleGetLocation}
                isGettingLocation={isGettingLocation}
                locationError={locationError}
              />
            </div>
          )}

          {/* Step 2: Symptoms */}
          {currentStep === 2 && (
            <div style={{ animation: "slideIn 0.5s ease-out" }}>
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                  color: "#2d3748",
                  textAlign: "center",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "#2d3748",
                }}
              >
                📝 Step 2: Describe Your Symptoms
              </h2>

              {/* Show obtained location */}
              {hasLocation && address && (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)",
                    border: "2px solid #4fd1c7",
                    borderRadius: "15px",
                    padding: "15px 20px",
                    marginBottom: "25px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                    📍
                  </div>
                  <p
                    style={{
                      margin: "0",
                      color: "#234e52",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                    }}
                  >
                    Location confirmed: {address}
                  </p>
                </div>
              )}

              <SymptomsInput
                symptoms={symptoms}
                onSymptomsChange={(e) => setSymptoms(e.target.value)}
              />

              {/* Enhanced Analyze Button with Better Loading */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !symptoms.trim()}
                style={{
                  width: "100%",
                  padding: "18px",
                  backgroundColor: loading ? "#a0aec0" : "#667eea",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  border: "none",
                  borderRadius: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  marginTop: "20px",
                  boxShadow: loading
                    ? "none"
                    : "0 8px 20px rgba(102, 126, 234, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseOver={(e) =>
                  !loading && (e.target.style.backgroundColor = "#5a67d8")
                }
                onMouseOut={(e) =>
                  !loading && (e.target.style.backgroundColor = "#667eea")
                }
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Analyzing Your Symptoms...
                  </>
                ) : (
                  <>🔍 Analyze with AI</>
                )}
              </button>

              {/* Add CSS for spinner animation */}
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {currentStep === 3 && (
            <div
              style={{ animation: "slideIn 0.5s ease-out" }}
              ref={analysisRef}
            >
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  marginBottom: "30px",
                  color: "#2d3748",
                  textAlign: "center",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                🔍 Step 3: AI Analysis Results
              </h2>
              {hasAnalysis ? (
                <AnalysisResults
                  analysisData={analysisData}
                  onSearchHospitals={handleSearchHospitals}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#718096",
                  }}
                >
                  <div style={{ fontSize: "64px", marginBottom: "20px" }}>
                    🤖
                  </div>
                  <p style={{ fontSize: "18px", margin: "0" }}>
                    Complete symptom analysis to see results here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Hospitals */}
          {currentStep === 4 && (
            <div
              style={{ animation: "slideIn 0.5s ease-out" }}
              ref={hospitalsRef}
            >
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  marginBottom: "30px",
                  color: "#2d3748",
                  textAlign: "center",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🏥 Step 4: Find Nearby Hospitals
              </h2>
              <HospitalsList
                hospitals={hospitals}
                loadingHospitals={loadingHospitals}
                radius={radius}
                onRadiusChange={updateRadius}
                onSearchHospitals={handleSearchHospitals}
                hospitalType={analysisData?.hospitalType || ""}
              />
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
