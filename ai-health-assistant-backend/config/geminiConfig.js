// config/geminiConfig.js
require("dotenv").config();

class GeminiAPIManager {
  constructor() {
    this.apiKeys = [];
    this.currentKeyIndex = 0;
    this.keyUsageCount = {};
    this.keyLastUsed = {};
    this.maxRequestsPerMinute = 20; // Conservative limit to avoid 429 errors

    // Load all Gemini API keys from environment
    for (let i = 1; i <= 20; i++) {
      const key = process.env[`gemini_API_KEY_${i}`];
      if (key) {
        this.apiKeys.push(key);
        this.keyUsageCount[key] = 0;
        this.keyLastUsed[key] = 0;
      }
    }

    if (this.apiKeys.length === 0) {
      console.error("No Gemini API keys found in environment variables");
    } else {
      console.log(`Loaded ${this.apiKeys.length} Gemini API keys`);
    }
  }

  getNextAPIKey() {
    if (this.apiKeys.length === 0) {
      throw new Error("No Gemini API keys available");
    }

    const now = Date.now();

    // Find a key that hasn't been used recently
    for (let i = 0; i < this.apiKeys.length; i++) {
      const keyIndex = (this.currentKeyIndex + i) % this.apiKeys.length;
      const key = this.apiKeys[keyIndex];
      const timeSinceLastUse = now - (this.keyLastUsed[key] || 0);

      // If it's been more than a minute since last use, or usage count is low
      if (
        timeSinceLastUse > 60000 ||
        this.keyUsageCount[key] < this.maxRequestsPerMinute
      ) {
        this.currentKeyIndex = (keyIndex + 1) % this.apiKeys.length;
        this.keyUsageCount[key] = (this.keyUsageCount[key] || 0) + 1;
        this.keyLastUsed[key] = now;

        // Reset usage count if it's been more than a minute
        if (timeSinceLastUse > 60000) {
          this.keyUsageCount[key] = 1;
        }

        return key;
      }
    }

    // If all keys are rate limited, use the least recently used one
    const oldestKey = this.apiKeys.reduce((oldest, current) => {
      return (this.keyLastUsed[current] || 0) < (this.keyLastUsed[oldest] || 0)
        ? current
        : oldest;
    });

    this.keyUsageCount[oldestKey] = (this.keyUsageCount[oldestKey] || 0) + 1;
    this.keyLastUsed[oldestKey] = now;
    return oldestKey;
  }

  resetUsageCounts() {
    for (const key of this.apiKeys) {
      this.keyUsageCount[key] = 0;
    }
  }
}

module.exports = GeminiAPIManager;
