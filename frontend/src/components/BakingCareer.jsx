import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  GraduationCap,
  Heart,
  Sparkles,
} from "lucide-react";

function BakingCareer() {
  return (
    <section
      id="careers"
      className="relative overflow-hidden bg-[#fffaf7] px-4 py-20 sm:px-6 lg:py-28"
    >
      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-pink-200/30 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* =================================
            HEADER
        ================================= */}

        <div className="mx-auto max-w-3xl text-center">

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
            className="inline-flex items-center gap-2 rounded-full border border-[#542432]/10 bg-white px-4 py-2 shadow-sm"
          >
            <Sparkles
              size={14}
              className="text-pink-500"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#8d6974]">
              Learn • Create • Grow
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
            className="mt-6 font-serif text-4xl font-bold leading-tight text-[#542432] sm:text-5xl lg:text-6xl"
          >
            Turn Your Passion Into
            <span className="block italic text-pink-500">
              Something Sweet.
            </span>
          </motion.h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Whether you dream of learning the art of baking
            or want to grow your skills alongside passionate
            bakers, your sweetest journey can start here.
          </p>

        </div>


        {/* =================================
            CAREER CARDS
        ================================= */}

        <div className="mt-12 grid gap-5 md:grid-cols-2">

          {/* ===============================
              LEARN BAKING
          =============================== */}

          <motion.article
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            whileHover={{
              y: -6,
            }}
            transition={{
              duration: 0.5,
            }}
            className="group relative overflow-hidden rounded-[2rem] bg-[#542432] p-7 text-white shadow-[0_25px_60px_rgba(84,36,50,0.15)] sm:p-9 lg:min-h-[430px]"
          >

            {/* GLOW */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-400/20 blur-[90px]" />


            {/* LARGE NUMBER */}

            <span className="pointer-events-none absolute -bottom-12 right-3 font-serif text-[170px] font-black leading-none text-white/[0.025]">
              01
            </span>


            <div className="relative z-10 flex h-full flex-col">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">

                <GraduationCap
                  size={27}
                  strokeWidth={1.5}
                  className="text-pink-200"
                />

              </div>


              <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-pink-200">
                Learn With Us
              </p>


              <h3 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Learn the Art
                <span className="block italic text-pink-200">
                  of Baking.
                </span>
              </h3>


              <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                Discover baking techniques, cake decoration,
                frosting and the little details that turn
                simple ingredients into something beautiful.
              </p>


              <motion.button
                type="button"
                whileHover={{
                  x: 5,
                }}
                className="mt-auto flex w-fit items-center gap-3 pt-8 text-sm font-bold"
              >
                Start Your Baking Journey

                <ArrowRight size={17} />

              </motion.button>

            </div>

          </motion.article>


          {/* ===============================
              GROW WITH US
          =============================== */}

          <motion.article
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            whileHover={{
              y: -6,
            }}
            transition={{
              duration: 0.5,
            }}
            className="group relative overflow-hidden rounded-[2rem] border border-[#542432]/5 bg-white p-7 shadow-[0_25px_60px_rgba(84,36,50,0.08)] sm:p-9 lg:min-h-[430px]"
          >

            {/* DECORATION */}

            <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-pink-100 blur-[80px]" />


            {/* LARGE NUMBER */}

            <span className="pointer-events-none absolute -bottom-12 right-3 font-serif text-[170px] font-black leading-none text-[#542432]/[0.025]">
              02
            </span>


            <div className="relative z-10 flex h-full flex-col">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#542432]/5">

                <ChefHat
                  size={27}
                  strokeWidth={1.5}
                  className="text-[#542432]"
                />

              </div>


              <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-pink-500">
                Grow With Us
              </p>


              <h3 className="mt-3 font-serif text-3xl font-bold text-[#542432] sm:text-4xl">
                Create Something
                <span className="block italic text-pink-500">
                  Beautiful Together.
                </span>
              </h3>


              <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
                Love baking and creativity? Connect with
                Tempting Bites to explore opportunities to
                learn, collaborate and grow your baking
                journey with us.
              </p>


              <motion.button
                type="button"
                whileHover={{
                  x: 5,
                }}
                className="mt-auto flex w-fit items-center gap-3 pt-8 text-sm font-bold text-[#542432]"
              >
                Explore Opportunities

                <ArrowRight size={17} />

              </motion.button>

            </div>

          </motion.article>

        </div>


        {/* =================================
            SMALL BOTTOM MESSAGE
        ================================= */}

        <motion.div
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
          className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row"
        >

          <Heart
            size={16}
            className="text-pink-400"
          />

          <p className="text-xs leading-5 text-gray-400">
            No experience? That's okay. Sometimes all you need
            is curiosity, creativity and a love for something sweet.
          </p>

        </motion.div>

      </div>
    </section>
  );
}

export default BakingCareer;