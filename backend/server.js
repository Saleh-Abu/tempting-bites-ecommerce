// ==========================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==========================================

require("dotenv").config();


// ==========================================
// CLOUDINARY CONFIG CHECK
// Temporary check - does NOT show secrets
// ==========================================

console.log("Cloudinary Config:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME
    ? "Loaded"
    : "Missing",

  apiKey: process.env.CLOUDINARY_API_KEY
    ? "Loaded"
    : "Missing",

  apiSecret: process.env.CLOUDINARY_API_SECRET
    ? "Loaded"
    : "Missing",
});


// ==========================================
// IMPORT PACKAGES
// ==========================================

const express = require("express");
const cors = require("cors");


// ==========================================
// DATABASE CONNECTION
// ==========================================

const connectDB =
  require("./config/db");


// ==========================================
// IMPORT ROUTES
// ==========================================

const cakeRoutes =
  require("./routes/cakeRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const uploadRoutes =
  require("./routes/uploadRoutes");

const userAuthRoutes =
  require("./routes/userAuthRoutes");


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// CONNECT TO MONGODB
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);


// Parse JSON requests

app.use(
  express.json()
);


// Parse URL encoded requests

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Tempting Bites API is running 🎂",
    });
  }
);


// ==========================================
// API ROUTES
// ==========================================


// ==========================================
// CAKES
// ==========================================

app.use(
  "/api/cakes",
  cakeRoutes
);


// ==========================================
// ORDERS
// ==========================================

app.use(
  "/api/orders",
  orderRoutes
);


// ==========================================
// ADMIN
// ==========================================

app.use(
  "/api/admin",
  adminRoutes
);


// ==========================================
// CLOUDINARY IMAGE UPLOAD
// ==========================================

app.use(
  "/api/upload",
  uploadRoutes
);


// ==========================================
// CUSTOMER AUTHENTICATION
//
// /api/auth/register
// /api/auth/login
// /api/auth/firebase
// ==========================================

app.use(
  "/api/auth",
  userAuthRoutes
);


// ==========================================
// 404 HANDLER
//
// IMPORTANT:
// Keep this AFTER all API routes.
// ==========================================

app.use(
  (req, res) => {
    res
      .status(404)
      .json({
        success: false,

        message:
          "API route not found.",
      });
  }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "Server Error:",
      err
    );


    // ======================================
    // MULTER FILE SIZE ERROR
    // ======================================

    if (
      err.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Image is too large. Maximum size is 5 MB.",
        });
    }


    // ======================================
    // GENERAL SERVER ERROR
    // ======================================

    return res
      .status(
        err.status ||
          500
      )
      .json({
        success: false,

        message:
          err.message ||
          "Something went wrong on the server.",
      });
  }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT ||
  5000;


app.listen(
  PORT,
  () => {
    console.log(
      `Tempting Bites server running on port ${PORT}`
    );
  }
);