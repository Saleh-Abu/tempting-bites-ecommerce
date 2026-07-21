import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CakeSlice,
  Sparkles,
} from "lucide-react";

function CustomCakeCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#fff8f5] px-4 py-16 sm:px-6 sm:py-20 lg:py-28">

      {/* DECORATIVE BACKGROUND */}

      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-pink-200/30 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-[100px]" />


      <div className="relative mx-auto max-w-7xl">

        <motion.div
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
            duration: 0.7,
          }}
          className="relative overflow-hidden rounded-[2rem] bg-[#542432] px-6 py-14 text-white shadow-[0_30px_80px_rgba(84,36,50,0.18)] sm:px-10 lg:min-h-[480px] lg:rounded-[3rem] lg:px-16 lg:py-16"
        >

          {/* BACKGROUND GLOW */}

          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-pink-400/20 blur-[100px]"
          />


          {/* LARGE DECORATIVE TEXT */}

          <div className="pointer-events-none absolute -bottom-10 right-0 hidden select-none font-serif text-[150px] font-black leading-none text-white/[0.025] lg:block">
            CAKE
          </div>


          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">

            {/* =========================
                LEFT CONTENT
            ========================= */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">

                <Sparkles
                  size={14}
                  className="text-pink-200"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
                  Made Just For You
                </span>

              </div>


              <h2 className="mt-6 max-w-xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">

                Have a cake

                <span className="block italic text-pink-200">
                  in your imagination?
                </span>

              </h2>


              <p className="mt-6 max-w-lg text-sm leading-7 text-white/60 sm:text-base">

                Tell us your idea and we'll help turn it
                into something delicious. From birthdays
                and anniversaries to completely unique
                celebrations, your cake can be made just
                the way you imagine it.

              </p>


              {/* BUTTONS */}

              <div className="mt-8 flex flex-wrap gap-3">

                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={() =>
                    navigate("/cakes")
                  }
                  className="flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-[#542432] shadow-xl"
                >

                  Design Your Cake

                  <ArrowRight size={17} />

                </motion.button>


                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={() =>
                    navigate("/cakes")
                  }
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold backdrop-blur-md"
                >

                  View Inspiration

                </motion.button>

              </div>

            </div>


            {/* =========================
                RIGHT VISUAL
            ========================= */}

            <div className="relative flex min-h-[280px] items-center justify-center lg:min-h-[360px]">

              {/* OUTER ROTATING RING */}

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-64 w-64 rounded-full border border-dashed border-white/15 sm:h-72 sm:w-72"
              />


              {/* SECOND RING */}

              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-52 w-52 rounded-full border border-white/10 sm:h-60 sm:w-60"
              />


              {/* CENTER CAKE ICON */}

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:h-44 sm:w-44"
              >

                <CakeSlice
                  size={60}
                  strokeWidth={1.2}
                  className="text-pink-100"
                />

              </motion.div>


              {/* FLOATING SPARKLE */}

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute right-[10%] top-[15%] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md"
              >
                <Sparkles
                  size={18}
                  className="text-pink-200"
                />
              </motion.div>


              {/* FLOATING DOT */}

              <motion.div
                animate={{
                  y: [0, 18, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute bottom-[15%] left-[15%] h-8 w-8 rounded-full border border-white/20 bg-pink-300/20 backdrop-blur-md"
              />

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default CustomCakeCTA;