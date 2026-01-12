// utils/fileProcessor.js
const fs = require("fs");
const Parse = require("pdf-parse");

class FileProcessor {
  static async extractTextFromFile(file) {
    try {
      const filePath = file.path;
      const fileBuffer = fs.readFileSync(filePath);

      if (file.mimetype === "application/pdf") {
        const data = await Parse(fileBuffer);
        return data.text;
      } else if (file.mimetype === "text/plain") {
        return fileBuffer.toString("utf-8");
      } else if (file.mimetype.startsWith("image/")) {
        // For images, we'll return the file data for AI processing
        return {
          type: "image",
          buffer: fileBuffer,
          mimetype: file.mimetype,
        };
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  }

  static cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error cleaning up file:", error);
    }
  }
}

module.exports = FileProcessor;
