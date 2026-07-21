import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  MapPin,
  CalendarDays,
  Clock3,
  CreditCard,
  Banknote,
  ShoppingBag,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Phone,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  clearCart,
} from "../features/cartSlice";
import {
  useAuth,
} from "../context/AuthContext";


/* =========================================
   CONFIGURATION
========================================= */

const ORDER_API =
  "http://localhost:5000/api/orders";

const ALLOWED_PINCODE =
  "410206";

const DELIVERY_CHARGE =
  79;


/* =========================================
   CHECKOUT PAGE
========================================= */

function CheckoutPage() {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  /* =========================================
     CUSTOMER AUTHENTICATION
  ========================================= */

  const {
    user,
    token,
  } = useAuth();


  /* =========================================
     CART
  ========================================= */

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );


  /* =========================================
     CUSTOMER FORM
  ========================================= */

  const [form, setForm] =
    useState({

      name: "",

      phone: "",

      email: "",

      address: "",

      city:
        "Panvel",

      state:
        "Maharashtra",

      pincode:
        localStorage.getItem(
          "temptingBitesPincode"
        ) ||
        ALLOWED_PINCODE,

    });


  /* =========================================
     DELIVERY
  ========================================= */

  const [
    deliveryDate,
    setDeliveryDate,
  ] = useState("");


  const [
    deliverySlot,
    setDeliverySlot,
  ] = useState("");


  /* =========================================
     PAYMENT

     COD only for now.
     Razorpay can be enabled later.
  ========================================= */

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");


  /* =========================================
     PROMO
  ========================================= */

  const [
    promoCode,
    setPromoCode,
  ] = useState("");


  const [
    promoMessage,
    setPromoMessage,
  ] = useState("");


  const [
    discount,
    setDiscount,
  ] = useState(0);


  /* =========================================
     ORDER STATE
  ========================================= */

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);


  const [
    orderError,
    setOrderError,
  ] = useState("");


  const [
    orderSuccess,
    setOrderSuccess,
  ] = useState(false);


  const [
    createdOrder,
    setCreatedOrder,
  ] = useState(null);


  /* =========================================
     PRICES
  ========================================= */

  const subtotal =
    useMemo(
      () =>
        cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.price ||
                0
            ) *
              Number(
                item.quantity ||
                  1
              ),
          0
        ),
      [
        cartItems,
      ]
    );


  /*
    Delivery charge is fixed
    for now.

    If the cart is empty,
    don't show a delivery charge.
  */

  const deliveryCharge =
    cartItems.length > 0
      ? DELIVERY_CHARGE
      : 0;


  const total =
    Math.max(
      0,
      subtotal +
        deliveryCharge -
        discount
    );


  /* =========================================
     PINCODE VALIDATION
  ========================================= */

  const isValidPincode =
    form.pincode.trim() ===
    ALLOWED_PINCODE;


  /* =========================================
     MINIMUM DELIVERY DATE
  ========================================= */

  const minimumDeliveryDate =
    useMemo(() => {

      const today =
        new Date();

      const year =
        today.getFullYear();

      const month =
        String(
          today.getMonth() +
            1
        ).padStart(
          2,
          "0"
        );

      const day =
        String(
          today.getDate()
        ).padStart(
          2,
          "0"
        );

      return `${year}-${month}-${day}`;

    }, []);


  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      /*
        PHONE:
        Keep digits only
        and maximum 10 digits.
      */

      if (
        name ===
        "phone"
      ) {

        const phone =
          value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              10
            );


        setForm(
          (previous) => ({
            ...previous,
            phone,
          })
        );


        return;

      }


      /*
        PINCODE:
        Keep digits only
        and maximum 6 digits.
      */

      if (
        name ===
        "pincode"
      ) {

        const pincode =
          value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              6
            );


        setForm(
          (previous) => ({
            ...previous,
            pincode,
          })
        );


        return;

      }


      setForm(
        (previous) => ({
          ...previous,

          [name]:
            value,
        })
      );

    };


  /* =========================================
     PROMO CODE
  ========================================= */

  const applyPromo =
    () => {

      const code =
        promoCode
          .trim()
          .toUpperCase();


      if (!code) {

        setDiscount(
          0
        );

        setPromoMessage(
          "Enter a promo code first."
        );

        return;

      }


      /* =====================================
         FIRSTBITE
         10% OFF, MAX ₹200
      ===================================== */

      if (
        code ===
        "FIRSTBITE"
      ) {

        const promoDiscount =
          Math.min(
            Math.round(
              subtotal *
                0.1
            ),
            200
          );


        setDiscount(
          promoDiscount
        );


        setPromoMessage(
          `FIRSTBITE applied! You saved ₹${promoDiscount}.`
        );


        return;

      }


      /* =====================================
         SWEET3
         LOWEST PRICED CAKE FREE
      ===================================== */

      if (
        code ===
        "SWEET3"
      ) {

        const prices =
          cartItems.flatMap(
            (item) =>
              Array(
                Number(
                  item.quantity ||
                    1
                )
              ).fill(
                Number(
                  item.price ||
                    0
                )
              )
          );


        if (
          prices.length <
          3
        ) {

          setDiscount(
            0
          );


          setPromoMessage(
            "Add at least 3 cakes to use SWEET3."
          );


          return;

        }


        const lowestPrice =
          Math.min(
            ...prices
          );


        setDiscount(
          lowestPrice
        );


        setPromoMessage(
          `SWEET3 applied! Your lowest-priced cake worth ₹${lowestPrice} is free.`
        );


        return;

      }


      /* INVALID */

      setDiscount(
        0
      );


      setPromoMessage(
        "This promo code is not valid."
      );

    };


  /* =========================================
     VALIDATE ORDER
  ========================================= */

  const validateOrder =
    () => {

      /* CART */

      if (
        cartItems.length ===
        0
      ) {

        return "Your cart is empty.";

      }


      /* REQUIRED DETAILS */

      if (
        !form.name.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim()
      ) {

        return "Please complete all required delivery details.";

      }


      /* PHONE */

      if (
        !/^[6-9]\d{9}$/.test(
          form.phone
        )
      ) {

        return "Please enter a valid 10-digit Indian mobile number.";

      }


      /* EMAIL */

      if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim()
        )
      ) {

        return "Please enter a valid email address.";

      }


      /* PINCODE */

      if (
        !isValidPincode
      ) {

        return "Sorry, Tempting Bites currently delivers only in Panvel / India Bulls – PIN 410206.";

      }


      /* DELIVERY */

      if (
        !deliveryDate ||
        !deliverySlot
      ) {

        return "Please select your delivery date and time.";

      }


      /* PAST DATE */

      if (
        deliveryDate <
        minimumDeliveryDate
      ) {

        return "Please select a valid delivery date.";

      }


      /* PAYMENT */

      if (
        paymentMethod !==
        "cod"
      ) {

        return "Online payment is not available yet. Please select Cash on Delivery.";

      }


      return "";

    };


 /* =========================================
   PLACE REAL ORDER
========================================= */

const handlePlaceOrder =
  async () => {

    setOrderError("");


    /* =====================================
       CUSTOMER MUST BE LOGGED IN
    ===================================== */

    if (!user || !token) {

      setOrderError(
        "Please sign in before placing your order."
      );

      return;
    }


    /* =====================================
       VALIDATE ORDER
    ===================================== */

    const validationError =
      validateOrder();


    if (validationError) {

      setOrderError(
        validationError
      );

      return;
    }


    try {

      setPlacingOrder(true);


      /* =====================================
         PREPARE ORDER ITEMS
      ===================================== */

      const orderItems =
        cartItems.map(
          (item) => ({

            cake:
              item.id ||
              item._id,

            name:
              item.name,

            image:
              item.image ||
              "",

            weight:
              item.weight,

            price:
              Number(
                item.price ||
                0
              ),

            quantity:
              Number(
                item.quantity ||
                1
              ),

          })
        );


      /* =====================================
         ORDER-LEVEL CAKE CUSTOMIZATION
      ===================================== */

      const firstItem =
        cartItems[0];


      const cakeType =
        firstItem?.cakeType ||
        "Eggless";


      const message =
        firstItem?.message ||
        "";


      /* =====================================
         BUILD ORDER DATA
      ===================================== */

      const orderData = {

        customer: {

          name:
            form.name.trim(),

          email:
            form.email
              .trim(),

          phone:
            form.phone
              .trim(),

        },


        deliveryAddress: {

          address:
            form.address
              .trim(),

          city:
            form.city
              .trim(),

          state:
            form.state
              .trim(),

          pincode:
            form.pincode
              .trim(),

        },


        items:
          orderItems,


        cakeType,

        message,


        deliveryDate,

        deliverySlot,


        promoCode:
          promoCode
            .trim()
            .toUpperCase(),


        subtotal:
          Number(subtotal),


        deliveryFee:
          Number(
            deliveryCharge
          ),


        discount:
          Number(discount),


        totalAmount:
          Number(total),


        paymentMethod:
          "COD",

      };


      /* =====================================
         SEND AUTHENTICATED ORDER REQUEST
      ===================================== */

      const response =
        await axios.post(

          ORDER_API,

          orderData,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


      /* =====================================
         SUCCESS
      ===================================== */

      if (
        response.data
          ?.success
      ) {

        setCreatedOrder(
          response.data.order
        );


        setOrderSuccess(
          true
        );


        localStorage.setItem(
          "temptingBitesPincode",
          ALLOWED_PINCODE
        );


        dispatch(
          clearCart()
        );

        return;
      }


      /* =====================================
         UNEXPECTED RESPONSE
      ===================================== */

      setOrderError(
        response.data
          ?.message ||
          "We couldn't place your order. Please try again."
      );

    } catch (error) {

      console.error(
        "Order error:",
        error
      );


      /* =====================================
         LOGIN / TOKEN ERROR
      ===================================== */

      if (
        error.response
          ?.status === 401
      ) {

        setOrderError(
          error.response
            ?.data
            ?.message ||
            "Your session has expired. Please sign in again."
        );

        return;
      }


      /* =====================================
         OTHER BACKEND ERROR
      ===================================== */

      setOrderError(
        error.response
          ?.data
          ?.message ||
          "We couldn't place your order. Please try again."
      );

    } finally {

      setPlacingOrder(
        false
      );

    }

  };


  /* =========================================
     SUCCESS SCREEN
  ========================================= */

  if (
    orderSuccess
  ) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fff8f5]
          px-4
          py-16

          sm:px-6
          sm:py-20
        "
      >

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}

          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="
            relative
            w-full
            max-w-xl
            overflow-hidden
            rounded-[2rem]
            bg-white
            p-6
            text-center
            shadow-[0_30px_100px_rgba(80,30,45,0.15)]

            sm:rounded-[3rem]
            sm:p-10

            md:p-14
          "
        >


          {/* DECORATION */}

          <motion.div

            animate={{
              scale: [
                1,
                1.2,
                1,
              ],
            }}

            transition={{
              duration: 5,
              repeat:
                Infinity,
            }}

            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-52
              w-52
              rounded-full
              bg-pink-100
              blur-3xl
            "
          />


          {/* ICON */}

          <motion.div

            initial={{
              scale: 0,
              rotate: -90,
            }}

            animate={{
              scale: 1,
              rotate: 0,
            }}

            transition={{
              type:
                "spring",
              delay: 0.2,
            }}

            className="
              relative
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-green-50
              text-green-500

              sm:h-24
              sm:w-24
            "
          >

            <CheckCircle2
              size={44}
            />

          </motion.div>


          <motion.p

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            transition={{
              delay: 0.3,
            }}

            className="
              mt-7
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-pink-500

              sm:mt-8
              sm:text-xs
              sm:tracking-[0.3em]
            "
          >
            Sweet Success
          </motion.p>


          <h1
            className="
              mt-3
              font-serif
              text-3xl
              font-bold
              text-[#542432]

              sm:text-4xl

              md:text-5xl
            "
          >
            Order Confirmed!
          </h1>


          <p
            className="
              mx-auto
              mt-4
              max-w-md
              text-sm
              leading-6
              text-gray-500

              sm:text-base
              sm:leading-7
            "
          >

            Thank you,{" "}

            <strong>
              {createdOrder
                ?.customer
                ?.name ||
                form.name}
            </strong>

            ! Your delicious
            Tempting Bites order
            has been received.

          </p>


          {/* ORDER ID */}

          <div
            className="
              mt-7
              rounded-2xl
              bg-pink-50
              p-4

              sm:mt-8
              sm:p-5
            "
          >

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-pink-400

                sm:text-xs
              "
            >
              Order ID
            </p>


            <p
              className="
                mt-2
                break-all
                font-mono
                text-xs
                font-bold
                text-[#542432]

                sm:text-sm
              "
            >
              {createdOrder
                ?._id ||
                "Confirmed"}
            </p>

          </div>


          {/* DELIVERY */}

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-2

              sm:mt-6
              sm:gap-3
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-pink-100
                p-3

                sm:p-4
              "
            >

              <CalendarDays
                size={19}
                className="
                  mx-auto
                  text-pink-500
                "
              />


              <p
                className="
                  mt-2
                  text-[10px]
                  text-gray-400

                  sm:text-xs
                "
              >
                Delivery Date
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  font-bold
                  text-[#542432]

                  sm:text-sm
                "
              >
                {deliveryDate}
              </p>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-pink-100
                p-3

                sm:p-4
              "
            >

              <Clock3
                size={19}
                className="
                  mx-auto
                  text-pink-500
                "
              />


              <p
                className="
                  mt-2
                  text-[10px]
                  text-gray-400

                  sm:text-xs
                "
              >
                Delivery Time
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  font-bold
                  text-[#542432]

                  sm:text-sm
                "
              >
                {deliverySlot}
              </p>

            </div>

          </div>


          {/* LOCATION */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#fff8f5]
              px-4
              py-3
              text-xs
              font-semibold
              text-[#704653]
            "
          >

            <MapPin
              size={15}
              className="
                shrink-0
                text-pink-500
              "
            />

            Panvel / India Bulls •
            PIN 410206

          </div>


          {/* TOTAL */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              rounded-2xl
              bg-[#542432]
              px-5
              py-4
              text-white

              sm:mt-6
              sm:px-6
              sm:py-5
            "
          >

            <span
              className="
                text-sm

                sm:text-base
              "
            >
              Order Total
            </span>


            <span
              className="
                text-xl
                font-black

                sm:text-2xl
              "
            >
              ₹
              {createdOrder
                ?.totalAmount ??
                total}
            </span>

          </div>


          {/* CONTINUE */}

          <motion.button

            type="button"

            whileHover={{
              scale: 1.03,
            }}

            whileTap={{
              scale: 0.97,
            }}

            onClick={() =>
              navigate("/")
            }

            className="
              mt-7
              min-h-13
              w-full
              rounded-full
              bg-pink-500
              px-5
              py-4
              text-sm
              font-bold
              text-white
              shadow-lg

              sm:mt-8
            "
          >
            Back to Tempting Bites
          </motion.button>

        </motion.div>

      </main>

    );

  }


  /* =========================================
     CHECKOUT PAGE
  ========================================= */

  return (

    <main
      className="
        min-h-screen
        bg-[#fff8f5]
        pb-16
        pt-28

        sm:pb-20
        sm:pt-32
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-4

          sm:px-6
        "
      >


        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            mb-8

            sm:mb-10
          "
        >

          <Link
            to="/cakes"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-bold
              text-pink-500

              sm:text-sm
            "
          >

            <ArrowLeft
              size={17}
            />

            Continue Shopping

          </Link>


          <h1
            className="
              mt-5
              max-w-3xl
              font-serif
              text-3xl
              font-bold
              leading-tight
              text-[#542432]

              sm:text-4xl

              md:text-5xl
            "
          >
            Complete Your Sweet
            Order
          </h1>


          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-gray-500

              sm:text-base
            "
          >
            Just a few details and
            your Tempting Bites order
            will be ready.
          </p>


          {/* DELIVERY RESTRICTION */}

          <div
            className="
              mt-5
              flex
              max-w-xl
              items-start
              gap-3
              rounded-2xl
              border
              border-pink-100
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-pink-50
                text-pink-500
              "
            >

              <MapPin
                size={18}
              />

            </div>


            <div>

              <p
                className="
                  text-xs
                  font-bold
                  text-[#542432]

                  sm:text-sm
                "
              >
                Local Delivery Only
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-gray-500
                "
              >
                We currently deliver
                only in Panvel /
                India Bulls, PIN
                410206.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            CHECKOUT GRID
        ===================================== */}

        <div
          className="
            grid
            gap-7

            lg:grid-cols-[minmax(0,1fr)_400px]

            xl:grid-cols-[minmax(0,1fr)_420px]
            xl:gap-8
          "
        >


          {/* =================================
              LEFT
          ================================= */}

          <div
            className="
              min-w-0
              space-y-5

              sm:space-y-7
            "
          >


            {/* =================================
                DELIVERY DETAILS
            ================================= */}

            <CheckoutCard
              icon={MapPin}
              number="01"
              title="Delivery Details"
            >

              {/* DELIVERY PIN NOTICE */}

              <div
                className={`
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  p-4

                  ${
                    isValidPincode
                      ? "border-green-100 bg-green-50"
                      : "border-red-100 bg-red-50"
                  }
                `}
              >

                {isValidPincode ? (

                  <CheckCircle2
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-green-500
                    "
                  />

                ) : (

                  <AlertCircle
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-red-500
                    "
                  />

                )}


                <div>

                  <p
                    className={`
                      text-xs
                      font-bold

                      ${
                        isValidPincode
                          ? "text-green-700"
                          : "text-red-600"
                      }
                    `}
                  >

                    {isValidPincode
                      ? "Delivery available"
                      : "Outside delivery area"}

                  </p>


                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-gray-500
                    "
                  >
                    Tempting Bites
                    currently delivers
                    only in Panvel /
                    India Bulls –
                    PIN 410206.
                  </p>

                </div>

              </div>


              <div
                className="
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >

                <Input
                  name="name"
                  autoComplete="name"
                  placeholder="Full Name *"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                />


                <div
                  className="
                    relative
                  "
                >

                  <Phone
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />


                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Mobile Number *"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      min-h-13
                      w-full
                      rounded-2xl
                      border
                      border-pink-100
                      bg-[#fffafa]
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      transition

                      focus:border-pink-400
                      focus:ring-4
                      focus:ring-pink-100/50
                    "
                  />

                </div>


                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email (optional)"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                />


                <div>

                  <Input
                    name="pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="PIN Code *"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                  />


                  {form.pincode &&
                    !isValidPincode && (

                    <p
                      className="
                        mt-2
                        pl-1
                        text-[10px]
                        font-semibold
                        text-red-500
                      "
                    >
                      Delivery is
                      available only
                      for PIN 410206.
                    </p>

                  )}

                </div>

              </div>


              <textarea
                name="address"
                value={
                  form.address
                }
                onChange={
                  handleChange
                }
                autoComplete="street-address"
                placeholder="House / Flat No., Building, Street *"
                className="
                  mt-4
                  min-h-28
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-pink-100
                  bg-[#fffafa]
                  px-4
                  py-4
                  text-sm
                  outline-none
                  transition

                  focus:border-pink-400
                  focus:ring-4
                  focus:ring-pink-100/50

                  sm:px-5
                "
              />


              <div
                className="
                  mt-4
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >

                <Input
                  name="city"
                  placeholder="City *"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                />


                <Input
                  name="state"
                  placeholder="State *"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </CheckoutCard>


            {/* =================================
                DELIVERY SLOT
            ================================= */}

            <CheckoutCard
              icon={
                CalendarDays
              }
              number="02"
              title="Choose Delivery"
            >

              <label
                className="
                  text-sm
                  font-bold
                  text-[#542432]
                "
              >
                Delivery Date
              </label>


              <input
                type="date"
                value={
                  deliveryDate
                }
                min={
                  minimumDeliveryDate
                }
                onChange={(
                  event
                ) =>
                  setDeliveryDate(
                    event.target
                      .value
                  )
                }
                className="
                  mt-3
                  min-h-13
                  w-full
                  rounded-2xl
                  border
                  border-pink-100
                  bg-[#fffafa]
                  px-4
                  py-3
                  text-sm
                  text-[#542432]
                  outline-none
                  transition

                  focus:border-pink-400
                  focus:ring-4
                  focus:ring-pink-100/50

                  sm:px-5
                  sm:py-4
                "
              />


              <p
                className="
                  mb-3
                  mt-6
                  text-sm
                  font-bold
                  text-[#542432]
                "
              >
                Delivery Time
              </p>


              <div
                className="
                  grid
                  gap-2

                  sm:grid-cols-2
                  sm:gap-3
                "
              >

                {[
                  "9:00 AM - 12:00 PM",
                  "12:00 PM - 3:00 PM",
                  "3:00 PM - 6:00 PM",
                  "6:00 PM - 9:00 PM",
                ].map(
                  (
                    slot
                  ) => (

                    <motion.button

                      key={
                        slot
                      }

                      type="button"

                      whileTap={{
                        scale:
                          0.97,
                      }}

                      onClick={() =>
                        setDeliverySlot(
                          slot
                        )
                      }

                      className={`
                        flex
                        min-h-14
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        p-4
                        text-left
                        text-xs
                        font-semibold
                        transition

                        sm:text-sm

                        ${
                          deliverySlot ===
                          slot
                            ? "border-pink-500 bg-pink-50 text-pink-600 shadow-sm"
                            : "border-pink-100 bg-white text-[#704653]"
                        }
                      `}
                    >

                      <Clock3
                        size={17}
                        className="
                          shrink-0
                        "
                      />

                      {slot}

                    </motion.button>

                  )
                )}

              </div>

            </CheckoutCard>


            {/* =================================
                PAYMENT
            ================================= */}

            <CheckoutCard
              icon={
                CreditCard
              }
              number="03"
              title="Payment Method"
            >

              <div
                className="
                  grid
                  gap-3

                  sm:grid-cols-2
                  sm:gap-4
                "
              >

                <PaymentOption
                  active={
                    paymentMethod ===
                    "cod"
                  }
                  icon={
                    Banknote
                  }
                  title="Cash on Delivery"
                  description="Pay when your cake arrives"
                  onClick={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                />


                {/* ONLINE PAYMENT DISABLED */}

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-gray-50
                    p-5
                    opacity-60
                  "
                >

                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      rounded-full
                      bg-white
                      px-2
                      py-1
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                  >
                    Coming Soon
                  </span>


                  <CreditCard
                    size={22}
                    className="
                      text-gray-400
                    "
                  />


                  <p
                    className="
                      mt-4
                      font-bold
                      text-[#542432]
                    "
                  >
                    Pay Online
                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    UPI, Cards &
                    Net Banking
                  </p>

                </div>

              </div>


              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-2
                  rounded-xl
                  bg-green-50
                  px-4
                  py-3
                  text-xs
                  font-semibold
                  leading-5
                  text-green-700
                "
              >

                <ShieldCheck
                  size={16}
                  className="
                    mt-0.5
                    shrink-0
                  "
                />

                Cash on Delivery is
                currently available
                for orders in our
                delivery area.

              </div>

            </CheckoutCard>

          </div>


          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <div
            className="
              min-w-0
            "
          >

            <div
              className="
                rounded-[1.7rem]
                bg-white
                p-5
                shadow-[0_20px_70px_rgba(80,30,45,0.1)]

                sm:rounded-[2rem]
                sm:p-7

                lg:sticky
                lg:top-28
              "
            >


              {/* TITLE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <ShoppingBag
                  size={21}
                  className="
                    text-pink-500
                  "
                />


                <h2
                  className="
                    font-serif
                    text-xl
                    font-bold
                    text-[#542432]

                    sm:text-2xl
                  "
                >
                  Your Order
                </h2>

              </div>


              {/* ITEMS */}

              <div
                className="
                  mt-5
                  max-h-72
                  space-y-4
                  overflow-y-auto
                  overscroll-contain
                  pr-1

                  sm:mt-6
                "
              >

                {cartItems.length ===
                0 ? (

                  <div
                    className="
                      py-8
                      text-center
                    "
                  >

                    <ShoppingBag
                      size={30}
                      className="
                        mx-auto
                        text-pink-200
                      "
                    />


                    <p
                      className="
                        mt-3
                        text-sm
                        text-gray-400
                      "
                    >
                      Your cart is
                      empty.
                    </p>


                    <Link
                      to="/cakes"
                      className="
                        mt-4
                        inline-block
                        text-xs
                        font-bold
                        text-pink-500
                      "
                    >
                      Explore Cakes
                    </Link>

                  </div>

                ) : (

                  cartItems.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={`${item.id}-${item.weight}-${item.cakeType || "default"}-${index}`}
                        className="
                          flex
                          gap-3

                          sm:gap-4
                        "
                      >

                        <div
                          className="
                            h-14
                            w-14
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            bg-pink-50

                            sm:h-16
                            sm:w-16
                          "
                        >

                          {item.image ? (

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-2xl
                              "
                            >
                              🎂
                            </div>

                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              line-clamp-2
                              text-xs
                              font-bold
                              leading-5
                              text-[#542432]

                              sm:text-sm
                            "
                          >
                            {item.name}
                          </p>


                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-gray-400

                              sm:text-xs
                            "
                          >

                            {item.weight}

                            {item.cakeType &&
                              ` • ${item.cakeType}`}

                            {" × "}

                            {item.quantity}

                          </p>


                          {item.message && (

                            <p
                              className="
                                mt-1
                                line-clamp-1
                                text-[9px]
                                italic
                                text-pink-400
                              "
                            >
                              "{item.message}"
                            </p>

                          )}

                        </div>


                        <p
                          className="
                            shrink-0
                            text-xs
                            font-bold
                            text-[#542432]

                            sm:text-sm
                          "
                        >
                          ₹
                          {Number(
                            item.price ||
                              0
                          ) *
                            Number(
                              item.quantity ||
                                1
                            )}
                        </p>

                      </div>

                    )
                  )

                )}

              </div>


              {/* =================================
                  PROMO
              ================================= */}

              <div
                className="
                  mt-6
                  border-t
                  border-pink-100
                  pt-5

                  sm:mt-7
                  sm:pt-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-[#542432]
                  "
                >

                  <Tag
                    size={17}
                  />

                  Have a sweet code?

                </div>


                <div
                  className="
                    mt-3
                    flex
                    gap-2
                  "
                >

                  <input
                    value={
                      promoCode
                    }
                    onChange={(
                      event
                    ) => {

                      setPromoCode(
                        event.target
                          .value
                      );

                      setPromoMessage(
                        ""
                      );

                    }}
                    placeholder="SWEET3"
                    className="
                      min-h-12
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-pink-100
                      px-3
                      py-3
                      text-xs
                      uppercase
                      outline-none
                      transition

                      focus:border-pink-400

                      sm:px-4
                      sm:text-sm
                    "
                  />


                  <motion.button

                    type="button"

                    whileTap={{
                      scale:
                        0.96,
                    }}

                    onClick={
                      applyPromo
                    }

                    disabled={
                      cartItems.length ===
                      0
                    }

                    className="
                      min-h-12
                      shrink-0
                      rounded-xl
                      bg-[#542432]
                      px-4
                      text-xs
                      font-bold
                      text-white

                      disabled:cursor-not-allowed
                      disabled:opacity-40

                      sm:px-5
                      sm:text-sm
                    "
                  >
                    Apply
                  </motion.button>

                </div>


                {promoMessage && (

                  <motion.p

                    initial={{
                      opacity: 0,
                      y: 5,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    className="
                      mt-3
                      text-[10px]
                      font-semibold
                      leading-5
                      text-pink-500

                      sm:text-xs
                    "
                  >
                    {promoMessage}
                  </motion.p>

                )}

              </div>


              {/* =================================
                  PRICE
              ================================= */}

              <div
                className="
                  mt-6
                  space-y-3
                  border-t
                  border-pink-100
                  pt-5
                  text-sm

                  sm:mt-7
                  sm:pt-6
                "
              >

                <PriceRow
                  label="Subtotal"
                  value={`₹${subtotal}`}
                />


                <PriceRow
                  label="Delivery"
                  value={`₹${deliveryCharge}`}
                />


                {discount >
                  0 && (

                  <PriceRow
                    label="Sweet Discount"
                    value={`-₹${discount}`}
                  />

                )}

              </div>


              {/* TOTAL */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  border-t
                  border-dashed
                  border-pink-200
                  pt-5
                "
              >

                <span
                  className="
                    font-bold
                    text-[#542432]
                  "
                >
                  Total
                </span>


                <motion.span

                  key={
                    total
                  }

                  initial={{
                    scale: 0.9,
                  }}

                  animate={{
                    scale: 1,
                  }}

                  className="
                    text-2xl
                    font-black
                    text-pink-500

                    sm:text-3xl
                  "
                >
                  ₹{total}
                </motion.span>

              </div>


              {/* =================================
                  DELIVERY AREA
              ================================= */}

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-2
                  rounded-xl
                  bg-pink-50
                  px-3
                  py-3
                  text-[10px]
                  leading-5
                  text-[#704653]
                "
              >

                <MapPin
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-pink-500
                  "
                />

                Delivery available
                only in Panvel /
                India Bulls –
                PIN 410206.

              </div>


              {/* =================================
                  ORDER ERROR
              ================================= */}

              {orderError && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 5,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  className="
                    mt-5
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    bg-red-50
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    leading-5
                    text-red-600
                  "
                >

                  <AlertCircle
                    size={15}
                    className="
                      mt-0.5
                      shrink-0
                    "
                  />

                  {orderError}

                </motion.div>

              )}


              {/* =================================
                  PLACE ORDER
              ================================= */}

              <motion.button

                type="button"

                whileHover={
                  !placingOrder &&
                  cartItems.length >
                    0 &&
                  isValidPincode
                    ? {
                        scale:
                          1.02,
                      }
                    : {}
                }

                whileTap={
                  !placingOrder &&
                  cartItems.length >
                    0
                    ? {
                        scale:
                          0.97,
                      }
                    : {}
                }

                onClick={
                  handlePlaceOrder
                }

                disabled={
                  cartItems.length ===
                    0 ||
                  placingOrder
                }

                className="
                  mt-6
                  flex
                  min-h-13
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-pink-500
                  px-5
                  py-4
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  transition

                  disabled:cursor-not-allowed
                  disabled:opacity-40

                  sm:mt-7
                "
              >

                {placingOrder ? (

                  <>

                    <Loader2
                      size={19}
                      className="
                        animate-spin
                      "
                    />

                    Placing Your
                    Order...

                  </>

                ) : (

                  <>

                    <CheckCircle2
                      size={19}
                    />

                    Place Order

                  </>

                )}

              </motion.button>


              {/* SECURITY */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[10px]
                  text-gray-400

                  sm:mt-5
                  sm:text-xs
                "
              >

                <ShieldCheck
                  size={14}
                />

                Secure checkout •
                Cash on Delivery

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>

  );

}


/* =========================================
   CHECKOUT CARD
========================================= */

function CheckoutCard({
  icon: Icon,
  number,
  title,
  children,
}) {

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 30,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.1,
      }}

      className="
        rounded-[1.7rem]
        bg-white
        p-5
        shadow-[0_15px_60px_rgba(80,30,45,0.07)]

        sm:rounded-[2rem]
        sm:p-7

        md:p-9
      "
    >

      <div
        className="
          mb-6
          flex
          items-center
          gap-3

          sm:mb-7
          sm:gap-4
        "
      >

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-pink-50
            text-pink-500

            sm:h-12
            sm:w-12
          "
        >

          <Icon
            size={21}
          />

        </div>


        <div>

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-pink-400

              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            Step {number}
          </p>


          <h2
            className="
              mt-1
              font-serif
              text-xl
              font-bold
              text-[#542432]

              sm:text-2xl
            "
          >
            {title}
          </h2>

        </div>

      </div>


      {children}

    </motion.section>

  );

}


/* =========================================
   INPUT
========================================= */

function Input(
  props
) {

  return (

    <input
      {...props}
      className="
        min-h-13
        w-full
        rounded-2xl
        border
        border-pink-100
        bg-[#fffafa]
        px-4
        py-3
        text-sm
        text-[#542432]
        outline-none
        transition

        placeholder:text-gray-400

        focus:border-pink-400
        focus:ring-4
        focus:ring-pink-100/50

        sm:px-5
        sm:py-4
      "
    />

  );

}


/* =========================================
   PAYMENT OPTION
========================================= */

function PaymentOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}) {

  return (

    <motion.button

      type="button"

      whileTap={{
        scale:
          0.97,
      }}

      onClick={
        onClick
      }

      className={`
        min-h-[130px]
        rounded-2xl
        border
        p-5
        text-left
        transition

        ${
          active
            ? "border-pink-500 bg-pink-50 shadow-sm"
            : "border-pink-100 bg-white"
        }
      `}
    >

      <Icon
        size={22}
        className={
          active
            ? "text-pink-500"
            : "text-gray-400"
        }
      />


      <p
        className="
          mt-4
          font-bold
          text-[#542432]
        "
      >
        {title}
      </p>


      <p
        className="
          mt-1
          text-xs
          leading-5
          text-gray-400
        "
      >
        {description}
      </p>

    </motion.button>

  );

}


/* =========================================
   PRICE ROW
========================================= */

function PriceRow({
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <span
        className="
          text-gray-500
        "
      >
        {label}
      </span>


      <span
        className="
          shrink-0
          font-bold
          text-[#542432]
        "
      >
        {value}
      </span>

    </div>

  );

}


export default CheckoutPage;