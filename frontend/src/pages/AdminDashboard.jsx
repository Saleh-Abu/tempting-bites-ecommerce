import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ShoppingBag,
  IndianRupee,
  Clock3,
  CakeSlice,
  LogOut,
  RefreshCw,
  PackageCheck,
  Phone,
  CalendarDays,
  CreditCard,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const admin = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");

        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD ORDERS
  ========================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus:
                    response.data.order
                      .orderStatus,
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  /* =========================
     DASHBOARD STATS
  ========================= */

  const newOrders = orders.filter(
    (order) =>
      order.orderStatus === "placed"
  );

  const activeOrders = orders.filter(
    (order) =>
      ![
        "delivered",
        "cancelled",
      ].includes(order.orderStatus)
  );

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "delivered"
  );

  const totalRevenue =
    deliveredOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.totalAmount || 0
        ),
      0
    );

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#fff8f5]">

      {/* =====================
          SIDEBAR
      ===================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-[#542432] p-6 text-white lg:block">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500">
            <CakeSlice size={25} />
          </div>

          <div>

            <h2 className="font-serif text-xl font-bold">
              Tempting Bites
            </h2>

            <p className="text-xs text-white/50">
              Admin Kitchen
            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="mt-12 space-y-3">

          <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">

            <LayoutDashboard
              size={18}
            />

            Dashboard

          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ShoppingBag size={18} />

            Orders

            {newOrders.length > 0 && (
              <span className="ml-auto rounded-full bg-pink-500 px-2 py-1 text-[10px] text-white">
                {newOrders.length}
              </span>
            )}
          </button>

          <button
  onClick={() =>
    navigate("/admin/cakes")
  }
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
>

  <CakeSlice size={18} />

  Manage Cakes

</button>

        </nav>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="absolute bottom-8 left-6 right-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-red-500/20 hover:text-white"
        >

          <LogOut
            size={18}
          />

          Logout

        </button>

      </aside>


      {/* =====================
          MAIN CONTENT
      ===================== */}

      <section className="px-6 py-8 lg:ml-64 lg:px-10">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-pink-500">
              Admin Dashboard
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold text-[#542432] md:text-4xl">

              Welcome,{" "}

              {
                admin.name ||
                "Admin"
              }

              {" "}👋

            </h1>

            <p className="mt-2 text-sm text-gray-400">

              Manage your orders and
              keep Tempting Bites
              running smoothly.

            </p>

          </div>


          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            onClick={
              fetchOrders
            }
            disabled={
              loading
            }
            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#542432] shadow-sm disabled:opacity-50"
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

          </motion.button>

        </div>


        {/* =====================
            STATS
        ===================== */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={
              ShoppingBag
            }
            title="Total Orders"
            value={
              orders.length
            }
          />

          <StatCard
            icon={
              Clock3
            }
            title="New Orders"
            value={
              newOrders.length
            }
          />

          <StatCard
            icon={
              PackageCheck
            }
            title="Active Orders"
            value={
              activeOrders.length
            }
          />

          <StatCard
            icon={
              IndianRupee
            }
            title="Revenue"
            value={`₹${totalRevenue}`}
          />

        </div>


        {/* =====================
            RECENT ORDERS
        ===================== */}

        <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(80,30,45,0.07)] md:p-8">

          {/* TITLE */}

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
                Live Orders
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-[#542432]">
                Recent Orders
              </h2>

            </div>


            {newOrders.length >
              0 && (

              <motion.span
                initial={{
                  scale: 0.8,
                }}
                animate={{
                  scale: 1,
                }}
                className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-500"
              >

                {
                  newOrders.length
                }{" "}
                New

              </motion.span>

            )}

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="py-20 text-center">

              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-pink-500"
              />

              <p className="mt-4 text-sm text-gray-400">

                Loading sweet
                orders...

              </p>

            </div>

          ) : error ? (

            /* ERROR */

            <div className="py-20 text-center">

              <p className="font-semibold text-red-500">
                {
                  error
                }
              </p>

              <button
                onClick={
                  fetchOrders
                }
                className="mt-4 rounded-full bg-[#542432] px-5 py-3 text-sm font-bold text-white"
              >

                Try Again

              </button>

            </div>

          ) : orders.length ===
            0 ? (

            /* EMPTY */

            <div className="py-20 text-center">

              <ShoppingBag
                size={38}
                className="mx-auto text-pink-200"
              />

              <h3 className="mt-4 font-serif text-xl font-bold text-[#542432]">

                No orders yet

              </h3>

              <p className="mt-2 text-sm text-gray-400">

                New customer orders
                will appear here.

              </p>

            </div>

          ) : (

            /* ORDERS */

            <div className="mt-7 space-y-5">

              {orders.map(
                (order) => (

                  <motion.div
                    key={
                      order._id
                    }
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="rounded-[1.5rem] border border-pink-50 p-5 transition hover:border-pink-200 hover:shadow-sm"
                  >

                    {/* TOP */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">


                      {/* CUSTOMER */}

                      <div className="min-w-[180px]">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="font-bold text-[#542432]">

                            {
                              order
                                .customer
                                ?.name ||
                              "Customer"
                            }

                          </h3>

                          <OrderStatus
                            status={
                              order.orderStatus
                            }
                          />

                        </div>


                        <p className="mt-1 text-xs text-gray-400">

                          Order #

                          {order._id
                            .slice(-8)
                            .toUpperCase()}

                        </p>


                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">

                          <Phone
                            size={
                              14
                            }
                          />

                          {
                            order
                              .customer
                              ?.phone
                          }

                        </div>

                      </div>


                      {/* CAKES */}

                      <div className="min-w-[220px]">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">

                          Items

                        </p>

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => (

                            <p
                              key={
                                index
                              }
                              className="mb-1 text-sm font-semibold text-[#704653]"
                            >

                              {
                                item.name
                              }

                              {" "}

                              <span className="font-normal text-gray-400">

                                {
                                  item.weight
                                }

                                {" "}×{" "}

                                {
                                  item.quantity
                                }

                              </span>

                            </p>

                          )
                        )}

                      </div>


                      {/* DELIVERY */}

                      <div className="min-w-[150px]">

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <CalendarDays
                            size={
                              14
                            }
                          />

                          Delivery

                        </div>

                        <p className="mt-2 text-sm font-bold text-[#542432]">

                          {
                            order.deliveryDate ||
                            "Not set"
                          }

                        </p>

                        <p className="mt-1 text-xs text-gray-400">

                          {
                            order.deliverySlot ||
                            ""
                          }

                        </p>

                      </div>


                      {/* PAYMENT */}

                      <div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <CreditCard
                            size={
                              14
                            }
                          />

                          Payment

                        </div>

                        <p className="mt-2 text-sm font-bold text-[#542432]">

                          {
                            order.paymentMethod
                          }

                        </p>

                      </div>


                      {/* TOTAL */}

                      <div className="text-left xl:text-right">

                        <p className="text-xs text-gray-400">

                          Total

                        </p>

                        <p className="mt-1 text-xl font-black text-pink-500">

                          ₹
                          {
                            order.totalAmount
                          }

                        </p>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-pink-50 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-gray-400">

                        Ordered{" "}

                        {
                          order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString()
                            : ""
                        }

                      </p>


                      <OrderActions
                        order={
                          order
                        }
                        onUpdate={
                          updateOrderStatus
                        }
                        loading={
                          updatingOrder ===
                          order._id
                        }
                      />

                    </div>

                  </motion.div>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  icon: Icon,
  title,
  value,
}) {
  return (

    <motion.div
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-[1.7rem] bg-white p-6 shadow-[0_15px_50px_rgba(80,30,45,0.06)]"
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">

        <Icon
          size={20}
        />

      </div>

      <p className="mt-5 text-sm text-gray-400">

        {
          title
        }

      </p>

      <p className="mt-1 text-3xl font-black text-[#542432]">

        {
          value
        }

      </p>

    </motion.div>

  );
}


/* =========================
   ORDER STATUS
========================= */

function OrderStatus({
  status,
}) {

  const labels = {
    placed:
      "New Order",

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
      "bg-pink-50 text-pink-500",

    confirmed:
      "bg-blue-50 text-blue-600",

    baking:
      "bg-orange-50 text-orange-600",

    "out-for-delivery":
      "bg-purple-50 text-purple-600",

    delivered:
      "bg-green-50 text-green-600",

    cancelled:
      "bg-red-50 text-red-500",

  };


  return (

    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] ||
        "bg-gray-50 text-gray-500"
      }`}
    >

      {
        labels[status] ||
        status
      }

    </span>

  );
}


/* =========================
   ORDER ACTIONS
========================= */

function OrderActions({
  order,
  onUpdate,
  loading,
}) {

  const status =
    order.orderStatus;


  if (loading) {

    return (

      <div className="flex items-center gap-2 text-xs font-bold text-pink-500">

        <RefreshCw
          size={14}
          className="animate-spin"
        />

        Updating...

      </div>

    );

  }


  /* NEW ORDER */

  if (
    status === "placed"
  ) {

    return (

      <div className="flex flex-wrap gap-2">

        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onUpdate(
              order._id,
              "confirmed"
            )
          }
          className="rounded-full bg-green-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
        >

          Accept Order

        </motion.button>


        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onUpdate(
              order._id,
              "cancelled"
            )
          }
          className="rounded-full bg-red-50 px-5 py-2.5 text-xs font-bold text-red-500"
        >

          Cancel

        </motion.button>

      </div>

    );

  }


  /* CONFIRMED */

  if (
    status ===
    "confirmed"
  ) {

    return (

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        onClick={() =>
          onUpdate(
            order._id,
            "baking"
          )
        }
        className="rounded-full bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
      >

        Start Baking 🎂

      </motion.button>

    );

  }


  /* BAKING */

  if (
    status === "baking"
  ) {

    return (

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        onClick={() =>
          onUpdate(
            order._id,
            "out-for-delivery"
          )
        }
        className="rounded-full bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
      >

        Out for Delivery 🚚

      </motion.button>

    );

  }


  /* OUT FOR DELIVERY */

  if (
    status ===
    "out-for-delivery"
  ) {

    return (

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        onClick={() =>
          onUpdate(
            order._id,
            "delivered"
          )
        }
        className="rounded-full bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
      >

        Mark Delivered ✓

      </motion.button>

    );

  }


  /* DELIVERED */

  if (
    status ===
    "delivered"
  ) {

    return (

      <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-600">

        ✓ Order Completed

      </span>

    );

  }


  /* CANCELLED */

  if (
    status ===
    "cancelled"
  ) {

    return (

      <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-500">

        Order Cancelled

      </span>

    );

  }


  return null;
}


export default AdminDashboard;