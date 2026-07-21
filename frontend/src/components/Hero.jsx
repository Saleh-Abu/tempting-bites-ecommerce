import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import strawberryCake from "../assets/cakes/strawberry-cake.png";
import chocolateCake from "../assets/cakes/chocolate-cake.png";
import redVelvetCake from "../assets/cakes/red-velvet-cake.png";
import blueberryCake from "../assets/cakes/blueberry-cake.png";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/cakes";

/* =========================================
   TRANSPARENT HERO IMAGES
========================================= */

const getHeroCakeImage = (cake) => {
  const text = `${cake?.name || ""} ${cake?.category || ""}`.toLowerCase();

  if (text.includes("strawberry")) {
    return strawberryCake;
  }

  if (
    text.includes("chocolate") ||
    text.includes("truffle") ||
    text.includes("kunafa")
  ) {
    return chocolateCake;
  }

  if (text.includes("red velvet")) {
    return redVelvetCake;
  }

  if (text.includes("blueberry")) {
    return blueberryCake;
  }

  return cake?.image || "";
};

/* =========================================
   CAKE THEME
========================================= */

const getCakeTheme = (cake) => {
  const text = `${cake?.name || ""} ${cake?.category || ""}`.toLowerCase();

  if (text.includes("strawberry")) {
    return {
      background:
        "linear-gradient(135deg, #bd3c63 0%, #df5e83 50%, #f18fab 100%)",
      accent: "#ffe4ec",
      glow: "rgba(255,190,210,0.35)",
      label: "Strawberry Collection",
    };
  }

  if (text.includes("pistachio") || text.includes("pista")) {
    return {
      background:
        "linear-gradient(135deg, #496f46 0%, #789a65 50%, #a9c17f 100%)",
      accent: "#f0f6d7",
      glow: "rgba(218,238,178,0.35)",
      label: "Pistachio Collection",
    };
  }

  if (text.includes("red velvet")) {
    return {
      background:
        "linear-gradient(135deg, #571923 0%, #912b3e 50%, #c94e64 100%)",
      accent: "#ffe0e5",
      glow: "rgba(255,190,200,0.3)",
      label: "Red Velvet Collection",
    };
  }

  if (
    text.includes("chocolate") ||
    text.includes("truffle") ||
    text.includes("kunafa")
  ) {
    return {
      background:
        "linear-gradient(135deg, #321b18 0%, #5d332b 50%, #8c594b 100%)",
      accent: "#f5d8c7",
      glow: "rgba(238,194,169,0.28)",
      label: "Chocolate Collection",
    };
  }

  if (text.includes("mango")) {
    return {
      background:
        "linear-gradient(135deg, #c47a0d 0%, #e5a927 50%, #f6ce64 100%)",
      accent: "#fff5c7",
      glow: "rgba(255,226,125,0.35)",
      label: "Mango Collection",
    };
  }

  if (text.includes("blueberry")) {
    return {
      background:
        "linear-gradient(135deg, #34345e 0%, #565487 50%, #8884b9 100%)",
      accent: "#e7e5ff",
      glow: "rgba(200,197,255,0.3)",
      label: "Blueberry Collection",
    };
  }

  if (text.includes("vanilla")) {
    return {
      background:
        "linear-gradient(135deg, #a97858 0%, #c99a75 50%, #e5c2a0 100%)",
      accent: "#fff2dc",
      glow: "rgba(255,231,195,0.35)",
      label: "Vanilla Collection",
    };
  }

  return {
    background:
      "linear-gradient(135deg, #542432 0%, #8d4159 50%, #c46c87 100%)",
    accent: "#ffe1e9",
    glow: "rgba(255,205,220,0.3)",
    label: "Tempting Bites Exclusive",
  };
};

/* =========================================
   HERO
========================================= */

function Hero() {
  const navigate = useNavigate();

  const heroRef = useRef(null);

  const [cakes, setCakes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  /* =========================================
     3D MOUSE MOTION VALUES
  ========================================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  /*
    Mouse position:
    -1 = left/top
     0 = center
     1 = right/bottom
  */

  const rotateY = useTransform(smoothX, [-1, 1], [-12, 12]);

  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);

  const cakeMoveX = useTransform(smoothX, [-1, 1], [-18, 18]);

  const cakeMoveY = useTransform(smoothY, [-1, 1], [-12, 12]);

  const glowMoveX = useTransform(smoothX, [-1, 1], [-35, 35]);

  const glowMoveY = useTransform(smoothY, [-1, 1], [-25, 25]);

  /* =========================================
     FETCH CAKES
  ========================================= */

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await axios.get(API_URL);

        const allCakes = response.data.cakes || [];

        const featured = allCakes.filter(
          (cake) =>
            cake.isFeatured === true &&
            cake.isAvailable !== false
        );

        const available = allCakes.filter(
          (cake) => cake.isAvailable !== false
        );

        setCakes(
          featured.length
            ? featured
            : available.slice(0, 5)
        );
      } catch (error) {
        console.error("Hero error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  /* =========================================
     NEXT / PREVIOUS
  ========================================= */

  const nextCake = () => {
    if (cakes.length <= 1) return;

    setActiveIndex(
      (current) =>
        (current + 1) % cakes.length
    );
  };

  const previousCake = () => {
    if (cakes.length <= 1) return;

    setActiveIndex(
      (current) =>
        (current - 1 + cakes.length) %
        cakes.length
    );
  };

  /* =========================================
     AUTO SLIDE
  ========================================= */

  useEffect(() => {
    if (
      cakes.length <= 1 ||
      paused
    ) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) %
          cakes.length
      );
    }, 5000);

    return () =>
      clearInterval(interval);
  }, [cakes.length, paused]);

  /* =========================================
     MOUSE 3D PARALLAX
  ========================================= */

  const handleMouseMove = (event) => {
    /*
      Disable mouse effect for touch-like devices.
    */

    if (
      window.matchMedia(
        "(pointer: coarse)"
      ).matches
    ) {
      return;
    }

    const element =
      heroRef.current;

    if (!element) return;

    const rect =
      element.getBoundingClientRect();

    const x =
      (event.clientX -
        rect.left) /
      rect.width;

    const y =
      (event.clientY -
        rect.top) /
      rect.height;

    mouseX.set(
      (x - 0.5) * 2
    );

    mouseY.set(
      (y - 0.5) * 2
    );
  };

  const handleMouseLeave = () => {
    setPaused(false);

    /*
      Smoothly returns cake
      to center.
    */

    mouseX.set(0);
    mouseY.set(0);
  };

  /* =========================================
     CAROUSEL POSITION
  ========================================= */

  const getPosition = (index) => {
    const total = cakes.length;

    if (!total) {
      return 0;
    }

    let difference =
      index - activeIndex;

    if (
      difference >
      total / 2
    ) {
      difference -= total;
    }

    if (
      difference <
      -total / 2
    ) {
      difference += total;
    }

    return difference;
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <section className="flex min-h-[100svh] items-center justify-center bg-[#542432]">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white"
        />
      </section>
    );
  }

  /* =========================================
     NO CAKES
  ========================================= */

  if (!cakes.length) {
    return (
      <section className="flex min-h-[100svh] items-center justify-center bg-[#542432] px-6 text-center text-white">
        <div>
          <Sparkles
            size={30}
            className="mx-auto"
          />

          <h1 className="mt-5 font-serif text-4xl font-bold">
            Something Sweet Is Coming
          </h1>
        </div>
      </section>
    );
  }

  const activeCake =
    cakes[activeIndex];

  const theme =
    getCakeTheme(activeCake);

  return (
    <motion.section
      ref={heroRef}
      animate={{
        background:
          theme.background,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      onMouseMove={
        handleMouseMove
      }
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={
        handleMouseLeave
      }
      className="relative min-h-[100svh] overflow-hidden text-white"
    >

      {/* =====================================
          AMBIENT GLOW
      ===================================== */}

      <motion.div
        style={{
          background:
            theme.glow,
          x: glowMoveX,
          y: glowMoveY,
        }}
        className="
          pointer-events-none
          absolute
          -right-32
          top-10
          h-[320px]
          w-[320px]
          rounded-full
          blur-[70px]

          sm:h-[450px]
          sm:w-[450px]

          lg:h-[600px]
          lg:w-[600px]
          lg:blur-[110px]
        "
      />

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            theme.glow,
        }}
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32
          h-[300px]
          w-[300px]
          rounded-full
          blur-[80px]

          sm:h-[400px]
          sm:w-[400px]
        "
      />

      {/* PREMIUM LIGHT OVERLAY */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-black/10
          via-transparent
          to-white/10
        "
      />

      {/* =====================================
          BACKGROUND TEXT
      ===================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={
            activeCake._id
          }
          initial={{
            opacity: 0,
            x: 100,
          }}
          animate={{
            opacity: 0.06,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -100,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            pointer-events-none
            absolute
            right-[-2%]
            top-1/2
            hidden
            -translate-y-1/2
            select-none
            font-serif
            text-[13rem]
            font-black
            uppercase
            tracking-tight
            lg:block
          "
        >
          SWEET
        </motion.div>
      </AnimatePresence>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-[100svh]
          max-w-[1450px]
          grid-cols-1
          content-start
          px-4
          pb-20
          pt-[105px]

          sm:px-7
          sm:pt-[120px]

          lg:grid-cols-[0.85fr_1.15fr]
          lg:items-center
          lg:gap-5
          lg:px-12
          lg:pb-12
          lg:pt-24
        "
      >

        {/* =================================
            LEFT CONTENT
        ================================= */}

        <div
          className="
            order-2
            z-20
            -mt-3
            text-center

            sm:mt-0

            lg:order-1
            lg:text-left
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={
                activeCake._id
              }
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.5,
              }}
            >

              {/* COLLECTION */}

              <div
                style={{
                  color:
                    theme.accent,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  lg:justify-start
                "
              >
                <Sparkles
                  size={14}
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] sm:text-[10px] lg:text-xs">
                  {theme.label}
                </span>
              </div>

              {/* TITLE */}

              <h1
                className="
                  mx-auto
                  mt-3
                  max-w-xl
                  font-serif
                  text-[2.35rem]
                  font-bold
                  leading-[0.98]
                  tracking-[-0.03em]

                  min-[380px]:text-[2.7rem]

                  sm:mt-4
                  sm:text-5xl

                  md:text-6xl

                  lg:mx-0
                  lg:max-w-2xl
                  lg:text-[5.5rem]
                "
              >
                Taste Joy

                <span className="block">
                  in Every Bite.
                </span>
              </h1>

              {/* CAKE NAME */}

              <motion.h2
                style={{
                  color:
                    theme.accent,
                }}
                className="mt-4 text-lg font-bold sm:mt-5 sm:text-2xl lg:text-3xl"
              >
                {activeCake.name}
              </motion.h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-xs
                  leading-5
                  text-white/70

                  sm:text-sm
                  sm:leading-6

                  lg:mx-0
                  lg:mt-4
                  lg:max-w-lg
                  lg:text-base
                  lg:leading-7
                "
              >
                {activeCake.description ||
                  "A handcrafted creation made fresh for your sweetest celebrations."}
              </p>

              {/* BUTTONS */}

              <div
                className="
                  mx-auto
                  mt-5
                  grid
                  max-w-sm
                  grid-cols-2
                  gap-2.5

                  sm:mt-7
                  sm:flex
                  sm:max-w-none
                  sm:justify-center
                  sm:gap-3

                  lg:justify-start
                "
              >
                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.96,
                  }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  onClick={() =>
                    navigate(
                      "/cakes"
                    )
                  }
                  className="
                    flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-white
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-[#542432]
                    shadow-[0_15px_35px_rgba(0,0,0,0.18)]

                    sm:min-h-[52px]
                    sm:px-7
                    sm:text-sm
                  "
                >
                  <ShoppingBag
                    size={16}
                  />

                  Order Now
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.96,
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  onClick={() =>
                    navigate(
                      "/cakes"
                    )
                  }
                  className="
                    flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-white/30
                    bg-white/10
                    px-4
                    py-3
                    text-xs
                    font-bold
                    backdrop-blur-xl

                    sm:min-h-[52px]
                    sm:px-7
                    sm:text-sm
                  "
                >
                  Explore

                  <ArrowRight
                    size={16}
                  />
                </motion.button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* =====================================
            3D CAKE CAROUSEL
        ===================================== */}

        <div
          className="
            relative
            order-1
            flex
            min-h-[285px]
            items-center
            justify-center

            min-[380px]:min-h-[320px]

            sm:min-h-[410px]

            lg:order-2
            lg:min-h-[650px]
          "
          style={{
            perspective:
              "1400px",
          }}
        >

          {/* CAKE BACK GLOW */}

          <motion.div
            style={{
              background:
                theme.glow,
              x: glowMoveX,
              y: glowMoveY,
            }}
            animate={{
              scale: [
                1,
                1.08,
                1,
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none
              absolute
              h-[210px]
              w-[210px]
              rounded-full
              blur-[50px]

              sm:h-[330px]
              sm:w-[330px]

              lg:h-[500px]
              lg:w-[500px]
              lg:blur-[70px]
            "
          />

          {/* CAKES */}

          <div
            className="
              relative
              h-[270px]
              w-full

              min-[380px]:h-[300px]

              sm:h-[400px]

              lg:h-[580px]
            "
            style={{
              transformStyle:
                "preserve-3d",
            }}
          >
            {cakes.map(
              (cake, index) => {
                const position =
                  getPosition(
                    index
                  );

                const visible =
                  Math.abs(
                    position
                  ) <= 2;

                if (!visible) {
                  return null;
                }

                const isActive =
                  position === 0;

                const absPosition =
                  Math.abs(
                    position
                  );

                const x =
                  position * 105;

                const scale =
                  isActive
                    ? 1
                    : absPosition ===
                        1
                      ? 0.62
                      : 0.42;

                const sideRotateY =
                  position * -18;

                const z =
                  isActive
                    ? 100
                    : absPosition ===
                        1
                      ? -100
                      : -220;

                const opacity =
                  isActive
                    ? 1
                    : absPosition ===
                        1
                      ? 0.48
                      : 0.12;

                return (
                  <motion.div
                    key={
                      cake._id
                    }
                    animate={{
                      x,
                      scale,
                      rotateY:
                        sideRotateY,
                      z,
                      opacity,
                    }}
                    transition={{
                      type:
                        "spring",
                      stiffness: 90,
                      damping: 18,
                      mass: 0.9,
                    }}
                    onClick={() => {
                      if (
                        position < 0
                      ) {
                        previousCake();
                      }

                      if (
                        position > 0
                      ) {
                        nextCake();
                      }
                    }}
                    drag={
                      isActive
                        ? "x"
                        : false
                    }
                    dragConstraints={{
                      left: 0,
                      right: 0,
                    }}
                    dragElastic={
                      0.18
                    }
                    onDragStart={() =>
                      setPaused(true)
                    }
                    onDragEnd={(
                      _,
                      info
                    ) => {
                      setPaused(false);

                      if (
                        info.offset.x <
                        -50
                      ) {
                        nextCake();
                      }

                      if (
                        info.offset.x >
                        50
                      ) {
                        previousCake();
                      }
                    }}
                    className={`
                      absolute
                      inset-0
                      flex
                      touch-pan-y
                      items-center
                      justify-center

                      ${
                        isActive
                          ? "z-30 cursor-grab active:cursor-grabbing"
                          : "z-10 cursor-pointer"
                      }
                    `}
                    style={{
                      transformStyle:
                        "preserve-3d",
                    }}
                  >

                    {/* =================================
                        ACTIVE 3D MOUSE LAYER
                    ================================= */}

                    <motion.div
                      style={
                        isActive
                          ? {
                              rotateX,
                              rotateY,
                              x: cakeMoveX,
                              y: cakeMoveY,
                              transformStyle:
                                "preserve-3d",
                            }
                          : {}
                      }
                      className="relative flex h-full w-full items-center justify-center"
                    >

                      {/* SHADOW */}

                      {isActive && (
                        <motion.div
                          animate={{
                            scaleX: [
                              1,
                              0.9,
                              1,
                            ],
                            opacity: [
                              0.3,
                              0.18,
                              0.3,
                            ],
                          }}
                          transition={{
                            duration: 4,
                            repeat:
                              Infinity,
                            ease:
                              "easeInOut",
                          }}
                          className="
                            pointer-events-none
                            absolute
                            bottom-[7%]
                            left-1/2
                            h-8
                            w-[45%]
                            -translate-x-1/2
                            rounded-full
                            bg-black/35
                            blur-xl

                            sm:h-10

                            lg:bottom-[4%]
                            lg:w-[55%]
                            lg:blur-2xl
                          "
                        />
                      )}

                      {/* FLOATING CAKE */}

                      <motion.div
                        animate={
                          isActive
                            ? {
                                translateY: [
                                  0,
                                  -10,
                                  0,
                                ],
                              }
                            : {
                                translateY:
                                  0,
                              }
                        }
                        transition={{
                          duration: 4,
                          repeat:
                            Infinity,
                          ease:
                            "easeInOut",
                        }}
                        className="relative flex h-full w-full items-center justify-center"
                        style={{
                          transformStyle:
                            "preserve-3d",
                        }}
                      >
                        <img
                          src={
                            getHeroCakeImage(
                              cake
                            )
                          }
                          alt={
                            cake.name
                          }
                          draggable="false"
                          className={`
                            relative
                            z-10
                            max-h-[88%]
                            max-w-[72%]
                            select-none
                            object-contain
                            drop-shadow-[0_35px_35px_rgba(0,0,0,0.38)]

                            sm:max-h-[95%]
                            sm:max-w-[75%]

                            lg:max-h-full
                            lg:max-w-[85%]

                            ${
                              isActive
                                ? "brightness-105"
                                : ""
                            }
                          `}
                          style={{
                            transform:
                              "translateZ(50px)",
                          }}
                        />

                        {/* PREMIUM REFLECTION */}

                        {isActive && (
                          <motion.div
                            animate={{
                              x: [
                                "-250%",
                                "350%",
                              ],
                            }}
                            transition={{
                              duration: 4,
                              repeat:
                                Infinity,
                              repeatDelay: 4,
                              ease:
                                "easeInOut",
                            }}
                            className="
                              pointer-events-none
                              absolute
                              inset-y-[15%]
                              z-20
                              w-[15%]
                              rotate-12
                              bg-gradient-to-r
                              from-transparent
                              via-white/10
                              to-transparent
                              blur-xl
                            "
                          />
                        )}

                      </motion.div>

                    </motion.div>

                  </motion.div>
                );
              }
            )}
          </div>

          {/* =================================
              ARROWS
          ================================= */}

          {cakes.length > 1 && (
            <>
              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={
                  previousCake
                }
                className="
                  absolute
                  left-0
                  z-40
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/25
                  bg-white/10
                  backdrop-blur-xl

                  min-[390px]:flex

                  sm:left-3
                  sm:h-12
                  sm:w-12
                "
              >
                <ChevronLeft
                  size={20}
                />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={
                  nextCake
                }
                className="
                  absolute
                  right-0
                  z-40
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/25
                  bg-white/10
                  backdrop-blur-xl

                  min-[390px]:flex

                  sm:right-3
                  sm:h-12
                  sm:w-12
                "
              >
                <ChevronRight
                  size={20}
                />
              </motion.button>
            </>
          )}

          {/* MOBILE HINT */}

          {cakes.length > 1 && (
            <p
              className="
                absolute
                bottom-0
                left-1/2
                z-40
                -translate-x-1/2
                whitespace-nowrap
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-white/40

                sm:hidden
              "
            >
              Swipe to explore
            </p>
          )}

        </div>

      </div>

      {/* =====================================
          DOT NAVIGATION
      ===================================== */}

      {cakes.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-40
            flex
            -translate-x-1/2
            items-center
            gap-2

            sm:bottom-7
          "
        >
          {cakes.map(
            (cake, index) => (
              <motion.button
                key={
                  cake._id
                }
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }
                aria-label={`View ${cake.name}`}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-500

                  ${
                    index ===
                    activeIndex
                      ? "w-8 bg-white sm:w-9"
                      : "w-2 bg-white/40"
                  }
                `}
              />
            )
          )}
        </div>
      )}

      {/* BOTTOM GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-20
          w-full
          bg-gradient-to-t
          from-black/10
          to-transparent
        "
      />

    </motion.section>
  );
}

export default Hero;