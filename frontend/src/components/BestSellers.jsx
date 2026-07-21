import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowRight,
  Flame,
  Crown,
  ShoppingBag,
} from "lucide-react";

const API_URL =
  "http://localhost:5000/api/cakes";

function BestSellers() {
  const navigate = useNavigate();

  const [cakes, setCakes] =
    useState([]);

  const [
    activeTab,
    setActiveTab,
  ] = useState("trending");

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH CAKES
  ========================= */

  useEffect(() => {
    const fetchCakes =
      async () => {
        try {
          setLoading(true);

          const response =
            await axios.get(
              API_URL
            );

          setCakes(
            response.data
              .cakes || []
          );
        } catch (error) {
          console.error(
            "Best sellers error:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCakes();
  }, []);

  /* =========================
     FILTER CAKES
  ========================= */

  const filteredCakes =
    cakes.filter(
      (cake) => {

        // Do not show
        // unavailable cakes

        if (
          cake.isAvailable ===
          false
        ) {
          return false;
        }

        // Trending cakes

        if (
          activeTab ===
          "trending"
        ) {
          return (
            cake.isTrending ===
            true
          );
        }

        // Most ordered cakes

        if (
          activeTab ===
          "mostOrdered"
        ) {
          return (
            cake.isMostOrdered ===
            true
          );
        }

        return false;
      }
    );

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fffaf7]
        px-4
        py-16

        sm:px-6
        sm:py-20

        lg:py-24
      "
    >

      {/* =========================
          BACKGROUND DECORATION
      ========================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-0
          h-80
          w-80
          rounded-full
          bg-pink-100/50
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-orange-100/40
          blur-[100px]
        "
      />


      <div
        className="
          relative
          mx-auto
          max-w-7xl
        "
      >

        {/* =========================
            SECTION HEADER
        ========================= */}

        <div
          className="
            flex
            flex-col
            gap-7

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="
                flex
                items-center
                gap-2
                text-pink-500
              "
            >

              {activeTab ===
              "trending" ? (

                <Flame
                  size={17}
                />

              ) : (

                <Crown
                  size={17}
                />

              )}

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                "
              >
                Customer Favourites
              </span>

            </motion.div>


            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="
                mt-3
                font-serif
                text-4xl
                font-bold
                tracking-tight
                text-[#542432]

                sm:text-5xl
              "
            >
              Sweetest Picks
            </motion.h2>


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
              Discover the cakes everyone
              is loving right now.
            </p>

          </div>


          {/* =========================
              DESKTOP VIEW ALL
          ========================= */}

          <motion.button
            type="button"
            whileHover={{
              x: 4,
            }}
            onClick={() =>
              navigate("/cakes")
            }
            className="
              hidden
              items-center
              gap-2
              text-sm
              font-bold
              text-[#542432]

              sm:flex
            "
          >

            Explore All Cakes

            <ArrowRight
              size={17}
            />

          </motion.button>

        </div>


        {/* =========================
            TABS
        ========================= */}

        <div
          className="
            mt-8
            flex
            w-full
            rounded-full
            bg-[#542432]/5
            p-1.5

            sm:w-fit
          "
        >

          {/* TRENDING */}

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "trending"
              )
            }
            className={`
              relative
              flex
              min-h-12
              flex-1
              items-center
              justify-center
              gap-2
              rounded-full
              px-4
              py-3
              text-xs
              font-bold
              transition

              sm:flex-none
              sm:px-6
              sm:text-sm

              ${
                activeTab ===
                "trending"
                  ? "bg-[#542432] text-white shadow-lg"
                  : "text-[#8d6974]"
              }
            `}
          >

            <Flame
              size={16}
            />

            Trending

          </button>


          {/* MOST ORDERED */}

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "mostOrdered"
              )
            }
            className={`
              relative
              flex
              min-h-12
              flex-1
              items-center
              justify-center
              gap-2
              rounded-full
              px-4
              py-3
              text-xs
              font-bold
              transition

              sm:flex-none
              sm:px-6
              sm:text-sm

              ${
                activeTab ===
                "mostOrdered"
                  ? "bg-[#542432] text-white shadow-lg"
                  : "text-[#8d6974]"
              }
            `}
          >

            <Crown
              size={16}
            />

            Most Ordered

          </button>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat:
                  Infinity,
                ease:
                  "linear",
              }}
              className="
                h-9
                w-9
                rounded-full
                border-2
                border-pink-100
                border-t-pink-500
              "
            />

          </div>

        )}


        {/* =========================
            NO CAKES
        ========================= */}

        {!loading &&
          filteredCakes.length ===
            0 && (

            <div
              className="
                mt-10
                flex
                min-h-[250px]
                flex-col
                items-center
                justify-center
                rounded-[2rem]
                border
                border-dashed
                border-[#542432]/10
                bg-white/60
                px-6
                text-center
              "
            >

              {activeTab ===
              "trending" ? (

                <Flame
                  size={35}
                  className="
                    text-pink-200
                  "
                />

              ) : (

                <Crown
                  size={35}
                  className="
                    text-pink-200
                  "
                />

              )}


              <h3
                className="
                  mt-4
                  font-serif
                  text-xl
                  font-bold
                  text-[#542432]
                "
              >
                More sweetness
                coming soon
              </h3>


              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  text-gray-400
                "
              >
                Check back soon for
                our latest customer
                favourites.
              </p>

            </div>

          )}


        {/* =========================
            MOBILE SWIPE HINT
        ========================= */}

        {!loading &&
          filteredCakes.length >
            1 && (

            <div
              className="
                mt-7
                flex
                items-center
                justify-between
                sm:hidden
              "
            >

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#542432]/40
                "
              >
                Swipe to explore
              </p>


              <div
                className="
                  flex
                  items-center
                  gap-1
                "
              >

                <span
                  className="
                    h-1.5
                    w-5
                    rounded-full
                    bg-[#542432]
                  "
                />

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#542432]/20
                  "
                />

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#542432]/20
                  "
                />

              </div>

            </div>

          )}


        {/* =========================
            CAKE CARDS

            MOBILE:
            Horizontal swipe

            TABLET/DESKTOP:
            Grid
        ========================= */}

        {!loading &&
          filteredCakes.length >
            0 && (

            <motion.div
              key={
                activeTab
              }
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-4
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                pb-6

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:mt-10
                sm:grid
                sm:grid-cols-2
                sm:gap-6
                sm:overflow-visible
                sm:pb-0

                lg:grid-cols-4
              "
            >

              {filteredCakes
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    cake,
                    index
                  ) => (

                    <motion.article
                      key={
                        cake._id
                      }
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
                      }}
                      transition={{
                        delay:
                          index *
                          0.06,
                      }}
                      whileHover={{
                        y: -6,
                      }}
                      className="
                        group
                        min-w-[78vw]
                        max-w-[310px]
                        shrink-0
                        snap-center
                        overflow-hidden
                        rounded-[1.8rem]
                        bg-white
                        shadow-[0_10px_35px_rgba(84,36,50,0.07)]

                        sm:min-w-0
                        sm:max-w-none
                        sm:rounded-[2rem]
                      "
                    >

                      {/* =================
                          IMAGE
                      ================= */}

                      <div
                        className="
                          relative
                          aspect-square
                          overflow-hidden
                          bg-[#fdf3f5]
                        "
                      >

                        {cake.image ? (

                          <img
                            src={
                              cake.image
                            }
                            alt={
                              cake.name
                            }
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-700

                              sm:group-hover:scale-110
                            "
                          />

                        ) : (

                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              font-serif
                              text-5xl
                              text-pink-200
                            "
                          >
                            🎂
                          </div>

                        )}


                        {/* =================
                            BADGE
                        ================= */}

                        <div
                          className="
                            absolute
                            left-3
                            top-3
                          "
                        >

                          <span
                            className="
                              flex
                              items-center
                              gap-1
                              rounded-full
                              bg-white/90
                              px-2.5
                              py-1.5
                              text-[9px]
                              font-bold
                              text-[#542432]
                              shadow-sm
                              backdrop-blur-md

                              sm:text-[10px]
                            "
                          >

                            {activeTab ===
                            "trending" ? (

                              <>

                                <Flame
                                  size={11}
                                />

                                Trending

                              </>

                            ) : (

                              <>

                                <Crown
                                  size={11}
                                />

                                Most Ordered

                              </>

                            )}

                          </span>

                        </div>

                      </div>


                      {/* =================
                          DETAILS
                      ================= */}

                      <div
                        className="
                          p-5
                          sm:p-5
                        "
                      >

                        {/* CATEGORY */}

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-pink-400
                          "
                        >

                          {cake.category ||
                            "Handcrafted Cake"}

                        </p>


                        {/* CAKE NAME */}

                        <h3
                          className="
                            mt-1.5
                            line-clamp-2
                            font-serif
                            text-xl
                            font-bold
                            text-[#542432]
                          "
                        >

                          {cake.name}

                        </h3>


                        {/* =================
                            PRICE + BUTTON
                        ================= */}

                        <div
                          className="
                            mt-5
                            flex
                            items-end
                            justify-between
                            gap-3
                          "
                        >

                          <div>

                            <p
                              className="
                                text-[9px]
                                text-gray-400
                              "
                            >
                              Starting from
                            </p>


                            <p
                              className="
                                mt-0.5
                                text-lg
                                font-black
                                text-[#542432]
                              "
                            >

                              ₹
                              {getStartingPrice(
                                cake
                              )}

                            </p>

                          </div>


                          {/* VIEW / ORDER BUTTON */}

                          <motion.button
                            type="button"
                            whileTap={{
                              scale:
                                0.9,
                            }}
                            whileHover={{
                              scale:
                                1.05,
                            }}
                            onClick={() =>
                              navigate(
                                "/cakes",
                                {
                                  state: {
                                    selectedCakeId:
                                      cake._id,
                                  },
                                }
                              )
                            }
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#542432]
                              text-white
                              shadow-md
                              transition

                              sm:group-hover:bg-pink-500
                            "
                            aria-label={`View ${cake.name}`}
                          >

                            <ShoppingBag
                              size={17}
                            />

                          </motion.button>

                        </div>

                      </div>

                    </motion.article>

                  )
                )}

            </motion.div>

          )}


        {/* =========================
            MOBILE VIEW ALL
        ========================= */}

        {!loading &&
          filteredCakes.length >
            0 && (

            <motion.button
              type="button"
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                navigate(
                  "/cakes"
                )
              }
              className="
                mt-4
                flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#542432]/10
                bg-white/50
                py-4
                text-sm
                font-bold
                text-[#542432]

                sm:hidden
              "
            >

              Explore All Cakes

              <ArrowRight
                size={17}
              />

            </motion.button>

          )}

      </div>

    </section>
  );
}


/* =========================
   GET STARTING PRICE
========================= */

function getStartingPrice(
  cake
) {

  if (!cake.prices) {
    return (
      cake.price ||
      0
    );
  }

  let values = [];

  if (
    cake.prices instanceof
    Map
  ) {

    values =
      Array.from(
        cake.prices.values()
      );

  } else {

    values =
      Object.values(
        cake.prices
      );

  }


  const validPrices =
    values
      .map(Number)
      .filter(
        (price) =>
          !Number.isNaN(
            price
          ) &&
          price > 0
      );


  if (
    !validPrices.length
  ) {

    return (
      cake.price ||
      0
    );

  }


  return Math.min(
    ...validPrices
  );
}


export default BestSellers;