const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  firebaseAdminAuth,
} = require("../config/firebaseAdmin");


/* =========================================
   GENERATE CUSTOMER JWT
========================================= */

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      role: "customer",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


/* =========================================
   REGISTER CUSTOMER
   EMAIL + PASSWORD
========================================= */

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;


    /* =====================================
       VALIDATION
    ===================================== */

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }


    /* =====================================
       NORMALIZE EMAIL
    ===================================== */

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    /* =====================================
       CHECK EXISTING CUSTOMER
    ===================================== */

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }


    /* =====================================
       CHECK PHONE IF PROVIDED
    ===================================== */

    if (phone) {
      const existingPhone =
        await User.findOne({
          phone: phone.trim(),
        });


      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message:
            "An account with this mobile number already exists.",
        });
      }
    }


    /* =====================================
       CREATE CUSTOMER

       Password hashing happens inside
       User model pre-save middleware.
    ===================================== */

    const user =
      await User.create({
        name: name.trim(),

        email:
          normalizedEmail,

        phone:
          phone
            ? phone.trim()
            : undefined,

        password,

        authProvider:
          "email",
      });


    /* =====================================
       GENERATE JWT
    ===================================== */

    const token =
      generateToken(
        user._id
      );


    /* =====================================
       RESPONSE
    ===================================== */

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      token,

      user: {
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email || "",

        phone:
          user.phone || "",

        avatar:
          user.avatar || "",

        role:
          user.role,

        authProvider:
          user.authProvider,
      },
    });

  } catch (error) {
    console.error(
      "Register user error:",
      error
    );


    /* =====================================
       MONGODB DUPLICATE VALUE
    ===================================== */

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "An account with these details already exists.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to create account.",
    });
  }
};


/* =========================================
   CUSTOMER LOGIN
   EMAIL + PASSWORD
========================================= */

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;


    /* =====================================
       VALIDATION
    ===================================== */

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }


    /* =====================================
       FIND CUSTOMER

       Password uses select:false in
       User model, so explicitly include it.
    ===================================== */

    const user =
      await User.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      }).select("+password");


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }


    /* =====================================
       ACTIVE ACCOUNT CHECK
    ===================================== */

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently disabled.",
      });
    }


    /* =====================================
       GOOGLE / PHONE ONLY ACCOUNT
    ===================================== */

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          user.authProvider === "google"
            ? "This account uses Google Sign-In."
            : user.authProvider === "phone"
              ? "This account uses mobile OTP Sign-In."
              : "Password login is not available for this account.",
      });
    }


    /* =====================================
       VERIFY PASSWORD
    ===================================== */

    const passwordMatches =
      await user.comparePassword(
        password
      );


    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }


    /* =====================================
       GENERATE JWT
    ===================================== */

    const token =
      generateToken(
        user._id
      );


    /* =====================================
       RESPONSE
    ===================================== */

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email || "",

        phone:
          user.phone || "",

        avatar:
          user.avatar || "",

        role:
          user.role,

        authProvider:
          user.authProvider,
      },
    });

  } catch (error) {
    console.error(
      "Login user error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to login.",
    });
  }
};


/* =========================================
   FIREBASE CUSTOMER LOGIN

   Supports:
   - Google Sign-In
   - Phone OTP
========================================= */

const firebaseLogin = async (req, res) => {
  try {
    const {
      idToken,
    } = req.body;


    /* =====================================
       TOKEN REQUIRED
    ===================================== */

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase authentication token is required.",
      });
    }


    /* =====================================
       VERIFY FIREBASE ID TOKEN
    ===================================== */

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(
        idToken
      );


    const {
      uid,
      email,
      name,
      picture,
      phone_number,
      firebase,
    } = decodedToken;


    /* =====================================
       DETERMINE LOGIN PROVIDER
    ===================================== */

    const firebaseProvider =
      firebase?.sign_in_provider;


    let authProvider =
      "google";


    if (
      firebaseProvider ===
      "phone"
    ) {
      authProvider =
        "phone";
    }


    /* =====================================
       NORMALIZE DATA
    ===================================== */

    const normalizedEmail =
      email
        ? email
            .toLowerCase()
            .trim()
        : "";


    const normalizedPhone =
      phone_number
        ? phone_number.replace(
            /^\+91/,
            ""
          )
        : "";


    /* =====================================
       FIRST:
       FIND CUSTOMER BY FIREBASE UID
    ===================================== */

    let user =
      await User.findOne({
        firebaseUid:
          uid,
      });


    /* =====================================
       SECOND:
       FIND EXISTING CUSTOMER BY EMAIL

       This prevents creating another account
       if the customer previously registered
       using the same email.
    ===================================== */

    if (
      !user &&
      normalizedEmail
    ) {
      user =
        await User.findOne({
          email:
            normalizedEmail,
        });
    }


    /* =====================================
       THIRD:
       FIND EXISTING CUSTOMER BY PHONE
    ===================================== */

    if (
      !user &&
      normalizedPhone
    ) {
      user =
        await User.findOne({
          phone:
            normalizedPhone,
        });
    }


    /* =====================================
       CREATE NEW CUSTOMER
    ===================================== */

    if (!user) {
      user =
        await User.create({
          name:
            name ||
            "Tempting Bites Customer",

          email:
            normalizedEmail ||
            undefined,

          phone:
            normalizedPhone ||
            undefined,

          firebaseUid:
            uid,

          authProvider,

          avatar:
            picture || "",

          role:
            "customer",

          isActive:
            true,
        });
    }


    /* =====================================
       EXISTING CUSTOMER:
       LINK FIREBASE ACCOUNT
    ===================================== */

    else {

      /*
        Don't overwrite another Firebase UID
        if the account is already linked.
      */

      if (
        !user.firebaseUid
      ) {
        user.firebaseUid =
          uid;
      }


      /* ===================================
         EMAIL
      =================================== */

      if (
        !user.email &&
        normalizedEmail
      ) {
        user.email =
          normalizedEmail;
      }


      /* ===================================
         PHONE
      =================================== */

      if (
        !user.phone &&
        normalizedPhone
      ) {
        user.phone =
          normalizedPhone;
      }


      /* ===================================
         PROFILE IMAGE
      =================================== */

      if (
        picture &&
        !user.avatar
      ) {
        user.avatar =
          picture;
      }


      /* ===================================
         CUSTOMER NAME

         Keep their existing name if they
         already have one.
      =================================== */

      if (
        !user.name &&
        name
      ) {
        user.name =
          name;
      }


      /*
        We update provider only when the
        account wasn't originally created
        with password authentication.

        This avoids unnecessarily changing
        an existing email account's provider.
      */

      if (
        user.authProvider !==
        "email"
      ) {
        user.authProvider =
          authProvider;
      }


      await user.save();
    }


    /* =====================================
       ACCOUNT STATUS
    ===================================== */

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently disabled.",
      });
    }


    /* =====================================
       CREATE TEMPTING BITES JWT
    ===================================== */

    const token =
      generateToken(
        user._id
      );


    /* =====================================
       SUCCESS RESPONSE
    ===================================== */

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email || "",

        phone:
          user.phone || "",

        avatar:
          user.avatar || "",

        role:
          user.role,

        authProvider:
          user.authProvider,
      },
    });

  } catch (error) {
    console.error(
      "Firebase login error:",
      error
    );


    /* =====================================
       INVALID FIREBASE TOKEN
    ===================================== */

    if (
      error.code &&
      error.code.startsWith(
        "auth/"
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication session.",
      });
    }


    /* =====================================
       DUPLICATE DATABASE VALUE
    ===================================== */

    if (
      error.code ===
      11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This account is already connected to another login.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to complete authentication.",
    });
  }
};


/* =========================================
   EXPORTS
========================================= */

module.exports = {
  registerUser,
  loginUser,
  firebaseLogin,
};