const cloudinary = require("../config/cloudinary");

/* =========================
   UPLOAD CAKE IMAGE
========================= */

const uploadCakeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tempting-bites/cakes",

        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },

      (error, result) => {
        if (error) {
          console.error(
            "Cloudinary upload error:",
            error
          );

          return res.status(500).json({
            success: false,
            message: "Image upload failed.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Image uploaded successfully.",
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error(
      "Upload controller error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to upload image.",
    });
  }
};

module.exports = {
  uploadCakeImage,
};