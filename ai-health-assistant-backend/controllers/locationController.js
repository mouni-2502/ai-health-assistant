// controllers/locationController.js
const HospitalService = require("../services/hospitalService");

class LocationController {
  constructor(googleMapsApiKey) {
    this.hospitalService = new HospitalService(googleMapsApiKey);
  }

  async getAddress(req, res) {
    try {
      const { lat, lng } = req.body;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      const address = await this.hospitalService.getAddressFromCoordinates(
        lat,
        lng
      );
      res.json({ address });
    } catch (error) {
      console.error("Error getting address:", error);
      res.status(500).json({ address: "Address not found" });
    }
  }

  async getNearbyHospitals(req, res) {
    try {
      const { lat, lng, hospitalType, radius } = req.body;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      // Default radius to 15km if not provided
      const searchRadius = radius || 15;

      console.log(
        `Searching for ${
          hospitalType || "hospitals"
        } within ${searchRadius}km of ${lat}, ${lng}`
      );

      const hospitals = await this.hospitalService.findNearbyHospitals(
        lat,
        lng,
        hospitalType,
        searchRadius
      );

      console.log(`Found ${hospitals.length} hospitals`);
      res.json(hospitals);
    } catch (error) {
      console.error("Error finding nearby hospitals:", error);
      res.status(500).json({ error: "Failed to find nearby hospitals" });
    }
  }
}

module.exports = LocationController;
