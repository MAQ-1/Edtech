const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/Cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Import Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");


dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connection
database.connect();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",  // frontend URL (change to vercel URL later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary connection
cloudinaryConnect();


// Mount Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes); 

// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your Server is Up and Running..... 🚀"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on ${PORT}`);
});
