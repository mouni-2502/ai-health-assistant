// src/hooks/useLocation.js
import { useState, useCallback } from "react";
import { healthAPI } from "../services/api";

export const useLocation = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return false;
    }

    setIsGettingLocation(true);
    setLocationError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLng(longitude);

      // Get address from coordinates
      try {
        const addressData = await healthAPI.getAddress(latitude, longitude);
        setAddress(addressData.address || "Address not found");
      } catch (addressError) {
        console.error("Error getting address:", addressError);
        setAddress("Address not available");
      }

      return true;
    } catch (error) {
      console.error("Geolocation error:", error);
      let errorMessage = "Failed to get location";

      switch (error.code) {
        case 1:
          errorMessage =
            "Location access denied. Please enable location services.";
          break;
        case 2:
          errorMessage = "Location information unavailable.";
          break;
        case 3:
          errorMessage = "Location request timeout.";
          break;
        default:
          errorMessage = "Unknown location error occurred.";
      }

      setLocationError(errorMessage);
      return false;
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLat(null);
    setLng(null);
    setAddress("");
    setLocationError("");
  }, []);

  return {
    lat,
    lng,
    address,
    locationError,
    isGettingLocation,
    getCurrentLocation,
    clearLocation,
    hasLocation:
      lat !== null &&
      lng !== null &&
      address &&
      address !== "Address not available" &&
      address !== "Address not found",
  };
};

export default useLocation;
