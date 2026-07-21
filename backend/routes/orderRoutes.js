const express =
  require("express");


/* =========================================
   ORDER CONTROLLERS
========================================= */

const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
} =
  require(
    "../controllers/orderController"
  );


/* =========================================
   ADMIN AUTH MIDDLEWARE
========================================= */

const {
  protectAdmin,
} =
  require(
    "../middleware/adminAuth"
  );


/* =========================================
   CUSTOMER AUTH MIDDLEWARE
========================================= */

const {
  protectCustomer,
} =
  require(
    "../middleware/customerAuthMiddleware"
  );


/* =========================================
   ROUTER
========================================= */

const router =
  express.Router();


/* =========================================
   CUSTOMER ROUTES
========================================= */


/*
  PLACE ORDER

  Customer must be logged in.

  POST:
  /api/orders

  Flow:

  Customer JWT
      ↓
  protectCustomer
      ↓
  req.user
      ↓
  createOrder
*/

router.post(
  "/",
  protectCustomer,
  createOrder
);


/*
  MY ORDERS

  Returns ONLY orders belonging
  to the currently logged-in customer.

  GET:
  /api/orders/my-orders
*/

router.get(
  "/my-orders",
  protectCustomer,
  getMyOrders
);


/* =========================================
   ADMIN ROUTES
========================================= */


/*
  GET ALL ORDERS

  Admin only.

  GET:
  /api/orders
*/

router.get(
  "/",
  protectAdmin,
  getOrders
);


/*
  GET SINGLE ORDER

  Admin only.

  GET:
  /api/orders/:id
*/

router.get(
  "/:id",
  protectAdmin,
  getOrderById
);


/*
  UPDATE ORDER STATUS

  Admin only.

  PATCH:
  /api/orders/:id/status
*/

router.patch(
  "/:id/status",
  protectAdmin,
  updateOrderStatus
);


/* =========================================
   EXPORT ROUTER
========================================= */

module.exports =
  router;