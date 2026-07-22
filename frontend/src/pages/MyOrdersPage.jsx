import {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import API_URL from "../config/api";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChefHat,
  Clock3,
  CreditCard,
  LoaderCircle,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


/* =========================================
   API
========================================= */

const MY_ORDERS_API =
  `${API_URL}/api/orders/my-orders`;


/* =========================================
   TRACKING STEPS
========================================= */

const trackingSteps = [
  {
    status: "placed",
    label: "Order Placed",
    description:
      "We have received your order.",
    icon: ShoppingBag,
  },

  {
    status: "confirmed",
    label: "Confirmed",
    description:
      "Your order has been confirmed.",
    icon: Check,
  },

  {
    status: "baking",
    label: "Baking",
    description:
      "Your cake is being freshly prepared.",
    icon: ChefHat,
  },

  {
    status: "out-for-delivery",
    label: "Out for Delivery",
    description:
      "Your cake is on the way.",
    icon: Truck,
  },

  {
    status: "delivered",
    label: "Delivered",
    description:
      "Your order has been delivered.",
    icon: PackageCheck,
  },
];


/* =========================================
   STATUS LABEL
========================================= */

const statusLabels = {

  placed:
    "Order Placed",

  confirmed:
    "Confirmed",

  baking:
    "Baking",

  "out-for-delivery":
    "Out for Delivery",

  delivered:
    "Delivered",

  cancelled:
    "Cancelled",

};


/* =========================================
   DATE FORMATTER
========================================= */

const formatDate =
  (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );

  };


/* =========================================
   CURRENCY
========================================= */

const formatPrice =
  (value) =>
    `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;


/* =========================================
   SHORT ORDER NUMBER
========================================= */

const getOrderNumber =
  (order) => {

    if (!order?._id) {
      return "TB";
    }

    return `TB${order._id
      .slice(-8)
      .toUpperCase()}`;

  };


/* =========================================
   MAIN PAGE
========================================= */

function MyOrdersPage() {

  const {
    user,
    token,
  } = useAuth();


  const [
    orders,
    setOrders,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  /* =========================================
     FETCH CUSTOMER ORDERS
  ========================================= */

  const fetchOrders =
    useCallback(
      async () => {

        if (!token) {

          setOrders([]);

          setLoading(false);

          return;
        }


        try {

          setLoading(true);

          setError("");


          const response =
            await axios.get(
              MY_ORDERS_API,

              {
                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },
              }
            );


          if (
            response.data
              ?.success
          ) {

            setOrders(
              response.data
                .orders ||
                []
            );

          } else {

            setOrders([]);

            setError(
              response.data
                ?.message ||
                "Unable to load your orders."
            );

          }

        } catch (err) {

          console.error(
            "My Orders error:",
            err
          );


          setOrders([]);


          if (
            err.response
              ?.status === 401
          ) {

            setError(
              "Your session has expired. Please sign in again."
            );

          } else {

            setError(
              err.response
                ?.data
                ?.message ||
                "We couldn't load your orders. Please try again."
            );

          }

        } finally {

          setLoading(false);

        }

      },

      [token]
    );


  /* =========================================
     LOAD ORDERS
  ========================================= */

  useEffect(
    () => {

      fetchOrders();

    },
    [fetchOrders]
  );


  /* =========================================
     AUTO REFRESH ACTIVE ORDERS

     Checks every 30 seconds while page
     is open so admin status changes can
     appear automatically.
  ========================================= */

  useEffect(
    () => {

      if (!token) {
        return undefined;
      }


      const hasActiveOrder =
        orders.some(
          (order) =>
            order.orderStatus !==
              "delivered" &&
            order.orderStatus !==
              "cancelled"
        );


      if (!hasActiveOrder) {
        return undefined;
      }


      const interval =
        setInterval(
          () => {

            fetchOrders();

          },
          30000
        );


      return () =>
        clearInterval(
          interval
        );

    },
    [
      token,
      orders,
      fetchOrders,
    ]
  );


  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (
    !user ||
    !token
  ) {

    return (

      <main
        className="
          min-h-screen
          bg-[#fffaf8]
          px-5
          py-24
        "
      >

        <div
          className="
            mx-auto
            max-w-xl
            rounded-[2rem]
            border
            border-pink-100
            bg-white
            p-10
            text-center
            shadow-sm
          "
        >

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-pink-50
              text-pink-500
            "
          >
            <ShoppingBag
              size={28}
            />
          </div>


          <h1
            className="
              mt-6
              font-serif
              text-3xl
              font-bold
              text-[#542432]
            "
          >
            Sign in to see your orders
          </h1>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-gray-500
            "
          >
            Your Tempting Bites orders and
            delivery tracking will appear
            here after you sign in.
          </p>


          <Link
            to="/"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-pink-500
              px-7
              py-3
              font-bold
              text-white
              transition
              hover:bg-pink-600
            "
          >
            <ArrowLeft
              size={17}
            />

            Back to Home
          </Link>

        </div>

      </main>

    );

  }


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fffaf8]
        "
      >

        <div
          className="
            text-center
          "
        >

          <LoaderCircle
            size={42}
            className="
              mx-auto
              animate-spin
              text-pink-500
            "
          />


          <p
            className="
              mt-4
              font-semibold
              text-[#542432]
            "
          >
            Loading your sweet orders...
          </p>

        </div>

      </main>

    );

  }


  return (

    <main
      className="
        min-h-screen
        bg-[#fffaf8]
        pb-20
        pt-24
      "
    >

      <div
        className="
          mx-auto
          w-[92%]
          max-w-6xl
        "
      >

        {/* =================================
            PAGE HEADER
        ================================= */}

        <div
          className="
            mb-10
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <Link
              to="/"
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-gray-500
                transition
                hover:text-pink-500
              "
            >
              <ArrowLeft
                size={16}
              />

              Continue Shopping
            </Link>


            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-pink-500
              "
            >
              Tempting Bites
            </p>


            <h1
              className="
                mt-2
                font-serif
                text-4xl
                font-bold
                text-[#542432]
                sm:text-5xl
              "
            >
              My Orders
            </h1>


            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-gray-500
              "
            >
              View your previous orders and
              follow the progress of your
              current cake delivery.
            </p>

          </div>


          <button
            type="button"
            onClick={
              fetchOrders
            }
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-pink-100
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              text-[#542432]
              shadow-sm
              transition
              hover:border-pink-300
            "
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div
            className="
              mb-8
              rounded-2xl
              border
              border-red-100
              bg-red-50
              p-5
              text-sm
              font-semibold
              text-red-600
            "
          >
            {error}
          </div>

        )}


        {/* =================================
            EMPTY ORDERS
        ================================= */}

        {!error &&
          orders.length === 0 && (

            <div
              className="
                rounded-[2.5rem]
                border
                border-pink-100
                bg-white
                px-6
                py-16
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-pink-50
                  text-pink-500
                "
              >
                <ShoppingBag
                  size={32}
                />
              </div>


              <h2
                className="
                  mt-6
                  font-serif
                  text-3xl
                  font-bold
                  text-[#542432]
                "
              >
                No orders yet
              </h2>


              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Your cake orders will appear
                here after you place your
                first order.
              </p>


              <Link
                to="/cakes"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-pink-500
                  px-7
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                Explore Cakes
              </Link>

            </div>

          )}


        {/* =================================
            ORDER LIST
        ================================= */}

        <div
          className="
            space-y-8
          "
        >

          {orders.map(
            (
              order,
              orderIndex
            ) => (

              <OrderCard
                key={
                  order._id
                }
                order={
                  order
                }
                index={
                  orderIndex
                }
              />

            )
          )}

        </div>

      </div>

    </main>

  );

}


/* =========================================
   ORDER CARD
========================================= */

function OrderCard({
  order,
  index,
}) {

  const isCancelled =
    order.orderStatus ===
    "cancelled";


  const isDelivered =
    order.orderStatus ===
    "delivered";


  return (

    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay:
          index * 0.06,
      }}
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-pink-100
        bg-white
        shadow-sm
      "
    >

      {/* =================================
          ORDER HEADER
      ================================= */}

      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-pink-50
          bg-[#fffdfc]
          p-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-gray-400
            "
          >
            Order
          </p>


          <h2
            className="
              mt-1
              font-serif
              text-2xl
              font-bold
              text-[#542432]
            "
          >
            #
            {getOrderNumber(
              order
            )}
          </h2>


          <p
            className="
              mt-2
              text-xs
              text-gray-400
            "
          >
            Placed on{" "}
            {formatDate(
              order.createdAt
            )}
          </p>

        </div>


        <div
          className={`
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            px-4
            py-2
            text-xs
            font-bold

            ${
              isCancelled
                ? "bg-red-50 text-red-600"
                : isDelivered
                ? "bg-green-50 text-green-700"
                : "bg-pink-50 text-pink-600"
            }
          `}
        >

          {isCancelled ? (
            <XCircle
              size={15}
            />
          ) : isDelivered ? (
            <PackageCheck
              size={15}
            />
          ) : (
            <Clock3
              size={15}
            />
          )}


          {statusLabels[
            order.orderStatus
          ] ||
            order.orderStatus}

        </div>

      </div>


      <div
        className="
          grid
          gap-8
          p-6
          lg:grid-cols-[1fr_0.9fr]
        "
      >

        {/* =================================
            LEFT
        ================================= */}

        <div>

          {/* ITEMS */}

          <div
            className="
              space-y-4
            "
          >

            {(order.items || [])
              .map(
                (
                  item,
                  itemIndex
                ) => (

                  <div
                    key={
                      `${order._id}-${itemIndex}`
                    }
                    className="
                      flex
                      gap-4
                      rounded-2xl
                      border
                      border-pink-50
                      bg-[#fffaf8]
                      p-4
                    "
                  >

                    <div
                      className="
                        h-20
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-pink-50
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
                            text-pink-400
                          "
                        >
                          <ShoppingBag
                            size={25}
                          />
                        </div>

                      )}

                    </div>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <h3
                        className="
                          font-bold
                          text-[#542432]
                        "
                      >
                        {item.name}
                      </h3>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-gray-500
                        "
                      >
                        {item.weight}
                        {" • "}
                        Qty{" "}
                        {item.quantity}
                      </p>


                      <p
                        className="
                          mt-2
                          font-bold
                          text-pink-500
                        "
                      >
                        {formatPrice(
                          Number(
                            item.price ||
                              0
                          ) *
                            Number(
                              item.quantity ||
                                1
                            )
                        )}
                      </p>

                    </div>

                  </div>

                )
              )}

          </div>


          {/* DELIVERY INFORMATION */}

          <div
            className="
              mt-6
              grid
              gap-3
              sm:grid-cols-2
            "
          >

            <InfoBox
              icon={
                CalendarDays
              }
              label="Delivery Date"
              value={
                formatDate(
                  order.deliveryDate
                )
              }
            />


            <InfoBox
              icon={
                Clock3
              }
              label="Delivery Slot"
              value={
                order.deliverySlot ||
                "—"
              }
            />


            <InfoBox
              icon={
                CreditCard
              }
              label="Payment"
              value={
                `${
                  order.paymentMethod ||
                  "COD"
                } • ${
                  order.paymentStatus ||
                  "pending"
                }`
              }
            />


            <InfoBox
              icon={
                MapPin
              }
              label="Delivery To"
              value={
                `${
                  order
                    .deliveryAddress
                    ?.city ||
                  ""
                } ${
                  order
                    .deliveryAddress
                    ?.pincode ||
                  ""
                }`
              }
            />

          </div>


          {/* TOTAL */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              rounded-2xl
              bg-[#542432]
              px-5
              py-4
              text-white
            "
          >

            <span
              className="
                text-sm
                font-semibold
                text-white/70
              "
            >
              Order Total
            </span>


            <strong
              className="
                text-xl
              "
            >
              {formatPrice(
                order.totalAmount
              )}
            </strong>

          </div>

        </div>


        {/* =================================
            RIGHT - TRACKING
        ================================= */}

        <div
          className="
            rounded-[1.75rem]
            bg-[#fffaf8]
            p-6
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-pink-500
            "
          >
            Live Tracking
          </p>


          <h3
            className="
              mt-2
              font-serif
              text-2xl
              font-bold
              text-[#542432]
            "
          >
            Order Journey
          </h3>


          {isCancelled ? (

            <div
              className="
                mt-7
                rounded-2xl
                border
                border-red-100
                bg-red-50
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  font-bold
                  text-red-600
                "
              >
                <XCircle
                  size={20}
                />

                Order Cancelled
              </div>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-red-500
                "
              >
                This order has been
                cancelled and is no longer
                being processed.
              </p>

            </div>

          ) : (

            <TrackingTimeline
              currentStatus={
                order.orderStatus
              }
            />

          )}

        </div>

      </div>

    </motion.article>

  );

}


/* =========================================
   TRACKING TIMELINE
========================================= */

function TrackingTimeline({
  currentStatus,
}) {

  const currentIndex =
    trackingSteps.findIndex(
      (step) =>
        step.status ===
        currentStatus
    );


  return (

    <div
      className="
        mt-7
      "
    >

      {trackingSteps.map(
        (
          step,
          index
        ) => {

          const Icon =
            step.icon;


          const completed =
            index <
            currentIndex;


          const current =
            index ===
            currentIndex;


          const reached =
            completed ||
            current;


          const isLast =
            index ===
            trackingSteps.length -
              1;


          return (

            <div
              key={
                step.status
              }
              className="
                relative
                flex
                gap-4
              "
            >

              {/* LINE */}

              {!isLast && (

                <div
                  className={`
                    absolute
                    left-[19px]
                    top-10
                    h-[calc(100%-16px)]
                    w-[2px]

                    ${
                      completed
                        ? "bg-pink-400"
                        : "bg-pink-100"
                    }
                  `}
                />

              )}


              {/* ICON */}

              <div
                className={`
                  relative
                  z-10
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-2

                  ${
                    reached
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-pink-100 bg-white text-gray-300"
                  }

                  ${
                    current
                      ? "ring-4 ring-pink-100"
                      : ""
                  }
                `}
              >

                <Icon
                  size={17}
                />

              </div>


              {/* TEXT */}

              <div
                className={`
                  ${
                    isLast
                      ? "pb-0"
                      : "pb-8"
                  }
                `}
              >

                <p
                  className={`
                    font-bold

                    ${
                      reached
                        ? "text-[#542432]"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-400
                  "
                >
                  {step.description}
                </p>


                {current && (

                  <span
                    className="
                      mt-2
                      inline-flex
                      rounded-full
                      bg-pink-100
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-pink-600
                    "
                  >
                    Current Status
                  </span>

                )}

              </div>

            </div>

          );

        }
      )}

    </div>

  );

}


/* =========================================
   INFORMATION BOX
========================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-pink-50
        bg-white
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-pink-500
        "
      >
        <Icon
          size={16}
        />

        <span
          className="
            text-xs
            font-bold
            uppercase
            tracking-wider
          "
        >
          {label}
        </span>
      </div>


      <p
        className="
          mt-2
          text-sm
          font-semibold
          capitalize
          text-[#542432]
        "
      >
        {value}
      </p>

    </div>

  );

}


export default MyOrdersPage;