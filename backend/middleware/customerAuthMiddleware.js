const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");


/* =========================================
   PROTECT CUSTOMER ROUTES
========================================= */

const protectCustomer =
  async (req, res, next) => {

    try {

      /* =====================================
         GET AUTHORIZATION HEADER
      ===================================== */

      const authHeader =
        req.headers.authorization;


      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Please sign in to continue.",
          });

      }


      /* =====================================
         GET JWT
      ===================================== */

      const token =
        authHeader.split(
          " "
        )[1];


      if (!token) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Authentication token is missing.",
          });

      }


      /* =====================================
         VERIFY JWT
      ===================================== */

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      /* =====================================
         GET CUSTOMER ID FROM TOKEN

         Supports either:
         { id: ... }

         OR

         { userId: ... }
      ===================================== */

      const userId =
        decoded.id ||
        decoded.userId;


      if (!userId) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Invalid authentication token.",
          });

      }


      /* =====================================
         FIND CUSTOMER IN MONGODB
      ===================================== */

      const user =
        await User
          .findById(
            userId
          )
          .select(
            "-password"
          );


      if (!user) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Customer account not found.",
          });

      }


      /* =====================================
         CUSTOMER ROLE CHECK
      ===================================== */

      if (
        user.role &&
        user.role !==
          "customer"
      ) {

        return res
          .status(403)
          .json({
            success: false,

            message:
              "Customer access only.",
          });

      }


      /* =====================================
         ATTACH CUSTOMER TO REQUEST
      ===================================== */

      req.user =
        user;


      next();

    } catch (error) {

      console.error(
        "Customer authentication error:",
        error.message
      );


      /* =====================================
         EXPIRED JWT
      ===================================== */

      if (
        error.name ===
        "TokenExpiredError"
      ) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Your session has expired. Please sign in again.",
          });

      }


      /* =====================================
         INVALID JWT
      ===================================== */

      if (
        error.name ===
        "JsonWebTokenError"
      ) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Invalid authentication token.",
          });

      }


      /* =====================================
         OTHER SERVER ERROR
      ===================================== */

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to authenticate customer.",
        });

    }

  };


/* =========================================
   EXPORT
========================================= */

module.exports = {
  protectCustomer,
};