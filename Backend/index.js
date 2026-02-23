const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/Cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// ✅ DEPLOYMENT FIX: Security and performance middleware
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");

// Import Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");

dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URL', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

// Database connection
database.connect();

// ✅ DEPLOYMENT FIX: Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow Cloudinary and external resources
  crossOriginEmbedderPolicy: false
}));

// ✅ DEPLOYMENT FIX: Response compression
app.use(compression());

// Middleware
app.use(cookieParser());

// Dynamic CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // ✅ Render root health fix: Allow requests without origin (direct browser access)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Don't throw error, just deny
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));
// ✅ DEPLOYMENT FIX: Request size limits and sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ DEPLOYMENT FIX: Prevent NoSQL injection (replaceWith mode to avoid read-only errors)
// ✅ Render compatibility fix
app.use(mongoSanitize({
  replaceWith: '_'
}));

// ✅ DEPLOYMENT FIX: Global rate limiter (100 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Cloudinary connection
cloudinaryConnect();


// ✅ DEPLOYMENT FIX: Strict rate limiter for auth routes (10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount Routes
app.use("/api/v1/auth", authLimiter, userRoutes);
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes); 

// Health check endpoint for Render
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your Server is Up and Running..... 🚀",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "OK" });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ✅ DEPLOYMENT FIX: Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    require('mongoose').connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
