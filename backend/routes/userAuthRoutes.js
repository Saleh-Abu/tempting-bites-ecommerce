const express = require("express");

const {
  registerUser,
  loginUser,
  firebaseLogin,
} = require(
  "../controllers/userAuthController"
);

const router = express.Router();


router.post(
  "/register",
  registerUser
);


router.post(
  "/login",
  loginUser
);


router.post(
  "/firebase",
  firebaseLogin
);


module.exports = router;