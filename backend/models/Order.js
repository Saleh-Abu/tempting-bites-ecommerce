const mongoose = require("mongoose");


/* =========================================
   ORDER ITEM SCHEMA
========================================= */

const orderItemSchema =
  new mongoose.Schema(
    {
      cake: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Cake",

        required:
          true,
      },


      name: {
        type:
          String,

        required:
          true,
      },


      image: {
        type:
          String,

        default:
          "",
      },


      weight: {
        type:
          String,

        required:
          true,
      },


      price: {
        type:
          Number,

        required:
          true,
      },


      quantity: {
        type:
          Number,

        required:
          true,

        default:
          1,

        min:
          1,
      },
    },

    {
      _id:
        false,
    }
  );


/* =========================================
   ORDER SCHEMA
========================================= */

const orderSchema =
  new mongoose.Schema(
    {

      /* =====================================
         AUTHENTICATED CUSTOMER ACCOUNT

         Links the order to User._id
      ===================================== */

      customerUser: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        default:
          null,

        index:
          true,

      },


      /* =====================================
         CUSTOMER DETAILS
      ===================================== */

      customer: {

        name: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },


        email: {
          type:
            String,

          default:
            "",

          trim:
            true,

          lowercase:
            true,
        },


        phone: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },

      },


      /* =====================================
         DELIVERY ADDRESS
      ===================================== */

      deliveryAddress: {

        address: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },


        city: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },


        state: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },


        pincode: {
          type:
            String,

          required:
            true,

          trim:
            true,
        },

      },


      /* =====================================
         ORDER ITEMS
      ===================================== */

      items: {

        type:
          [orderItemSchema],

        required:
          true,

        validate: {

          validator:
            function (items) {

              return (
                Array.isArray(
                  items
                ) &&
                items.length >
                  0
              );

            },


          message:
            "Order must contain at least one cake.",

        },

      },


      /* =====================================
         CAKE TYPE
      ===================================== */

      cakeType: {

        type:
          String,

        enum: [
          "Eggless",
          "With Egg",
        ],

        default:
          "Eggless",

      },


      /* =====================================
         CAKE MESSAGE
      ===================================== */

      message: {

        type:
          String,

        default:
          "",

        maxlength:
          40,

        trim:
          true,

      },


      /* =====================================
         DELIVERY DATE
      ===================================== */

      deliveryDate: {

        type:
          String,

        required:
          true,

      },


      /* =====================================
         DELIVERY SLOT
      ===================================== */

      deliverySlot: {

        type:
          String,

        required:
          true,

      },


      /* =====================================
         PROMO CODE
      ===================================== */

      promoCode: {

        type:
          String,

        default:
          "",

        trim:
          true,

        uppercase:
          true,

      },


      /* =====================================
         PRICE DETAILS
      ===================================== */

      subtotal: {

        type:
          Number,

        required:
          true,

        min:
          0,

      },


      deliveryFee: {

        type:
          Number,

        default:
          0,

        min:
          0,

      },


      discount: {

        type:
          Number,

        default:
          0,

        min:
          0,

      },


      totalAmount: {

        type:
          Number,

        required:
          true,

        min:
          0,

      },


      /* =====================================
         PAYMENT METHOD
      ===================================== */

      paymentMethod: {

        type:
          String,

        enum: [
          "COD",
          "RAZORPAY",
        ],

        default:
          "COD",

      },


      /* =====================================
         PAYMENT STATUS
      ===================================== */

      paymentStatus: {

        type:
          String,

        enum: [
          "pending",
          "paid",
          "failed",
        ],

        default:
          "pending",

      },


      /* =====================================
         ORDER STATUS
      ===================================== */

      orderStatus: {

        type:
          String,

        enum: [
          "placed",
          "confirmed",
          "baking",
          "out-for-delivery",
          "delivered",
          "cancelled",
        ],

        default:
          "placed",

        index:
          true,

      },

    },


    /* =====================================
       AUTOMATIC CREATED / UPDATED DATE
    ===================================== */

    {
      timestamps:
        true,
    }

  );


/* =========================================
   INDEX FOR CUSTOMER ORDER HISTORY

   Helps queries such as:
   find all orders for customer
   newest order first
========================================= */

orderSchema.index(
  {
    customerUser:
      1,

    createdAt:
      -1,
  }
);


/* =========================================
   EXPORT ORDER MODEL
========================================= */

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );