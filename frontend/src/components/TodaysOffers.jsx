import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  ShoppingBag,
  Sparkles,
  RefreshCw,
  CakeSlice,
} from "lucide-react";

const API_URL =
  "http://localhost:5000/api/cakes";

function TodaysOffers() {
  const [cakes, setCakes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedWeights, setSelectedWeights] =
    useState({});

  /* =========================
     FETCH TODAY'S EXCLUSIVE
  ========================= */

  const fetchExclusiveCakes =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await axios.get(
            API_URL
          );

        const allCakes =
          response.data.cakes ||
          [];

        const exclusiveCakes =
          allCakes.filter(
            (cake) =>
              cake.isTodaysExclusive ===
                true &&
              cake.isAvailable !==
                false
          );

        setCakes(
          exclusiveCakes
        );

        /* =====================
           SET DEFAULT WEIGHTS
        ===================== */

        const defaults = {};

        exclusiveCakes.forEach(
          (cake) => {
            const weights =
              cake.prices
                ? Object.keys(
                    cake.prices
                  )
                : [];

            if (
              weights.length >
              0
            ) {
              defaults[
                cake._id
              ] =
                weights[0];
            }
          }
        );

        setSelectedWeights(
          defaults
        );
      } catch (error) {
        console.error(
          "Today's Exclusive error:",
          error
        );

        setError(
          "Unable to load today's exclusive cakes."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    fetchExclusiveCakes();
  }, []);

  /* =========================
     SELECT WEIGHT
  ========================= */

  const selectWeight = (
    cakeId,
    weight
  ) => {
    setSelectedWeights(
      (current) => ({
        ...current,

        [cakeId]:
          weight,
      })
    );
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (
    cake
  ) => {
    const selectedWeight =
      selectedWeights[
        cake._id
      ];

    if (
      !selectedWeight
    ) {
      alert(
        "Please select a cake weight."
      );

      return;
    }

    const selectedPrice =
      cake.prices?.[
        selectedWeight
      ];

    if (
      !selectedPrice
    ) {
      alert(
        "Price is unavailable for this weight."
      );

      return;
    }

    const cartItem = {
      _id: cake._id,

      name:
        cake.name,

      image:
        cake.image,

      weight:
        selectedWeight,

      price:
        Number(
          selectedPrice
        ),

      quantity: 1,
    };

    /*
     * Send cake to the cart system.
     *
     * CartDrawer / CartContext can listen
     * for this event.
     */

    window.dispatchEvent(
      new CustomEvent(
        "add-to-cart",
        {
          detail:
            cartItem,
        }
      )
    );

    /*
     * Tell CartDrawer to open.
     */

    window.dispatchEvent(
      new CustomEvent(
        "open-cart"
      )
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="bg-[#fff8f5] px-4 py-14 sm:px-6 md:py-20">

        <div className="mx-auto max-w-7xl text-center">

          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-pink-500"
          />

          <p className="mt-4 text-sm font-medium text-gray-400">
            Loading today's
            exclusive cakes...
          </p>

        </div>

      </section>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="bg-[#fff8f5] px-4 py-14 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[2rem] bg-white px-6 py-12 text-center">

            <CakeSlice
              size={38}
              className="mx-auto text-pink-200"
            />

            <p className="mt-4 text-sm font-semibold text-[#542432]">
              {error}
            </p>

            <button
              onClick={
                fetchExclusiveCakes
              }
              className="mt-5 rounded-full bg-[#542432] px-6 py-3 text-sm font-bold text-white"
            >
              Try Again
            </button>

          </div>

        </div>

      </section>
    );
  }

  /* =========================
     NO EXCLUSIVE CAKES
  ========================= */

  if (
    cakes.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="todays-exclusive"
      className="overflow-hidden bg-[#fff8f5] px-4 py-14 sm:px-6 md:py-20"
    >

      <div className="mx-auto max-w-7xl">

        {/* =====================
            SECTION HEADER
        ===================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={17}
                className="text-pink-500"
              />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500 sm:text-sm">
                Handpicked for you
              </p>

            </div>


            <h2 className="mt-3 font-serif text-3xl font-bold text-[#542432] sm:text-4xl md:text-5xl">

              Today's Exclusive

            </h2>


            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">

              Special cakes selected
              for today. Pick your
              favourite flavour and
              choose the perfect size.

            </p>

          </div>


          <div className="hidden rounded-full bg-white px-5 py-2.5 text-xs font-bold text-pink-500 shadow-sm sm:block">

            {cakes.length}
            {" "}
            {cakes.length === 1
              ? "Exclusive Cake"
              : "Exclusive Cakes"}

          </div>

        </div>


        {/* =====================
            CAKES GRID
        ===================== */}

       <div
  className="
    mt-8
    flex
    snap-x
    snap-mandatory
    gap-4
    overflow-x-auto
    pb-6

    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden

    sm:grid
    sm:grid-cols-2
    sm:gap-5
    sm:overflow-visible
    sm:pb-0

    lg:grid-cols-3
  "
>

          {cakes.map(
            (
              cake,
              index
            ) => {

              const prices =
                cake.prices ||
                {};

              const weights =
                Object.keys(
                  prices
                );

              const selectedWeight =
                selectedWeights[
                  cake._id
                ] ||
                weights[0];

              const selectedPrice =
                prices[
                  selectedWeight
                ];

              return (

                <motion.article
                  key={
                    cake._id
                  }
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index *
                      0.08,
                  }}
                  className="
  min-w-[88%]
  max-w-[360px]
  shrink-0
  snap-center
  overflow-hidden
  rounded-[1.8rem]
  bg-white
  shadow-[0_18px_60px_rgba(84,36,50,0.08)]

  sm:min-w-0
  sm:max-w-none
"
                >

                  {/* =================
                      IMAGE
                  ================= */}

                  <div className="relative h-56 overflow-hidden bg-pink-50 sm:h-64">

                    {cake.image ? (

                      <motion.img
                        whileHover={{
                          scale:
                            1.04,
                        }}
                        transition={{
                          duration:
                            0.4,
                        }}
                        src={
                          cake.image
                        }
                        alt={
                          cake.name
                        }
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">

                        <CakeSlice
                          size={55}
                          className="text-pink-200"
                        />

                      </div>

                    )}


                    {/* EXCLUSIVE BADGE */}

                    <div className="absolute left-4 top-4">

                      <span className="flex items-center gap-1.5 rounded-full bg-[#542432] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">

                        <Sparkles
                          size={12}
                        />

                        Today's Exclusive

                      </span>

                    </div>

                  </div>


                  {/* =================
                      CONTENT
                  ================= */}

                  <div className="p-5 sm:p-6">

                    {/* CATEGORY */}

                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-pink-400">

                      {cake.category ||
                        "Cake"}

                    </p>


                    {/* NAME */}

                    <h3 className="mt-2 font-serif text-2xl font-bold text-[#542432]">

                      {cake.name}

                    </h3>


                    {/* DESCRIPTION */}

                    {cake.description && (

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">

                        {cake.description}

                      </p>

                    )}


                    {/* =================
                        WEIGHT SELECTOR
                    ================= */}

                    {weights.length >
                      0 && (

                      <div className="mt-5">

                        <p className="text-xs font-bold text-[#542432]">

                          Choose Weight

                        </p>


                        <div className="mt-3 flex flex-wrap gap-2">

                          {weights.map(
                            (
                              weight
                            ) => {

                              const active =
                                selectedWeight ===
                                weight;

                              return (

                                <button
                                  key={
                                    weight
                                  }
                                  type="button"
                                  onClick={() =>
                                    selectWeight(
                                      cake._id,
                                      weight
                                    )
                                  }
                                  className={`min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition ${
                                    active
                                      ? "border-[#542432] bg-[#542432] text-white"
                                      : "border-pink-100 bg-pink-50 text-[#542432]"
                                  }`}
                                >

                                  {weight}

                                </button>

                              );
                            }
                          )}

                        </div>

                      </div>

                    )}


                    {/* =================
                        PRICE + CART
                    ================= */}

                   <div
  className="
    mt-6
    flex
    items-center
    justify-between
    gap-3
  "
>

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">

                          Price

                        </p>

                        <p className="mt-1 text-2xl font-black text-pink-500">

                          {selectedPrice
                            ? `₹${selectedPrice}`
                            : "N/A"}

                        </p>

                      </div>


                      <motion.button
                        whileTap={{
                          scale:
                            0.95,
                        }}
                        type="button"
                        disabled={
                          !selectedPrice
                        }
                        onClick={() =>
                          addToCart(
                            cake
                          )
                        }
                       className="
  flex
  min-h-12
  flex-1
  items-center
  justify-center
  gap-2
  rounded-full
  bg-[#542432]
  px-4
  py-3
  text-xs
  font-bold
  text-white
  shadow-lg
  transition
  hover:bg-[#6b3041]
  disabled:cursor-not-allowed
  disabled:opacity-40

  sm:flex-none
  sm:px-6
  sm:text-sm
"
                      >

                        <ShoppingBag
                          size={17}
                        />

                        Add to Cart

                      </motion.button>

                    </div>

                  </div>

                </motion.article>

              );
            }
          )}

        </div>

      </div>

    </section>
  );
}

export default TodaysOffers;