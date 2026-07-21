const express = require("express");
const multer = require("multer");

const {
  uploadCakeImage,
} = require("../controllers/uploadController");

const {
  protectAdmin,
} = require("../middleware/adminAuth");

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WebP images are allowed."
        ),
        false
      );
    }
  },
});

/* =========================
   UPLOAD ROUTE
========================= */

router.post(
  "/cake",
  protectAdmin,
  upload.single("image"),
  uploadCakeImage
);

module.exports = router;