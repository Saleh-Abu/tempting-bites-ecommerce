const jwt = require(
  "jsonwebtoken"
);

const User = require(
  "../models/User"
);


/* =========================================
   PROTECT CUSTOMER ROUTES
========================================= */

const protectUser = async (
  req,
  res,
  next
) => {
  try {
    let token;


    /* GET BEARER TOKEN */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }


    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Please login to continue.",
        });
    }


    /* VERIFY TOKEN */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    /*
      Prevent an admin token from
      being used as a customer token.
    */

    if (
      decoded.role !==
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


    /* FIND USER */

    const user =
      await User.findById(
        decoded.id
      );


    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "User account not found.",
        });
    }


    if (!user.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Your account is disabled.",
        });
    }


    /* ATTACH USER */

    req.user = user;


    next();

  } catch (error) {
    console.error(
      "Customer auth error:",
      error.message
    );


    return res
      .status(401)
      .json({
        success: false,
        message:
          "Invalid or expired login session.",
      });
  }
};


module.exports = {
  protectUser,
};