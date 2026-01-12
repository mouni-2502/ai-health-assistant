// services/hospitalService.js
const axios = require("axios");

class HospitalService {
  constructor(googleMapsApiKey) {
    this.googleMapsApiKey = googleMapsApiKey;
  }

  async findNearbyHospitals(lat, lng, hospitalType = "", radiusKm = 15) {
    try {
      // Convert radius from km to meters for Google Maps API
      const radiusMeters = radiusKm * 1000;

      // Create search query based on hospital type
      let searchQuery = "hospital";
      let searchType = "hospital";

      if (hospitalType) {
        // Clean and format the hospital type for search
        const cleanType = hospitalType
          .toLowerCase()
          .replace(/hospitals?/gi, "")
          .replace(/clinic/gi, "")
          .replace(/care/gi, "")
          .trim();

        if (cleanType) {
          searchQuery = `${cleanType} hospital`;

          // Set more specific search types for better results
          if (cleanType.includes("eye")) {
            searchType = "doctor";
            searchQuery = "eye hospital ophthalmologist";
          } else if (
            cleanType.includes("heart") ||
            cleanType.includes("cardio")
          ) {
            searchType = "doctor";
            searchQuery = "heart hospital cardiologist";
          } else if (cleanType.includes("dental")) {
            searchType = "dentist";
            searchQuery = "dental clinic dentist";
          } else if (cleanType.includes("emergency")) {
            searchType = "hospital";
            searchQuery = "emergency hospital";
          }
        }
      }

      console.log(
        `Searching for: ${searchQuery} within ${radiusKm}km (${radiusMeters}m)`
      );

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=${encodeURIComponent(
          searchQuery
        )}&type=${searchType}&key=${this.googleMapsApiKey}`
      );

      console.log(`Found ${response.data.results.length} results`);

      // Calculate distance for each hospital and sort by distance
      const hospitals = response.data.results
        .map((place) => {
          const distance = this.calculateDistance(
            lat,
            lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          );

          return {
            name: place.name,
            vicinity: place.vicinity,
            address: place.vicinity,
            place_id: place.place_id,
            rating: place.rating || "N/A",
            opening_hours: place.opening_hours?.open_now
              ? "Open now"
              : place.opening_hours
              ? "Closed now"
              : "Hours not available",
            formatted_phone_number: place.formatted_phone_number,
            geometry: place.geometry,
            distance: `${distance.toFixed(1)} km`,
            distanceValue: distance,
            types: place.types || [],
          };
        })
        .filter((hospital) => hospital.distanceValue <= radiusKm) // Filter by actual distance
        .sort((a, b) => a.distanceValue - b.distanceValue) // Sort by distance
        .slice(0, 10); // Return top 10 closest hospitals

      return hospitals;
    } catch (error) {
      console.error("Error finding hospitals:", error);
      throw error;
    }
  }

  // Helper function to calculate distance between two coordinates
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  async getAddressFromCoordinates(lat, lng) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsApiKey}`
      );

      const address =
        response.data.results[0]?.formatted_address || "Address not found";
      return address;
    } catch (error) {
      console.error("Error getting address:", error);
      throw error;
    }
  }
}

module.exports = HospitalService;
