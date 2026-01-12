// controllers/analysisController.js
const AIAnalysisService = require("../services/aiAnalysisService");
const FileProcessor = require("../utils/fileProcessor");

class AnalysisController {
  constructor() {
    this.aiService = new AIAnalysisService();
  }

  async analyzeSymptoms(req, res) {
    try {
      const { symptoms } = req.body;

      if (!symptoms || symptoms.trim() === "") {
        return res.status(400).json({ error: "Symptoms are required" });
      }

      const analysisData = await this.aiService.analyzeSymptoms(symptoms);
      res.json(analysisData);
    } catch (error) {
      console.error("Error in analyzeSymptoms:", error);
      res.status(500).json({ error: "Internal server error during analysis" });
    }
  }

  async analyzeFile(req, res) {
    try {
      const { symptoms } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "File is required" });
      }

      let combinedInput = symptoms || "";
      let fileData = null;

      try {
        const extractedContent = await FileProcessor.extractTextFromFile(file);

        if (typeof extractedContent === "string") {
          // Text extracted successfully
          combinedInput +=
            (combinedInput ? "\n\n" : "") +
            "File content:\n" +
            extractedContent;
        } else if (extractedContent.type === "image") {
          // Image file - pass to AI for analysis
          fileData = extractedContent;
          combinedInput +=
            (combinedInput ? "\n\n" : "") +
            "Medical image/report uploaded for analysis.";
        }
      } catch (extractError) {
        console.error("File extraction error:", extractError);
        return res
          .status(400)
          .json({ error: "Could not process the uploaded file" });
      } finally {
        // Clean up uploaded file
        FileProcessor.cleanupFile(file.path);
      }

      const analysisData = await this.aiService.analyzeSymptoms(
        combinedInput,
        fileData
      );
      res.json(analysisData);
    } catch (error) {
      console.error("Error in analyzeFile:", error);
      res
        .status(500)
        .json({ error: "Internal server error during file analysis" });
    }
  }
}

module.exports = AnalysisController;
