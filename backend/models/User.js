const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    /* =========================================
       FIREBASE USER ID
    ========================================= */

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    /* =========================================
       LOGIN PROVIDER
    ========================================= */

    authProvider: {
      type: String,

      enum: [
        "email",
        "google",
        "phone",
      ],

      default: "email",
    },

    /* =========================================
       PROFILE IMAGE
    ========================================= */

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,

      enum: ["customer"],

      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================
   HASH PASSWORD
========================================= */

userSchema.pre(
  "save",
  async function (next) {

    /*
      Google/Phone users may not
      have a password.
    */

    if (
      !this.password ||
      !this.isModified("password")
    ) {
      return next();
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

    next();
  }
);


/* =========================================
   COMPARE PASSWORD
========================================= */

userSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {

    if (!this.password) {
      return false;
    }

    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


module.exports =
  mongoose.model(
    "User",
    userSchema
  );