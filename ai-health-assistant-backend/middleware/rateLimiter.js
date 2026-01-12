// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

// Create different rate limiters for different endpoints
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for analysis
  message: {
    error: "Too many analysis requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const hospitalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for hospital search
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  analysisLimiter,
  hospitalLimiter,
  generalLimiter,
};
