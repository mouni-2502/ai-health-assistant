// src/hooks/useHospitals.js
import { useState, useCallback } from "react";
import { healthAPI } from "../services/api";

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitalsError, setHospitalsError] = useState("");
  const [radius, setRadius] = useState(15); // Default 15km radius
  const [lastSearchParams, setLastSearchParams] = useState(null); // Store last search params for auto-refresh

  const searchNearbyHospitals = useCallback(
    async (lat, lng, hospitalType = "", searchRadius = radius) => {
      if (!lat || !lng) {
        setHospitalsError("Location is required to find nearby hospitals");
        return false;
      }

      setLoadingHospitals(true);
      setHospitalsError("");

      // Store search params for future use
      setLastSearchParams({ lat, lng, hospitalType, searchRadius });

      try {
        const result = await healthAPI.findNearbyHospitals(
          lat,
          lng,
          hospitalType,
          searchRadius
        );
        setHospitals(result || []);
        return true;
      } catch (error) {
        console.error("Error searching hospitals:", error);
        setHospitalsError(error.message || "Failed to find nearby hospitals");
        setHospitals([]);
        return false;
      } finally {
        setLoadingHospitals(false);
      }
    },
    [radius]
  );

  const updateRadius = useCallback(
    (newRadius) => {
      setRadius(newRadius);

      // Automatically search with new radius if we have previous search params
      if (lastSearchParams) {
        const { lat, lng, hospitalType } = lastSearchParams;
        // Use setTimeout to avoid too frequent API calls
        setTimeout(() => {
          searchNearbyHospitals(lat, lng, hospitalType, newRadius);
        }, 300);
      }
    },
    [lastSearchParams, searchNearbyHospitals]
  );

  const clearHospitals = useCallback(() => {
    setHospitals([]);
    setHospitalsError("");
    setLoadingHospitals(false);
  }, []);

  return {
    hospitals,
    loadingHospitals,
    hospitalsError,
    radius,
    searchNearbyHospitals,
    updateRadius,
    clearHospitals,
    hasHospitals: hospitals.length > 0,
  };
};

export default useHospitals;
