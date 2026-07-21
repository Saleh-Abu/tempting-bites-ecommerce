import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const occasions = [
  {
    id: 1,
    title: "Birthday",
    subtitle: "Make their day unforgettable",
    emoji: "🎂",
    filter: "birthday",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Anniversary",
    subtitle: "Celebrate your love story",
    emoji: "❤️",
    filter: "anniversary",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Chocolate",
    subtitle: "For the ultimate chocolate lover",
    emoji: "🍫",
    filter: "chocolate",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Custom Cakes",
    subtitle: "Designed specially for you",
    emoji: "✨",
    filter: "custom",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
  },
];

function Occasions() {
  const navigate = useNavigate();

  /* =========================================
     OPEN CAKES
  ========================================= */

  const handleOccasionClick = (occasion) => {
    /*
      Later we can connect this query
      to CakesPage filtering.

      Example:
      /cakes?occasion=birthday
    */

    navigate(
      `/cakes?occasion=${occasion.filter}`
    );
  };

  return (
    <section
      id="occasions"
      className="
        relative
        overflow-hidden
        bg-[#fff8f5]
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* =====================================
          BACKGROUND DECORATION
      ===================================== */}

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -left-20
          top-20
          h-64
          w-64
          rounded-full
          bg-pink-200/30
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================
            SECTION HEADING
        ===================================== */}

        <motion.div
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mb-9
            px-5
            text-center
            sm:mb-12
            sm:px-6
            lg:mb-14
          "
        >

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-pink-500
              sm:text-xs
              sm:tracking-[0.35em]
            "
          >
            Find your celebration
          </span>


          <h2
            className="
              mt-3
              font-serif
              text-3xl
              font-bold
              text-[#421f27]

              sm:mt-4
              sm:text-4xl

              md:text-5xl
            "
          >
            What's the occasion?
          </h2>


          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-[#775b61]

              sm:mt-4
              sm:text-base
              sm:leading-7
            "
          >
            Every moment deserves something delicious.
            Choose your occasion and discover cakes made
            specially for it.
          </p>

        </motion.div>


        {/* =====================================
            MOBILE SWIPE HINT
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="
            mb-4
            flex
            items-center
            justify-between
            px-5
            sm:hidden
          "
        >

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#775b61]/60
            "
          >
            Swipe to explore
          </p>


          <div className="flex items-center gap-1">

            <span className="h-1.5 w-5 rounded-full bg-[#542432]" />

            <span className="h-1.5 w-1.5 rounded-full bg-[#542432]/20" />

            <span className="h-1.5 w-1.5 rounded-full bg-[#542432]/20" />

          </div>

        </motion.div>


        {/* =====================================
            OCCASION CARDS

            Mobile:
            Horizontal swipe

            Tablet/Desktop:
            Grid
        ===================================== */}

        <div
          className="
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            px-5
            pb-6

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            sm:grid
            sm:grid-cols-2
            sm:gap-5
            sm:overflow-visible
            sm:px-6
            sm:pb-0

            lg:grid-cols-4
            lg:gap-6
          "
        >

          {occasions.map(
            (
              occasion,
              index
            ) => (

              <motion.article
                key={
                  occasion.id
                }
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.55,
                  delay:
                    index *
                    0.08,
                }}
                whileHover={{
                  y: -8,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  handleOccasionClick(
                    occasion
                  )
                }
                className="
                  group
                  relative
                  h-[390px]
                  min-w-[82vw]
                  max-w-[310px]
                  shrink-0
                  snap-center
                  cursor-pointer
                  overflow-hidden
                  rounded-[2rem]
                  shadow-[0_20px_45px_rgba(84,36,50,0.13)]

                  sm:h-[410px]
                  sm:min-w-0
                  sm:max-w-none
                  sm:rounded-[2.2rem]

                  lg:h-[420px]
                  lg:rounded-[2.5rem]
                "
              >

                {/* =================================
                    IMAGE
                ================================= */}

                <motion.img
                  src={
                    occasion.image
                  }
                  alt={
                    occasion.title
                  }
                  loading="lazy"
                  transition={{
                    duration: 0.7,
                  }}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700

                    group-hover:scale-110
                  "
                />


                {/* =================================
                    DARK OVERLAY
                ================================= */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/85
                    via-black/20
                    to-black/5
                  "
                />


                {/* MOBILE SUBTLE OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-transparent
                    to-black/10
                  "
                />


                {/* =================================
                    FLOATING EMOJI
                ================================= */}

                <motion.div
                  animate={{
                    y: [
                      0,
                      -7,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat:
                      Infinity,
                    ease:
                      "easeInOut",
                    delay:
                      index *
                      0.3,
                  }}
                  className="
                    absolute
                    right-4
                    top-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    bg-white/15
                    text-xl
                    shadow-lg
                    backdrop-blur-xl

                    sm:right-5
                    sm:top-5
                    sm:h-14
                    sm:w-14
                    sm:text-2xl
                  "
                >

                  {occasion.emoji}

                </motion.div>


                {/* =================================
                    CARD NUMBER
                ================================= */}

                <span
                  className="
                    absolute
                    left-5
                    top-5
                    text-[9px]
                    font-bold
                    tracking-[0.2em]
                    text-white/50
                  "
                >
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>


                {/* =================================
                    TEXT
                ================================= */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    p-6
                    sm:p-7
                  "
                >

                  <motion.div
                    className="
                      transition-transform
                      duration-500
                      sm:group-hover:-translate-y-2
                    "
                  >

                    <h3
                      className="
                        font-serif
                        text-3xl
                        font-bold
                        text-white
                      "
                    >
                      {occasion.title}
                    </h3>


                    <p
                      className="
                        mt-2
                        text-sm
                        leading-5
                        text-white/70
                      "
                    >
                      {occasion.subtitle}
                    </p>


                    {/* =================================
                        EXPLORE

                        Always visible on mobile.
                        Hover reveal on desktop.
                    ================================= */}

                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-pink-200

                        sm:max-h-0
                        sm:overflow-hidden
                        sm:opacity-0
                        sm:transition-all
                        sm:duration-500

                        sm:group-hover:max-h-10
                        sm:group-hover:opacity-100
                      "
                    >

                      Explore Cakes

                      <ArrowUpRight
                        size={17}
                      />

                    </div>

                  </motion.div>

                </div>


                {/* =================================
                    MOBILE TAP INDICATOR
                ================================= */}

                <div
                  className="
                    absolute
                    bottom-5
                    right-5
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    backdrop-blur-md

                    sm:hidden
                  "
                >

                  <ArrowUpRight
                    size={15}
                  />

                </div>

              </motion.article>

            )
          )}

        </div>

      </div>

    </section>
  );
}

export default Occasions;