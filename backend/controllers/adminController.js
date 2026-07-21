const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* =========================
   ADMIN LOGIN
========================= */

const loginAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const admin =
      await Admin.findOne({
        email:
          email.toLowerCase(),
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatches =
      await admin.matchPassword(
        password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token =
      generateToken(admin);

    res.status(200).json({
      success: true,

      message:
        "Admin login successful.",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to login.",
    });
  }
};

module.exports = {
  loginAdmin,
};