const Order =
  require("../models/Order");


/* =========================================
   CREATE ORDER
   LOGGED-IN CUSTOMER
========================================= */

const createOrder =
  async (req, res) => {

    try {

      const {
        customer,
        deliveryAddress,
        items,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        paymentMethod,
        deliveryDate,
        deliverySlot,
        promoCode,
        cakeType,
        message,
      } = req.body;


      /* =====================================
         AUTHENTICATED CUSTOMER CHECK
      ===================================== */

      if (
        !req.user ||
        !req.user._id
      ) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              "Please sign in before placing your order.",
          });

      }


      /* =====================================
         BASIC VALIDATION
      ===================================== */

      if (
        !customer ||
        !deliveryAddress ||
        !items ||
        !Array.isArray(
          items
        ) ||
        items.length === 0
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide complete order details.",
          });

      }


      /* =====================================
         CUSTOMER VALIDATION
      ===================================== */

      if (
        !customer.name ||
        !customer.phone
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Customer name and phone number are required.",
          });

      }


      /* =====================================
         ADDRESS VALIDATION
      ===================================== */

      if (
        !deliveryAddress.address ||
        !deliveryAddress.city ||
        !deliveryAddress.state ||
        !deliveryAddress.pincode
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide a complete delivery address.",
          });

      }


      /* =====================================
         DELIVERY AREA VALIDATION

         Tempting Bites currently delivers
         to PIN code 410206.
      ===================================== */

      if (
        String(
          deliveryAddress.pincode
        ).trim() !== "410206"
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Sorry, we currently deliver only to PIN code 410206.",
          });

      }


      /* =====================================
         DELIVERY VALIDATION
      ===================================== */

      if (
        !deliveryDate ||
        !deliverySlot
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please select a delivery date and time slot.",
          });

      }


      /* =====================================
         ITEM VALIDATION
      ===================================== */

      const invalidItem =
        items.some(
          (item) =>
            !item.cake ||
            !item.name ||
            !item.weight ||
            item.price ===
              undefined ||
            item.quantity ===
              undefined
        );


      if (
        invalidItem
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "One or more cake items have incomplete details.",
          });

      }


      /* =====================================
         PRICE VALIDATION
      ===================================== */

      if (
        subtotal === undefined ||
        totalAmount === undefined
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Order amount is missing.",
          });

      }


      /* =====================================
         CREATE ORDER
      ===================================== */

      const order =
        await Order.create({

          /* =================================
             LINK ORDER TO CUSTOMER ACCOUNT
          ================================= */

          customerUser:
            req.user._id,


          /* =================================
             CUSTOMER DETAILS
          ================================= */

          customer: {

            name:
              customer.name,

            email:
              customer.email ||
              req.user.email ||
              "",

            phone:
              customer.phone,

          },


          /* =================================
             DELIVERY ADDRESS
          ================================= */

          deliveryAddress: {

            address:
              deliveryAddress.address,

            city:
              deliveryAddress.city,

            state:
              deliveryAddress.state,

            pincode:
              deliveryAddress.pincode,

          },


          /* =================================
             CAKE ITEMS
          ================================= */

          items,


          /* =================================
             CAKE PREFERENCE
          ================================= */

          cakeType:
            cakeType ||
            "Eggless",


          message:
            message ||
            "",


          /* =================================
             PRICE DETAILS
          ================================= */

          subtotal,


          deliveryFee:
            deliveryFee ||
            0,


          discount:
            discount ||
            0,


          totalAmount,


          /* =================================
             PAYMENT
          ================================= */

          paymentMethod:
            paymentMethod ||
            "COD",


          /* =================================
             DELIVERY
          ================================= */

          deliveryDate,


          deliverySlot,


          /* =================================
             PROMO
          ================================= */

          promoCode:
            promoCode ||
            "",

        });


      /* =====================================
         SUCCESS RESPONSE
      ===================================== */

      return res
        .status(201)
        .json({

          success: true,

          message:
            "Order placed successfully!",

          order,

        });

    } catch (error) {

      console.error(
        "Create order error:",
        error
      );


      /* =====================================
         MONGOOSE VALIDATION ERROR
      ===================================== */

      if (
        error.name ===
        "ValidationError"
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              error.message,

          });

      }


      /* =====================================
         INVALID OBJECT ID
      ===================================== */

      if (
        error.name ===
        "CastError"
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "One or more order items are invalid.",

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to place order. Please try again.",

        });

    }

  };


/* =========================================
   GET MY ORDERS
   LOGGED-IN CUSTOMER ONLY
========================================= */

const getMyOrders =
  async (req, res) => {

    try {

      /* =====================================
         AUTHENTICATED CUSTOMER CHECK
      ===================================== */

      if (
        !req.user ||
        !req.user._id
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              "Please sign in to view your orders.",

          });

      }


      /* =====================================
         FIND ONLY THIS CUSTOMER'S ORDERS
      ===================================== */

      const orders =
        await Order
          .find({
            customerUser:
              req.user._id,
          })

          .populate(
            "items.cake",
            "name image"
          )

          .sort({
            createdAt:
              -1,
          });


      /* =====================================
         SUCCESS
      ===================================== */

      return res
        .status(200)
        .json({

          success: true,

          count:
            orders.length,

          orders,

        });

    } catch (error) {

      console.error(
        "Get my orders error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to fetch your orders.",

        });

    }

  };


/* =========================================
   GET ALL ORDERS
   ADMIN ONLY
========================================= */

const getOrders =
  async (
    req,
    res
  ) => {

    try {

      const orders =
        await Order
          .find()

          .populate(
            "customerUser",
            "name email phone"
          )

          .sort({
            createdAt:
              -1,
          });


      return res
        .status(200)
        .json({

          success: true,

          count:
            orders.length,

          orders,

        });

    } catch (error) {

      console.error(
        "Get orders error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to fetch orders.",

        });

    }

  };


/* =========================================
   GET SINGLE ORDER
   ADMIN ONLY
========================================= */

const getOrderById =
  async (
    req,
    res
  ) => {

    try {

      const order =
        await Order
          .findById(
            req.params.id
          )

          .populate(
            "customerUser",
            "name email phone"
          );


      if (
        !order
      ) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Order not found.",

          });

      }


      return res
        .status(200)
        .json({

          success: true,

          order,

        });

    } catch (error) {

      console.error(
        "Get order error:",
        error
      );


      /* =====================================
         INVALID MONGODB OBJECT ID
      ===================================== */

      if (
        error.name ===
        "CastError"
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid order ID.",

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to fetch order.",

        });

    }

  };


/* =========================================
   UPDATE ORDER STATUS
   ADMIN ONLY
========================================= */

const updateOrderStatus =
  async (
    req,
    res
  ) => {

    try {

      const {
        orderStatus,
      } = req.body;


      /* =====================================
         ALLOWED ORDER STATUSES
      ===================================== */

      const allowedStatuses = [

        "placed",

        "confirmed",

        "baking",

        "out-for-delivery",

        "delivered",

        "cancelled",

      ];


      /* =====================================
         VALIDATE STATUS
      ===================================== */

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid order status.",

          });

      }


      /* =====================================
         FIND ORDER
      ===================================== */

      const order =
        await Order.findById(
          req.params.id
        );


      if (
        !order
      ) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Order not found.",

          });

      }


      /* =====================================
         UPDATE ORDER STATUS
      ===================================== */

      order.orderStatus =
        orderStatus;


      await order.save();


      /* =====================================
         SUCCESS
      ===================================== */

      return res
        .status(200)
        .json({

          success: true,

          message:
            "Order status updated successfully.",

          order,

        });

    } catch (error) {

      console.error(
        "Update order status error:",
        error
      );


      /* =====================================
         INVALID MONGODB OBJECT ID
      ===================================== */

      if (
        error.name ===
        "CastError"
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid order ID.",

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update order status.",

        });

    }

  };


/* =========================================
   EXPORT CONTROLLERS
========================================= */

module.exports = {

  createOrder,

  getMyOrders,

  getOrders,

  getOrderById,

  updateOrderStatus,

};