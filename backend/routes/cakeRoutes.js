const express =
  require("express");

const {
  getCakes,
  getCakeById,
  createCake,
  updateCake,
  updateCakeAvailability,
  deleteCake,
} = require(
  "../controllers/cakeController"
);

const {
  protectAdmin,
} = require(
  "../middleware/adminAuth"
);

const router =
  express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Customers can see cakes

router.get(
  "/",
  getCakes
);

router.get(
  "/:id",
  getCakeById
);

/* =========================
   ADMIN ROUTES
========================= */

// Add new cake

router.post(
  "/",
  protectAdmin,
  createCake
);

// Edit cake

router.put(
  "/:id",
  protectAdmin,
  updateCake
);

// Mark available/out of stock

router.patch(
  "/:id/availability",
  protectAdmin,
  updateCakeAvailability
);

// Delete cake

router.delete(
  "/:id",
  protectAdmin,
  deleteCake
);

module.exports = router;