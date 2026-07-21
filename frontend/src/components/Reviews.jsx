import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
  Star,
  Heart,
} from "lucide-react";

/* =========================================
   TEMPORARY REVIEW DATA

   Later we can connect real customer reviews
   from the backend/admin dashboard.
========================================= */

const reviews = [
  {
    id: 1,
    name: "Ayesha Khan",
    occasion: "Birthday Cake",
    rating: 5,
    review:
      "The cake was absolutely beautiful and tasted amazing. Everyone loved it and the design was exactly what we wanted!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    occasion: "Anniversary Cake",
    rating: 5,
    review:
      "Fresh, delicious and beautifully decorated. The entire experience was lovely and the cake made our celebration even more special.",
  },
  {
    id: 3,
    name: "Neha Patil",
    occasion: "Custom Cake",
    rating: 5,
    review:
      "I shared my cake idea and the final result was even better than I imagined. Beautiful work and wonderful taste!",
  },
  {
    id: 4,
    name: "Sara Sheikh",
    occasion: "Birthday Celebration",
    rating: 5,
    review:
      "The presentation was gorgeous and the flavour was perfect. We will definitely order again for our next celebration.",
  },
];

function Reviews() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const activeReview =
    reviews[activeIndex];

  /* =========================================
     NEXT REVIEW
  ========================================= */

  const nextReview = () => {
    setActiveIndex(
      (current) =>
        (current + 1) %
        reviews.length
    );
  };

  /* =========================================
     PREVIOUS REVIEW
  ========================================= */

  const previousReview = () => {
    setActiveIndex(
      (current) =>
        (current -
          1 +
          reviews.length) %
        reviews.length
    );
  };

  return (
    <section
      id="reviews"
      className="
        relative
        overflow-hidden
        bg-[#2b1219]
        px-4
        py-20
        text-white
        sm:px-6
        lg:py-28
      "
    >

      {/* BACKGROUND GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.04]
          [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />


      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-pink-500/10
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          h-[450px]
          w-[450px]
          rounded-full
          bg-orange-300/5
          blur-[130px]
        "
      />


      <div
        className="
          relative
          mx-auto
          max-w-7xl
        "
      >

        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            flex
            flex-col
            gap-6
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
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/5
                px-4
                py-2
              "
            >

              <Heart
                size={13}
                className="text-pink-300"
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-white/60
                "
              >
                Made With Love
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
                mt-6
                max-w-3xl
                font-serif
                text-4xl
                font-bold
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
            >

              Sweet words from

              <span
                className="
                  block
                  italic
                  text-pink-200
                "
              >
                our customers.
              </span>

            </motion.h2>

          </div>


          {/* RATING SUMMARY */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              backdrop-blur-md
            "
          >

            <span
              className="
                font-serif
                text-3xl
                font-bold
              "
            >
              5.0
            </span>


            <div>

              <div
                className="
                  flex
                  gap-1
                  text-yellow-300
                "
              >

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="currentColor"
                    />
                  )
                )}

              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-wider
                  text-white/40
                "
              >
                Happy Customers
              </p>

            </div>

          </motion.div>

        </div>


        {/* =================================
            REVIEW SHOWCASE
        ================================= */}

        <div
          className="
            mt-12
            grid
            items-center
            gap-8
            lg:grid-cols-[1fr_0.45fr]
          "
        >

          {/* MAIN REVIEW */}

          <div
            className="
              relative
              min-h-[380px]
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-white/[0.06]
              p-7
              backdrop-blur-md
              sm:p-10
              lg:min-h-[430px]
              lg:p-12
            "
          >

            {/* QUOTE */}

            <Quote
              size={70}
              strokeWidth={1}
              className="
                absolute
                right-7
                top-7
                text-white/[0.05]
              "
            />


            <AnimatePresence
              mode="wait"
            >

              <motion.div
                key={
                  activeReview.id
                }
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="
                  relative
                  z-10
                  flex
                  min-h-[310px]
                  flex-col
                "
              >

                {/* STARS */}

                <div
                  className="
                    flex
                    gap-1
                    text-yellow-300
                  "
                >

                  {Array.from({
                    length:
                      activeReview.rating,
                  }).map(
                    (_, index) => (

                      <Star
                        key={index}
                        size={17}
                        fill="currentColor"
                      />

                    )
                  )}

                </div>


                {/* REVIEW */}

                <blockquote
                  className="
                    mt-8
                    max-w-4xl
                    font-serif
                    text-2xl
                    font-medium
                    leading-relaxed
                    text-white/90
                    sm:text-3xl
                    lg:text-4xl
                  "
                >

                  "
                  {
                    activeReview.review
                  }
                  "

                </blockquote>


                {/* CUSTOMER */}

                <div
                  className="
                    mt-auto
                    flex
                    items-center
                    gap-4
                    pt-10
                  "
                >

                  {/* INITIAL */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-pink-200
                      font-serif
                      text-lg
                      font-bold
                      text-[#542432]
                    "
                  >

                    {activeReview.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div>

                    <p
                      className="
                        font-bold
                        text-white
                      "
                    >
                      {
                        activeReview.name
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-white/40
                      "
                    >
                      {
                        activeReview.occasion
                      }
                    </p>

                  </div>

                </div>

              </motion.div>

            </AnimatePresence>

          </div>


          {/* =================================
              REVIEW SELECTOR
          ================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
            "
          >

            {reviews.map(
              (
                review,
                index
              ) => {

                const isActive =
                  index ===
                  activeIndex;

                return (

                  <motion.button
                    key={
                      review.id
                    }
                    type="button"
                    whileHover={{
                      x: 5,
                    }}
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition
                      ${
                        isActive
                          ? "border-pink-200/30 bg-white/10"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                      }
                    `}
                  >

                    {/* NUMBER */}

                    <span
                      className={`
                        font-serif
                        text-lg
                        font-bold
                        ${
                          isActive
                            ? "text-pink-200"
                            : "text-white/20"
                        }
                      `}
                    >

                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </span>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p
                        className={`
                          truncate
                          text-sm
                          font-bold
                          ${
                            isActive
                              ? "text-white"
                              : "text-white/50"
                          }
                        `}
                      >
                        {review.name}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[10px]
                          text-white/30
                        "
                      >
                        {
                          review.occasion
                        }
                      </p>

                    </div>


                    {isActive && (

                      <motion.div
                        layoutId="review-active"
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-pink-300
                        "
                      />

                    )}

                  </motion.button>

                );
              }
            )}


            {/* ARROWS */}

            <div
              className="
                mt-3
                flex
                gap-3
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
                  previousReview
                }
                className="
                  flex
                  h-12
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                "
              >

                <ArrowLeft
                  size={18}
                />

              </motion.button>


              <motion.button
                type="button"
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={
                  nextReview
                }
                className="
                  flex
                  h-12
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#542432]
                "
              >

                <ArrowRight
                  size={18}
                />

              </motion.button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Reviews;