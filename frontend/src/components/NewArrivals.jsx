import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  X,
} from "lucide-react";

const API_URL =
  "http://localhost:5000/api/cakes";


/* =========================================
   NEW ARRIVALS
========================================= */

function NewArrivals() {

  const navigate =
    useNavigate();

  const [cakes, setCakes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);


  /* =========================================
     FETCH NEW CAKES
  ========================================= */

  useEffect(() => {

    const fetchCakes =
      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(
              API_URL
            );

          const allCakes =
            response.data.cakes ||
            [];

          const newCakes =
            allCakes.filter(
              (cake) =>
                cake.isNew ===
                  true &&
                cake.isAvailable !==
                  false
            );

          setCakes(
            newCakes
          );

        } catch (error) {

          console.error(
            "New arrivals error:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


    fetchCakes();

  }, []);


  /* =========================================
     NEXT CAKE
  ========================================= */

  const nextCake = () => {

    if (!cakes.length) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) %
        cakes.length
    );

  };


  /* =========================================
     PREVIOUS CAKE
  ========================================= */

  const previousCake = () => {

    if (!cakes.length) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current -
          1 +
          cakes.length) %
        cakes.length
    );

  };


  /* =========================================
     SELECT CAKE
  ========================================= */

  const selectCake = (
    index
  ) => {

    setActiveIndex(
      index
    );

  };


  /* =========================================
     LOADING / EMPTY
  ========================================= */

  if (loading) {

    return null;

  }


  if (!cakes.length) {

    return null;

  }


  const activeCake =
    cakes[activeIndex];


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-[#241016]
        px-4
        py-16
        text-white

        sm:px-6
        sm:py-20

        lg:min-h-[800px]
        lg:py-28
      "
    >

      {/* =====================================
          BACKGROUND GRID
      ===================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.07]

          [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />


      {/* =====================================
          BACKGROUND GLOW
      ===================================== */}

      <motion.div
        animate={{
          x: [
            0,
            60,
            0,
          ],

          y: [
            0,
            -30,
            0,
          ],
        }}

        transition={{
          duration: 12,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}

        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-80
          w-80
          rounded-full
          bg-pink-500/10
          blur-[100px]
        "
      />


      <motion.div
        animate={{
          x: [
            0,
            -40,
            0,
          ],
        }}

        transition={{
          duration: 15,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}

        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-96
          w-96
          rounded-full
          bg-orange-400/10
          blur-[120px]
        "
      />


      {/* =====================================
          MAIN CONTAINER
      ===================================== */}

      <div
        className="
          relative
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-12

          lg:grid-cols-[0.8fr_1.2fr]
          lg:gap-8
        "
      >


        {/* =================================
            LEFT CONTENT
        ================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}

          whileInView={{
            opacity: 1,
            x: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.7,
          }}

          className="
            relative
            z-20
          "
        >


          {/* LABEL */}

          <div
            className="
              flex
              items-center
              gap-2
              text-pink-300
            "
          >

            <Sparkles
              size={17}
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.35em]
              "
            >
              Fresh from the oven
            </span>

          </div>


          {/* TITLE */}

          <h2
            className="
              mt-4
              font-serif
              text-4xl
              font-bold
              leading-tight

              sm:text-5xl

              lg:text-6xl
            "
          >

            Meet Our

            <span
              className="
                block
                italic
                text-pink-300
              "
            >
              New Arrivals.
            </span>

          </h2>


          {/* DESCRIPTION */}

          <p
            className="
              mt-5
              max-w-md
              text-sm
              leading-7
              text-white/55

              sm:text-base
            "
          >
            Fresh creations,
            new flavours and
            handcrafted sweetness
            waiting to become part
            of your next celebration.
          </p>


          {/* =================================
              ACTIVE CAKE INFO
          ================================= */}

          <AnimatePresence
            mode="wait"
          >

            <motion.div
              key={
                activeCake._id
              }

              initial={{
                opacity: 0,
                y: 15,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -10,
              }}

              transition={{
                duration: 0.3,
              }}

              className="
                mt-8
                border-l-2
                border-pink-400
                pl-4
              "
            >

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-pink-300
                "
              >
                Featured New Cake
              </p>


              <h3
                className="
                  mt-2
                  font-serif
                  text-2xl
                  font-bold

                  sm:text-3xl
                "
              >
                {activeCake.name}
              </h3>


              {activeCake.category && (

                <p
                  className="
                    mt-1
                    text-sm
                    text-white/45
                  "
                >
                  {activeCake.category}
                </p>

              )}

            </motion.div>

          </AnimatePresence>


          {/* =================================
              BUTTONS
          ================================= */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3

              min-[420px]:flex-row
            "
          >

            <motion.button
              type="button"

              whileHover={{
                scale: 1.03,
              }}

              whileTap={{
                scale: 0.97,
              }}

              onClick={() =>
                navigate(
                  "/cakes",
                  {
                    state: {
                      selectedCakeId:
                        activeCake._id,
                    },
                  }
                )
              }

              className="
                flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                bg-pink-500
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-[0_15px_35px_rgba(236,72,153,0.25)]
              "
            >

              <ShoppingBag
                size={17}
              />

              Order Now

            </motion.button>


            <motion.button
              type="button"

              whileHover={{
                x: 4,
              }}

              whileTap={{
                scale: 0.97,
              }}

              onClick={() =>
                navigate(
                  "/cakes"
                )
              }

              className="
                flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-white/15
                bg-white/5
                px-6
                py-3
                text-sm
                font-bold
                backdrop-blur-md
              "
            >

              Explore Cakes

              <ArrowRight
                size={17}
              />

            </motion.button>

          </div>


          {/* =================================
              NAVIGATION
          ================================= */}

          {cakes.length >
            1 && (

            <div
              className="
                mt-8
                flex
                items-center
                gap-4

                lg:mt-10
              "
            >

              <motion.button
                type="button"

                whileHover={{
                  scale: 1.08,
                }}

                whileTap={{
                  scale: 0.9,
                }}

                onClick={
                  previousCake
                }

                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/5
                  backdrop-blur-md
                "
              >

                <ArrowLeft
                  size={17}
                />

              </motion.button>


              <span
                className="
                  min-w-[55px]
                  text-center
                  text-xs
                  font-bold
                  text-white/50
                "
              >

                {String(
                  activeIndex +
                    1
                ).padStart(
                  2,
                  "0"
                )}

                {" / "}

                {String(
                  cakes.length
                ).padStart(
                  2,
                  "0"
                )}

              </span>


              <motion.button
                type="button"

                whileHover={{
                  scale: 1.08,
                }}

                whileTap={{
                  scale: 0.9,
                }}

                onClick={
                  nextCake
                }

                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/5
                  backdrop-blur-md
                "
              >

                <ArrowRight
                  size={17}
                />

              </motion.button>

            </div>

          )}

        </motion.div>


        {/* =================================
            3D SHOWCASE
        ================================= */}

        <Cake3DShowcase
          cakes={cakes}
          activeIndex={
            activeIndex
          }
          onSelect={
            selectCake
          }
        />

      </div>

    </section>

  );

}


/* =========================================
   3D CAKE SHOWCASE
========================================= */

function Cake3DShowcase({
  cakes,
  activeIndex,
  onSelect,
}) {

  /* DESKTOP HOVER */

  const [
    isHovered,
    setIsHovered,
  ] = useState(false);


  /* MOBILE TAP */

  const [
    mobileExpanded,
    setMobileExpanded,
  ] = useState(false);


  const [
    hoveredCard,
    setHoveredCard,
  ] = useState(null);


  /* =====================================
     MOUSE MOTION
  ===================================== */

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);


  const smoothX =
    useSpring(
      mouseX,
      {
        stiffness: 100,
        damping: 25,
      }
    );


  const smoothY =
    useSpring(
      mouseY,
      {
        stiffness: 100,
        damping: 25,
      }
    );


  const rotateY =
    useTransform(
      smoothX,
      [
        -0.5,
        0.5,
      ],
      [
        -7,
        7,
      ]
    );


  const rotateX =
    useTransform(
      smoothY,
      [
        -0.5,
        0.5,
      ],
      [
        6,
        -6,
      ]
    );


  /* =====================================
     MOUSE MOVE
  ===================================== */

  const handleMouseMove = (
    event
  ) => {

    const rect =
      event.currentTarget
        .getBoundingClientRect();


    const x =
      (event.clientX -
        rect.left) /
        rect.width -
      0.5;


    const y =
      (event.clientY -
        rect.top) /
        rect.height -
      0.5;


    mouseX.set(x);

    mouseY.set(y);

  };


  /* =====================================
     DESKTOP MOUSE LEAVE
  ===================================== */

  const handleMouseLeave =
    () => {

      setIsHovered(
        false
      );

      setHoveredCard(
        null
      );

      mouseX.set(0);

      mouseY.set(0);

    };


  /* =====================================
     VISIBLE CAKES
  ===================================== */

  const visibleCakes =
    cakes.slice(
      0,
      5
    );


  /*
    DESKTOP EXPANDED POSITIONS
  */

  const expandedPositions = [

    {
      x: "-4%",
      y: "5%",
      rotate: -9,
      width: "46%",
    },

    {
      x: "48%",
      y: "1%",
      rotate: 7,
      width: "45%",
    },

    {
      x: "3%",
      y: "51%",
      rotate: 7,
      width: "42%",
    },

    {
      x: "52%",
      y: "48%",
      rotate: -8,
      width: "41%",
    },

    {
      x: "29%",
      y: "27%",
      rotate: 1,
      width: "43%",
    },

  ];


  /*
    COLLAPSED POSITIONS
  */

  const collapsedPositions = [

    {
      x: "25%",
      y: "20%",
      rotate: -5,
      width: "52%",
    },

    {
      x: "27%",
      y: "22%",
      rotate: 4,
      width: "52%",
    },

    {
      x: "24%",
      y: "24%",
      rotate: -2,
      width: "52%",
    },

    {
      x: "28%",
      y: "23%",
      rotate: 4,
      width: "52%",
    },

    {
      x: "26%",
      y: "20%",
      rotate: 0,
      width: "52%",
    },

  ];


  /*
    MOBILE EXPANDED POSITIONS

    Designed to keep all cards
    inside the phone screen.
  */

  const mobileExpandedPositions = [

    {
      x: "3%",
      y: "3%",
      rotate: -5,
      width: "46%",
    },

    {
      x: "51%",
      y: "5%",
      rotate: 5,
      width: "46%",
    },

    {
      x: "4%",
      y: "51%",
      rotate: 4,
      width: "44%",
    },

    {
      x: "52%",
      y: "52%",
      rotate: -5,
      width: "44%",
    },

    {
      x: "28%",
      y: "28%",
      rotate: 0,
      width: "44%",
    },

  ];


  /*
    MOBILE COLLAPSED
  */

  const mobileCollapsedPositions = [

    {
      x: "17%",
      y: "15%",
      rotate: -5,
      width: "66%",
    },

    {
      x: "18%",
      y: "17%",
      rotate: 4,
      width: "66%",
    },

    {
      x: "16%",
      y: "19%",
      rotate: -2,
      width: "66%",
    },

    {
      x: "19%",
      y: "18%",
      rotate: 3,
      width: "66%",
    },

    {
      x: "17%",
      y: "15%",
      rotate: 0,
      width: "66%",
    },

  ];


  return (

    <div
      className="
        relative
        mx-auto
        w-full
        max-w-[650px]
      "
    >

      {/* =====================================
          MOBILE TAP CONTROLS
      ===================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between

          lg:hidden
        "
      >

        <motion.button
          type="button"

          whileTap={{
            scale: 0.96,
          }}

          onClick={() =>
            setMobileExpanded(
              (current) =>
                !current
            )
          }

          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/5
            px-4
            py-2.5
            text-[9px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-white/60
            backdrop-blur-md
          "
        >

          <Sparkles
            size={13}
          />

          {mobileExpanded
            ? "Stack Cakes"
            : "Tap to Reveal"}

        </motion.button>


        {mobileExpanded && (

          <motion.button
            type="button"

            initial={{
              opacity: 0,
              scale: 0.7,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            onClick={() =>
              setMobileExpanded(
                false
              )
            }

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/5
              text-white/60
            "
          >

            <X
              size={15}
            />

          </motion.button>

        )}

      </div>


      {/* =====================================
          SHOWCASE CONTAINER
      ===================================== */}

      <motion.div

        onMouseEnter={() =>
          setIsHovered(
            true
          )
        }

        onMouseMove={
          handleMouseMove
        }

        onMouseLeave={
          handleMouseLeave
        }

        style={{
          rotateX,
          rotateY,

          transformPerspective:
            1300,
        }}

        className="
          relative
          mx-auto
          h-[430px]
          w-full
          max-w-[650px]

          sm:h-[520px]

          lg:h-[650px]
          lg:cursor-crosshair
        "
      >


        {/* =====================================
            LARGE BACKGROUND TEXT
        ===================================== */}

        <motion.div
          animate={{
            opacity:
              isHovered ||
              mobileExpanded
                ? 0.06
                : 0.025,
          }}

          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            select-none
            font-serif
            text-[90px]
            font-black
            tracking-[-0.1em]
            text-white

            sm:text-[150px]

            lg:text-[190px]
          "
        >
          NEW
        </motion.div>


        {/* =====================================
            DESKTOP HOVER INDICATOR
        ===================================== */}

        <AnimatePresence>

          {!isHovered && (

            <motion.div
              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              exit={{
                opacity: 0,
              }}

              className="
                pointer-events-none
                absolute
                inset-0
                z-[100]
                hidden
                items-end
                justify-center
                pb-5

                lg:flex
              "
            >

              <motion.div
                animate={{
                  y: [
                    0,
                    -4,
                    0,
                  ],
                }}

                transition={{
                  duration: 2,
                  repeat:
                    Infinity,
                }}

                className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-3
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-white/40
                  backdrop-blur-md
                "
              >
                Hover to reveal
              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================
            MOBILE TAP INDICATOR
        ===================================== */}

        <AnimatePresence>

          {!mobileExpanded && (

            <motion.div
              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              exit={{
                opacity: 0,
              }}

              className="
                pointer-events-none
                absolute
                bottom-5
                left-1/2
                z-[100]
                -translate-x-1/2

                lg:hidden
              "
            >

              <motion.div
                animate={{
                  y: [
                    0,
                    -4,
                    0,
                  ],
                }}

                transition={{
                  duration: 2,
                  repeat:
                    Infinity,
                }}

                className="
                  whitespace-nowrap
                  rounded-full
                  border
                  border-white/10
                  bg-[#241016]/70
                  px-4
                  py-2
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/50
                  backdrop-blur-md
                "
              >
                Tap above to reveal cakes
              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================
            DESKTOP CAKES
        ===================================== */}

        <div
          className="
            hidden
            lg:block
          "
        >

          {visibleCakes.map(
            (
              cake,
              index
            ) => {

              const isActive =
                index ===
                activeIndex;


              const isCardHovered =
                hoveredCard ===
                index;


              const expanded =
                expandedPositions[
                  index %
                    expandedPositions.length
                ];


              const collapsed =
                collapsedPositions[
                  index %
                    collapsedPositions.length
                ];


              return (

                <motion.button
                  key={
                    cake._id
                  }

                  type="button"

                  onMouseEnter={() =>
                    setHoveredCard(
                      index
                    )
                  }

                  onMouseLeave={() =>
                    setHoveredCard(
                      null
                    )
                  }

                  onClick={() =>
                    onSelect(
                      index
                    )
                  }

                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}

                  animate={{

                    left:
                      isHovered
                        ? expanded.x
                        : collapsed.x,

                    top:
                      isHovered
                        ? expanded.y
                        : collapsed.y,

                    width:
                      isHovered
                        ? expanded.width
                        : collapsed.width,

                    rotate:
                      isHovered
                        ? expanded.rotate
                        : collapsed.rotate,

                    opacity:
                      isHovered
                        ? 1
                        : isActive
                        ? 1
                        : 0.18,

                    scale:
                      isCardHovered
                        ? 1.1
                        : isHovered
                        ? isActive
                          ? 1.03
                          : 0.95
                        : isActive
                        ? 1
                        : 0.9,

                    zIndex:
                      isCardHovered
                        ? 100
                        : isActive
                        ? 50
                        : index +
                          10,

                  }}

                  transition={{
                    type:
                      "spring",
                    stiffness:
                      120,
                    damping:
                      18,
                    mass:
                      0.8,
                  }}

                  className="
                    absolute
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/15
                    bg-white/10
                    p-1.5
                    text-left
                    shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                    backdrop-blur-md
                  "
                >

                  <CakeShowcaseCard
                    cake={
                      cake
                    }

                    isActive={
                      isActive
                    }
                  />

                </motion.button>

              );

            }
          )}

        </div>


        {/* =====================================
            MOBILE + TABLET CAKES
        ===================================== */}

        <div
          className="
            block
            lg:hidden
          "
        >

          {visibleCakes.map(
            (
              cake,
              index
            ) => {

              const isActive =
                index ===
                activeIndex;


              const expanded =
                mobileExpandedPositions[
                  index %
                    mobileExpandedPositions.length
                ];


              const collapsed =
                mobileCollapsedPositions[
                  index %
                    mobileCollapsedPositions.length
                ];


              return (

                <motion.button
                  key={
                    cake._id
                  }

                  type="button"

                  onClick={() => {

                    if (
                      !mobileExpanded
                    ) {

                      setMobileExpanded(
                        true
                      );

                      return;

                    }


                    onSelect(
                      index
                    );

                  }}

                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}

                  animate={{

                    left:
                      mobileExpanded
                        ? expanded.x
                        : collapsed.x,

                    top:
                      mobileExpanded
                        ? expanded.y
                        : collapsed.y,

                    width:
                      mobileExpanded
                        ? expanded.width
                        : collapsed.width,

                    rotate:
                      mobileExpanded
                        ? expanded.rotate
                        : collapsed.rotate,

                    opacity:
                      mobileExpanded
                        ? 1
                        : isActive
                        ? 1
                        : 0.15,

                    scale:
                      mobileExpanded &&
                      isActive
                        ? 1.04
                        : isActive
                        ? 1
                        : 0.92,

                    zIndex:
                      isActive
                        ? 50
                        : index +
                          10,

                  }}

                  transition={{
                    type:
                      "spring",
                    stiffness:
                      120,
                    damping:
                      18,
                  }}

                  className="
                    absolute
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    p-1
                    text-left
                    shadow-[0_20px_50px_rgba(0,0,0,0.35)]
                    backdrop-blur-md

                    sm:rounded-2xl
                    sm:p-1.5
                  "
                >

                  <CakeShowcaseCard
                    cake={
                      cake
                    }

                    isActive={
                      isActive
                    }
                  />

                </motion.button>

              );

            }
          )}

        </div>


        {/* =====================================
            EXPLORE MESSAGE
        ===================================== */}

        <AnimatePresence>

          {(isHovered ||
            mobileExpanded) && (

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
              }}

              className="
                pointer-events-none
                absolute
                bottom-0
                left-1/2
                hidden
                -translate-x-1/2
                items-center
                gap-3
                whitespace-nowrap
                text-[8px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/35

                lg:flex
              "
            >

              <span
                className="
                  h-px
                  w-8
                  bg-white/20
                "
              />

              Select a cake

              <span
                className="
                  h-px
                  w-8
                  bg-white/20
                "
              />

            </motion.div>

          )}

        </AnimatePresence>

      </motion.div>

    </div>

  );

}


/* =========================================
   CAKE SHOWCASE CARD
========================================= */

function CakeShowcaseCard({
  cake,
  isActive,
}) {

  return (

    <div
      className="
        relative
        aspect-[4/3]
        overflow-hidden
        rounded-lg

        sm:rounded-xl
      "
    >

      {/* IMAGE */}

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
          "
        />

      ) : (

        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-[#542432]
            text-4xl
          "
        >
          🎂
        </div>

      )}


      {/* OVERLAY */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/85
          via-black/10
          to-transparent
        "
      />


      {/* DETAILS */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          p-2.5

          sm:p-4
        "
      >

        <span
          className="
            text-[6px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-pink-200

            sm:text-[8px]
          "
        >
          New Arrival
        </span>


        <p
          className="
            mt-1
            truncate
            font-serif
            text-xs
            font-bold
            text-white

            sm:text-lg
          "
        >
          {cake.name}
        </p>

      </div>


      {/* ACTIVE INDICATOR */}

      {isActive && (

        <motion.div
          initial={{
            scale: 0,
          }}

          animate={{
            scale: 1,
          }}

          className="
            absolute
            right-2
            top-2
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#542432]
            shadow-lg

            sm:right-3
            sm:top-3
            sm:h-8
            sm:w-8
          "
        >

          <Sparkles
            size={13}
          />

        </motion.div>

      )}

    </div>

  );

}


export default NewArrivals;