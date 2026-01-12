// routes/locationRoutes.js
const express = require("express");
const LocationController = require("../controllers/locationController");

const router = express.Router();

function createLocationRoutes(googleMapsApiKey) {
  const locationController = new LocationController(googleMapsApiKey);

  // Route for getting address from coordinates
  router.post("/get-address", (req, res) => {
    locationController.getAddress(req, res);
  });

  // Route for finding nearby hospitals
  router.post("/nearby-hospitals", (req, res) => {
    locationController.getNearbyHospitals(req, res);
  });

  return router;
}

module.exports = createLocationRoutes;
