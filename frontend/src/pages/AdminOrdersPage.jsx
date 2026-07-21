import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  ShoppingBag,
  RefreshCw,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  CreditCard,
  Banknote,
  Package,
  MessageSquareText,
  ChefHat,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


/* =========================================
   API
========================================= */

const ORDERS_API =
  "http://localhost:5000/api/orders";


/* =========================================
   FILTERS
========================================= */

const filters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "New",
    value: "placed",
  },
  {
    label: "Confirmed",
    value: "confirmed",
  },
  {
    label: "Baking",
    value: "baking",
  },
  {
    label: "Out for Delivery",
    value: "out-for-delivery",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];


/* =========================================
   ORDER STATUS OPTIONS
========================================= */

const statusOptions = [
  {
    label: "New",
    value: "placed",
  },
  {
    label: "Confirmed",
    value: "confirmed",
  },
  {
    label: "Baking",
    value: "baking",
  },
  {
    label: "Out for Delivery",
    value: "out-for-delivery",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];


/* =========================================
   ADMIN ORDERS PAGE
========================================= */

function AdminOrdersPage() {

  const navigate =
    useNavigate();


  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    filter,
    setFilter,
  ] = useState("all");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    updatingOrder,
    setUpdatingOrder,
  ] = useState(null);


  /* =========================================
     FETCH ORDERS
  ========================================= */

  const fetchOrders =
    async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          localStorage.getItem(
            "adminToken"
          );


        if (!token) {

          navigate(
            "/admin/login"
          );

          return;

        }


        const response =
          await axios.get(
            ORDERS_API,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setOrders(
          response.data
            .orders ||
            []
        );

      } catch (error) {

        console.error(
          "Fetch orders error:",
          error
        );


        if (
          error.response
            ?.status ===
          401
        ) {

          localStorage.removeItem(
            "adminToken"
          );

          navigate(
            "/admin/login"
          );

          return;

        }


        setError(
          error.response
            ?.data
            ?.message ||
            "Unable to load orders. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  /* =========================================
     LOAD ORDERS
  ========================================= */

  useEffect(() => {

    fetchOrders();

  }, []);


  /* =========================================
     UPDATE ORDER STATUS
  ========================================= */

  const handleStatusChange =
    async (
      orderId,
      newStatus
    ) => {

      try {

        setUpdatingOrder(
          orderId
        );


        const token =
          localStorage.getItem(
            "adminToken"
          );


        const response =
          await axios.patch(
            `${ORDERS_API}/${orderId}/status`,

            {
              orderStatus:
                newStatus,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        /*
          Update order locally
          without refreshing page.
        */

        setOrders(
          (
            previousOrders
          ) =>
            previousOrders.map(
              (order) =>
                order._id ===
                orderId
                  ? {
                      ...order,

                      ...(
                        response.data
                          .order ||
                        {}
                      ),

                      orderStatus:
                        response.data
                          .order
                          ?.orderStatus ||
                        newStatus,
                    }
                  : order
            )
        );

      } catch (error) {

        console.error(
          "Status update error:",
          error
        );


        alert(
          error.response
            ?.data
            ?.message ||
            "Unable to update order status."
        );

      } finally {

        setUpdatingOrder(
          null
        );

      }

    };


  /* =========================================
     FILTER ORDERS
  ========================================= */

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus ===
            filter
        );


  /* =========================================
     UI
  ========================================= */

  return (

    <main
      className="
        min-h-screen
        bg-[#fff8f5]
        px-4
        py-6

        sm:px-6
        sm:py-8

        lg:px-10
        lg:py-10
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >


        {/* =====================================
            BACK
        ===================================== */}

        <button

          type="button"

          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }

          className="
            flex
            items-center
            gap-2
            text-xs
            font-bold
            text-[#542432]
            transition

            hover:text-pink-500

            sm:text-sm
          "
        >

          <ArrowLeft
            size={17}
          />

          Dashboard

        </button>


        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-5

            sm:mt-8

            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-pink-500

                sm:text-sm
              "
            >
              Tempting Bites Admin
            </p>


            <h1
              className="
                mt-2
                font-serif
                text-3xl
                font-bold
                text-[#542432]

                sm:text-4xl

                lg:text-5xl
              "
            >
              Customer Orders
            </h1>


            <p
              className="
                mt-2
                max-w-lg
                text-sm
                leading-6
                text-gray-400
              "
            >
              View incoming orders,
              cake customizations and
              manage delivery status
              from one place.
            </p>

          </div>


          {/* REFRESH */}

          <button

            type="button"

            onClick={
              fetchOrders
            }

            disabled={
              loading
            }

            className="
              flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              text-[#542432]
              shadow-sm
              transition

              hover:shadow-md

              disabled:opacity-50

              sm:w-fit
            "
          >

            <RefreshCw

              size={16}

              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Orders

          </button>

        </div>


        {/* =====================================
            SUMMARY
        ===================================== */}

        <div
          className="
            mt-7
            grid
            grid-cols-2
            gap-3

            sm:grid-cols-4

            lg:mt-9
          "
        >

          <SummaryCard
            label="Total Orders"
            value={
              orders.length
            }
          />


          <SummaryCard
            label="New Orders"
            value={
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "placed"
              ).length
            }
          />


          <SummaryCard
            label="Baking"
            value={
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "baking"
              ).length
            }
          />


          <SummaryCard
            label="Delivered"
            value={
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "delivered"
              ).length
            }
          />

        </div>


        {/* =====================================
            FILTERS
        ===================================== */}

        <div
          className="
            mt-7
            flex
            gap-2
            overflow-x-auto
            pb-3

            sm:gap-3

            lg:mt-9
          "
        >

          {filters.map(
            (item) => {

              const count =
                item.value ===
                "all"
                  ? orders.length
                  : orders.filter(
                      (order) =>
                        order.orderStatus ===
                        item.value
                    ).length;


              return (

                <button

                  type="button"

                  key={
                    item.value
                  }

                  onClick={() =>
                    setFilter(
                      item.value
                    )
                  }

                  className={`
                    shrink-0
                    whitespace-nowrap
                    rounded-full
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    transition

                    sm:px-5
                    sm:py-3
                    sm:text-sm

                    ${
                      filter ===
                      item.value
                        ? "bg-[#542432] text-white shadow-md"
                        : "bg-white text-gray-500 hover:text-pink-500"
                    }
                  `}
                >

                  {item.label}


                  <span
                    className="
                      ml-2
                      opacity-60
                    "
                  >
                    {count}
                  </span>

                </button>

              );

            }
          )}

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div
            className="
              mt-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-100
              bg-red-50
              p-4
              text-sm
              text-red-600
            "
          >

            <AlertCircle
              size={18}
              className="
                mt-0.5
                shrink-0
              "
            />


            <div
              className="
                flex-1
              "
            >

              <p
                className="
                  font-bold
                "
              >
                Couldn't load orders
              </p>


              <p
                className="
                  mt-1
                  text-xs
                "
              >
                {error}
              </p>

            </div>


            <button
              type="button"
              onClick={
                fetchOrders
              }
              className="
                text-xs
                font-bold
                underline
              "
            >
              Retry
            </button>

          </div>

        )}


        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (

          <div
            className="
              py-24
              text-center
            "
          >

            <RefreshCw
              className="
                mx-auto
                animate-spin
                text-pink-500
              "
            />


            <p
              className="
                mt-4
                text-sm
                text-gray-400
              "
            >
              Loading orders...
            </p>

          </div>


        ) : filteredOrders.length ===
          0 ? (


          /* =================================
              EMPTY
          ================================= */

          <div
            className="
              mt-8
              rounded-[2rem]
              bg-white
              px-5
              py-20
              text-center
              shadow-sm
            "
          >

            <ShoppingBag
              size={40}
              className="
                mx-auto
                text-pink-200
              "
            />


            <h2
              className="
                mt-4
                font-serif
                text-xl
                font-bold
                text-[#542432]

                sm:text-2xl
              "
            >
              No orders found
            </h2>


            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-sm
                text-gray-400
              "
            >
              There are currently no
              orders matching this
              status.
            </p>

          </div>


        ) : (


          /* =================================
              ORDERS
          ================================= */

          <div
            className="
              mt-7
              grid
              gap-5

              lg:mt-8
            "
          >

            {filteredOrders.map(
              (order) => (

                <OrderCard

                  key={
                    order._id
                  }

                  order={
                    order
                  }

                  updating={
                    updatingOrder ===
                    order._id
                  }

                  onStatusChange={
                    handleStatusChange
                  }

                />

              )
            )}

          </div>

        )}

      </div>

    </main>

  );

}


/* =========================================
   ORDER CARD
========================================= */

function OrderCard({
  order,
  updating,
  onStatusChange,
}) {

  const orderNumber =
    order._id
      ? order._id
          .slice(-8)
          .toUpperCase()
      : "N/A";


  const createdDate =
    order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleString(
          "en-IN",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        )
      : "";


  return (

    <div
      className="
        overflow-hidden
        rounded-[1.7rem]
        bg-white
        shadow-[0_15px_50px_rgba(80,30,45,0.06)]

        sm:rounded-[2rem]
      "
    >


      {/* =====================================
          ORDER HEADER
      ===================================== */}

      <div
        className="
          border-b
          border-pink-50
          p-5

          sm:p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4

            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <h3
                className="
                  font-serif
                  text-xl
                  font-bold
                  text-[#542432]

                  sm:text-2xl
                "
              >
                {order.customer
                  ?.name ||
                  "Customer"}
              </h3>


              <StatusBadge
                status={
                  order.orderStatus
                }
              />

            </div>


            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400

                sm:text-xs
              "
            >
              Order #{orderNumber}
            </p>


            {createdDate && (

              <p
                className="
                  mt-1
                  text-[10px]
                  text-gray-400
                "
              >
                Placed{" "}
                {createdDate}
              </p>

            )}

          </div>


          {/* STATUS CONTROL */}

          <div
            className="
              w-full

              md:w-auto
            "
          >

            <p
              className="
                mb-2
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Update Status
            </p>


            <div
              className="
                relative
              "
            >

              <select

                value={
                  order.orderStatus ||
                  "placed"
                }

                disabled={
                  updating
                }

                onChange={(
                  event
                ) =>
                  onStatusChange(
                    order._id,
                    event.target
                      .value
                  )
                }

                className="
                  min-h-11
                  w-full
                  appearance-none
                  rounded-full
                  border
                  border-pink-100
                  bg-[#fff8f5]
                  py-2
                  pl-4
                  pr-10
                  text-xs
                  font-bold
                  text-[#542432]
                  outline-none

                  focus:border-pink-400

                  disabled:opacity-50

                  md:min-w-[190px]
                "
              >

                {statusOptions.map(
                  (status) => (

                    <option
                      key={
                        status.value
                      }
                      value={
                        status.value
                      }
                    >
                      {status.label}
                    </option>

                  )
                )}

              </select>


              {updating ? (

                <Loader2
                  size={15}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    animate-spin
                    text-pink-500
                  "
                />

              ) : (

                <ChevronDown
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          ORDER BODY
      ===================================== */}

      <div
        className="
          grid
          gap-6
          p-5

          sm:p-6

          lg:grid-cols-[1fr_1.2fr_1fr]
          lg:gap-8
        "
      >


        {/* =================================
            CUSTOMER
        ================================= */}

        <div>

          <SectionTitle
            title="Customer"
          />


          <div
            className="
              mt-4
              space-y-3
            "
          >

            <InfoRow
              icon={Phone}
              value={
                order.customer
                  ?.phone ||
                "No phone"
              }
            />


            {order.customer
              ?.email && (

              <InfoRow
                icon={Mail}
                value={
                  order.customer
                    .email
                }
              />

            )}

          </div>


          {/* ADDRESS */}

          <div
            className="
              mt-5
              rounded-2xl
              bg-[#fff8f5]
              p-4
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <MapPin
                size={17}
                className="
                  mt-0.5
                  shrink-0
                  text-pink-500
                "
              />


              <div>

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-pink-400
                  "
                >
                  Delivery Address
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    font-semibold
                    leading-5
                    text-[#704653]
                  "
                >

                  {order
                    .deliveryAddress
                    ?.address ||
                    "Address not available"}

                  {order
                    .deliveryAddress
                    ?.city &&
                    `, ${order.deliveryAddress.city}`}

                  {order
                    .deliveryAddress
                    ?.state &&
                    `, ${order.deliveryAddress.state}`}

                  {order
                    .deliveryAddress
                    ?.pincode &&
                    ` - ${order.deliveryAddress.pincode}`}

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================
            ITEMS
        ================================= */}

        <div>

          <SectionTitle
            title="Order Items"
          />


          <div
            className="
              mt-4
              space-y-3
            "
          >

            {order.items
              ?.length >
            0 ? (

              order.items.map(
                (
                  item,
                  index
                ) => (

                  <div

                    key={
                      index
                    }

                    className="
                      rounded-2xl
                      border
                      border-pink-50
                      bg-[#fffdfc]
                      p-3

                      sm:p-4
                    "
                  >

                    <div
                      className="
                        flex
                        gap-3
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          h-14
                          w-14
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
                              text-xl
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

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div>

                            <p
                              className="
                                font-bold
                                text-[#542432]
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

                              {item.weight ||
                                "Weight N/A"}

                              {" × "}

                              {item.quantity ||
                                1}

                            </p>

                          </div>


                          <p
                            className="
                              shrink-0
                              text-sm
                              font-black
                              text-pink-500
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


                        {/* CAKE TYPE */}

                        {item.cakeType && (

                          <div
                            className="
                              mt-3
                              flex
                              items-center
                              gap-2
                              text-[10px]
                              font-semibold
                              text-[#704653]

                              sm:text-xs
                            "
                          >

                            <ChefHat
                              size={13}
                              className="
                                text-pink-400
                              "
                            />

                            {item.cakeType}

                          </div>

                        )}


                        {/* CAKE MESSAGE */}

                        {item.message && (

                          <div
                            className="
                              mt-2
                              flex
                              items-start
                              gap-2
                              rounded-xl
                              bg-pink-50
                              px-3
                              py-2
                            "
                          >

                            <MessageSquareText
                              size={13}
                              className="
                                mt-0.5
                                shrink-0
                                text-pink-500
                              "
                            />


                            <div>

                              <p
                                className="
                                  text-[8px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-pink-400
                                "
                              >
                                Message on Cake
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  text-[10px]
                                  font-semibold
                                  text-[#704653]

                                  sm:text-xs
                                "
                              >
                                "{item.message}"
                              </p>

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )

            ) : (

              <p
                className="
                  text-sm
                  text-gray-400
                "
              >
                No items available.
              </p>

            )}

          </div>

        </div>


        {/* =================================
            DELIVERY + PAYMENT
        ================================= */}

        <div>

          <SectionTitle
            title="Delivery & Payment"
          />


          <div
            className="
              mt-4
              space-y-3
            "
          >

            <DetailBox
              icon={
                CalendarDays
              }
              label="Delivery Date"
              value={
                order.deliveryDate ||
                "Not set"
              }
            />


            <DetailBox
              icon={Clock3}
              label="Delivery Time"
              value={
                order.deliverySlot ||
                "Not set"
              }
            />


            <DetailBox
              icon={
                order.paymentMethod ===
                  "COD" ||
                order.paymentMethod ===
                  "cod"
                  ? Banknote
                  : CreditCard
              }
              label="Payment"
              value={
                order.paymentMethod ===
                  "COD" ||
                order.paymentMethod ===
                  "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod ||
                    "Not set"
              }
            />

          </div>


          {/* =================================
              PRICE SUMMARY
          ================================= */}

          <div
            className="
              mt-5
              rounded-2xl
              bg-[#542432]
              p-4
              text-white
            "
          >

            <div
              className="
                space-y-2
                text-xs
              "
            >

              <OrderPriceRow
                label="Subtotal"
                value={`₹${order.subtotal || 0}`}
              />


              <OrderPriceRow
                label="Delivery"
                value={`₹${order.deliveryFee || 0}`}
              />


              {Number(
                order.discount ||
                  0
              ) > 0 && (

                <OrderPriceRow
                  label="Discount"
                  value={`-₹${order.discount}`}
                />

              )}

            </div>


            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >

              <span
                className="
                  text-sm
                  text-white/70
                "
              >
                Total
              </span>


              <span
                className="
                  text-2xl
                  font-black
                  text-pink-300
                "
              >
                ₹
                {order.totalAmount ||
                  0}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          CANCELLATION
      ===================================== */}

      {order.orderStatus ===
        "cancelled" &&
        order.cancellationReason && (

        <div
          className="
            mx-5
            mb-5
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-4

            sm:mx-6
            sm:mb-6
          "
        >

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-red-400
            "
          >
            Cancellation Reason
          </p>


          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-red-600
            "
          >
            {
              order.cancellationReason
            }
          </p>

        </div>

      )}

    </div>

  );

}


/* =========================================
   SUMMARY CARD
========================================= */

function SummaryCard({
  label,
  value,
}) {

  return (

    <div
      className="
        rounded-2xl
        bg-white
        p-4
        shadow-sm

        sm:p-5
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          text-gray-400

          sm:text-xs
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          font-serif
          text-2xl
          font-bold
          text-[#542432]

          sm:text-3xl
        "
      >
        {value}
      </p>

    </div>

  );

}


/* =========================================
   SECTION TITLE
========================================= */

function SectionTitle({
  title,
}) {

  return (

    <p
      className="
        text-[9px]
        font-bold
        uppercase
        tracking-[0.2em]
        text-gray-400

        sm:text-[10px]
      "
    >
      {title}
    </p>

  );

}


/* =========================================
   INFO ROW
========================================= */

function InfoRow({
  icon: Icon,
  value,
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-2
        text-xs
        text-gray-500

        sm:text-sm
      "
    >

      <Icon
        size={15}
        className="
          mt-0.5
          shrink-0
          text-pink-400
        "
      />


      <span
        className="
          break-all
        "
      >
        {value}
      </span>

    </div>

  );

}


/* =========================================
   DETAIL BOX
========================================= */

function DetailBox({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        bg-[#fff8f5]
        p-3
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-pink-500
        "
      >

        <Icon
          size={15}
        />

      </div>


      <div
        className="
          min-w-0
        "
      >

        <p
          className="
            text-[9px]
            text-gray-400
          "
        >
          {label}
        </p>


        <p
          className="
            mt-0.5
            truncate
            text-xs
            font-bold
            text-[#542432]
          "
        >
          {value}
        </p>

      </div>

    </div>

  );

}


/* =========================================
   PRICE ROW
========================================= */

function OrderPriceRow({
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
          text-white/50
        "
      >
        {label}
      </span>


      <span
        className="
          font-semibold
        "
      >
        {value}
      </span>

    </div>

  );

}


/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({
  status,
}) {

  const labels = {

    placed:
      "New",

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


  const styles = {

    placed:
      "bg-blue-50 text-blue-600",

    confirmed:
      "bg-purple-50 text-purple-600",

    baking:
      "bg-orange-50 text-orange-600",

    "out-for-delivery":
      "bg-yellow-50 text-yellow-700",

    delivered:
      "bg-green-50 text-green-600",

    cancelled:
      "bg-red-50 text-red-500",

  };


  return (

    <span
      className={`
        rounded-full
        px-3
        py-1
        text-[9px]
        font-bold
        uppercase
        tracking-wider

        sm:text-[10px]

        ${
          styles[status] ||
          "bg-gray-50 text-gray-500"
        }
      `}
    >
      {labels[status] ||
        status ||
        "Unknown"}
    </span>

  );

}


export default AdminOrdersPage;