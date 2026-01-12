// services/aiAnalysisService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeminiAPIManager = require("../config/geminiConfig");

class AIAnalysisService {
  constructor() {
    this.geminiManager = new GeminiAPIManager();
  }

  async analyzeSymptoms(symptoms, fileData = null) {
    try {
      const apiKey = this.geminiManager.getNextAPIKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      let prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a structured response in JSON format.

Based on the symptoms provided, return a JSON object with the following fields:
- detectedSymptoms: extracted symptoms and a clear summary of the symptoms
- hospitalType: The most appropriate type of hospital for Google Maps search. Use ONLY ONE of these exact terms: "Hospital", "Eye Hospital", "Heart Hospital", "Dental Clinic", "Orthopedic Hospital", "Skin Clinic", "Emergency Hospital", "Pediatric Hospital", "Maternity Hospital", "Mental Health Clinic"
- possible-reasons: Possible medical reasons for these symptoms - array of bullets
- dietPlan: An array of dietary recommendations - array of bullets
- severity: "Low", "Medium", or "High"
- urgency: "Routine", "Urgent", or "Emergency"

IMPORTANT: For hospitalType, use exact spelling and proper names. Do not use typos or variations.

Symptoms: ${symptoms}`;

      let result;
      if (fileData) {
        // For file analysis with multimodal input
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: fileData.buffer.toString("base64"),
              mimeType: fileData.mimetype,
            },
          },
        ]);
      } else {
        // For text-only analysis
        result = await model.generateContent(prompt);
      }

      const response = await result.response;
      const text = response.text();

      // Try to parse JSON from response
      let analysisData;
      try {
        // Clean the response text to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.log("JSON parsing failed, using fallback analysis");
        analysisData = this.getFallbackAnalysis(symptoms);
      }

      return analysisData;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return this.getFallbackAnalysis(symptoms);
    }
  }

  getFallbackAnalysis(symptoms) {
    const commonSymptoms = symptoms.toLowerCase();
    let hospitalType = "Hospital";
    let severity = "Low";
    let urgency = "Routine";
    let possibleReasons = [
      "Common symptoms that may require basic medical evaluation",
    ];

    // Basic symptom analysis with proper hospital types
    if (
      commonSymptoms.includes("chest pain") ||
      commonSymptoms.includes("heart") ||
      commonSymptoms.includes("cardiac")
    ) {
      hospitalType = "Heart Hospital";
      severity = "High";
      urgency = "Urgent";
      possibleReasons = [
        "Chest pain could indicate cardiovascular issues and requires immediate medical attention",
      ];
    } else if (
      commonSymptoms.includes("eye") ||
      commonSymptoms.includes("vision") ||
      commonSymptoms.includes("sight")
    ) {
      hospitalType = "Eye Hospital";
      severity = "Medium";
      urgency = "Routine";
      possibleReasons = [
        "Eye-related symptoms that may require ophthalmologic evaluation",
      ];
    } else if (
      commonSymptoms.includes("fever") &&
      commonSymptoms.includes("severe")
    ) {
      hospitalType = "Emergency Hospital";
      severity = "Medium";
      urgency = "Urgent";
      possibleReasons = [
        "High fever may indicate infection or other conditions requiring prompt treatment",
      ];
    } else if (
      commonSymptoms.includes("headache") ||
      commonSymptoms.includes("migraine")
    ) {
      hospitalType = "Hospital";
      severity = "Medium";
      urgency = "Routine";
      possibleReasons = [
        "Headaches may have various causes and should be evaluated by a healthcare provider",
      ];
    }

    return {
      detectedSymptoms: symptoms,
      hospitalType,
      "possible-reasons": possibleReasons,
      dietPlan: [
        "Stay hydrated with plenty of water",
        "Eat light, easily digestible foods",
        "Include fruits and vegetables rich in vitamins",
        "Avoid processed and high-fat foods",
        "Get adequate rest",
      ],
      severity,
      urgency,
    };
  }
}

module.exports = AIAnalysisService;
