// src/hooks/useHealthAnalysis.js
import { useState, useCallback } from "react";
import { healthAPI } from "../services/api";

export const useHealthAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSymptoms = useCallback(async (symptoms) => {
    if (!symptoms.trim()) {
      setError("Please enter symptoms to analyze.");
      return false;
    }

    setLoading(true);
    setError("");
    setAnalysisData(null);

    try {
      const result = await healthAPI.analyzeSymptoms(symptoms);
      setAnalysisData(result);
      return true;
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);
      
      // Enhanced error handling for different error types
      let errorMessage = "Failed to analyze symptoms. Please try again.";
      
      if (analysisError.response) {
        // HTTP error responses
        const status = analysisError.response.status;
        if (status === 429) {
          errorMessage = "Too many requests. Please wait a few minutes before trying again.";
        } else if (status === 403) {
          errorMessage = "API quota exceeded. Please try again later.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again in a few moments.";
        } else if (status >= 400 && status < 500) {
          errorMessage = "Request error. Please check your input and try again.";
        }
      } else if (analysisError.message) {
        // Network or other errors
        if (analysisError.message.includes("timeout")) {
          errorMessage = "Request timeout. Please check your connection and try again.";
        } else if (analysisError.message.includes("network") || analysisError.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else {
          errorMessage = analysisError.message;
        }
      }
      
      setError(errorMessage);
      setAnalysisData({
        error: errorMessage,
        symptoms: "",
        hospitalType: "",
        "possible-reasons": "",
        dietPlan: "",
        severity: "",
        urgency: "",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisData(null);
    setError("");
    setLoading(false);
  }, []);

  return {
    analysisData,
    loading,
    error,
    analyzeSymptoms,
    clearAnalysis,
    hasAnalysis: analysisData !== null,
  };
};

export default useHealthAnalysis;
