// routes/analysisRoutes.js
const express = require("express");
const multer = require("multer");
const AnalysisController = require("../controllers/analysisController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const analysisController = new AnalysisController();

// Route for text-based symptom analysis
router.post("/analyze", (req, res) => {
  analysisController.analyzeSymptoms(req, res);
});

// Route for file-based analysis
router.post("/analyze-file", upload.single("file"), (req, res) => {
  analysisController.analyzeFile(req, res);
});

module.exports = router;
