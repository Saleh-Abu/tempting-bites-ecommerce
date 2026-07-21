import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

import {
  ArrowUpRight,
  CakeSlice,
  Heart,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id) => {
    const section =
      document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#1b0b10]
        px-4
        pb-8
        pt-20
        text-white
        sm:px-6
        lg:pt-24
      "
    >
      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-0
          h-[450px]
          w-[450px]
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
          right-0
          h-[450px]
          w-[450px]
          rounded-full
          bg-orange-300/5
          blur-[130px]
        "
      />

      {/* LARGE BACKGROUND TEXT */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-10
          left-1/2
          hidden
          -translate-x-1/2
          select-none
          whitespace-nowrap
          font-serif
          text-[150px]
          font-black
          tracking-[-0.08em]
          text-white/[0.015]
          lg:block
        "
      >
        TEMPTING BITES
      </div>

      <div
        className="
          relative
          mx-auto
          max-w-7xl
        "
      >
        {/* =================================
            TOP CTA
        ================================= */}

        <div
          className="
            flex
            flex-col
            gap-8
            border-b
            border-white/10
            pb-14
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-pink-200
              "
            >
              <Sparkles size={15} />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                "
              >
                Let's Make Life Sweeter
              </span>
            </div>

            <h2
              className="
                mt-4
                max-w-2xl
                font-serif
                text-4xl
                font-bold
                leading-tight
                sm:text-5xl
              "
            >
              Your next celebration
              <span
                className="
                  block
                  italic
                  text-pink-200
                "
              >
                deserves something tempting.
              </span>
            </h2>
          </div>

          <Link to="/cakes">
            <motion.button
              type="button"
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                flex
                items-center
                gap-3
                rounded-full
                bg-white
                px-7
                py-4
                text-sm
                font-bold
                text-[#542432]
                shadow-xl
              "
            >
              Explore Our Cakes

              <ArrowUpRight
                size={17}
              />
            </motion.button>
          </Link>
        </div>

        {/* =================================
            FOOTER COLUMNS
        ================================= */}

        <div
          className="
            grid
            gap-12
            py-14
            sm:grid-cols-2
            lg:grid-cols-[1.4fr_0.7fr_1fr_1.2fr]
          "
        >
          {/* ===============================
              BRAND
          =============================== */}

          <div>
            <Link
              to="/"
              onClick={scrollToTop}
              className="
                inline-flex
                items-center
                gap-3
              "
            >
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  backdrop-blur-md
                "
              >
                <CakeSlice
                  size={22}
                  className="text-pink-200"
                />
              </motion.div>

              <div>
                <h3
                  className="
                    font-serif
                    text-2xl
                    font-bold
                    italic
                    tracking-wide
                  "
                >
                  Tempting Bites
                </h3>

                <p
                  className="
                    mt-1
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-white/40
                  "
                >
                  Baked with love
                </p>
              </div>
            </Link>

            <p
              className="
                mt-6
                max-w-sm
                text-sm
                leading-7
                text-white/45
              "
            >
              Handcrafted cakes made
              with love for birthdays,
              celebrations and all the
              sweetest moments in life.
            </p>

            {/* INSTAGRAM */}

            <motion.a
             href="https://www.instagram.com/temptingbites_10/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                x: 4,
              }}
              className="
                mt-6
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-xs
                font-semibold
                transition
                hover:bg-white/10
              "
            >
              <span className="text-lg text-pink-300">
  ◎
</span>

              Follow our sweet journey on Instagram

              <ArrowUpRight
                size={14}
              />
            </motion.a>
          </div>

          {/* ===============================
              EXPLORE
          =============================== */}

          <div>
            <h4
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-white
              "
            >
              Explore
            </h4>

            <div
              className="
                mt-6
                flex
                flex-col
                items-start
                gap-4
                text-sm
                text-white/45
              "
            >
              <Link
                to="/"
                className="
                  transition
                  hover:text-pink-200
                "
              >
                Home
              </Link>

              <Link
                to="/cakes"
                className="
                  transition
                  hover:text-pink-200
                "
              >
                Our Cakes
              </Link>

              <Link
                to="/cakes"
                className="
                  transition
                  hover:text-pink-200
                "
              >
                Custom Cakes
              </Link>

              <button
                type="button"
                onClick={() =>
                  scrollToSection(
                    "careers"
                  )
                }
                className="
                  transition
                  hover:text-pink-200
                "
              >
                Learn Baking
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection(
                    "reviews"
                  )
                }
                className="
                  transition
                  hover:text-pink-200
                "
              >
                Reviews
              </button>
            </div>
          </div>

          {/* ===============================
              CONTACT
          =============================== */}

          <div>
            <h4
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
              "
            >
              Contact Us
            </h4>

            <div
              className="
                mt-6
                space-y-5
              "
            >
              {/* EMAIL */}

              <a
                href="mailto:temptingbites07@gmail.com"
                className="
                  group
                  flex
                  items-start
                  gap-3
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
                    bg-white/5
                    transition
                    group-hover:bg-white/10
                  "
                >
                  <Mail
                    size={15}
                    className="text-pink-200"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-wider
                      text-white/30
                    "
                  >
                    For any queries
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-xs
                      text-white/65
                      transition
                      group-hover:text-white
                    "
                  >
                    temptingbites07@gmail.com
                  </p>
                </div>
              </a>

              {/* PHONE */}

              <a
                href="tel:+918076500187"
                className="
                  group
                  flex
                  items-start
                  gap-3
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
                    bg-white/5
                    transition
                    group-hover:bg-white/10
                  "
                >
                  <Phone
                    size={15}
                    className="text-pink-200"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-wider
                      text-white/30
                    "
                  >
                    Contact
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-white/65
                      transition
                      group-hover:text-white
                    "
                  >
                    +91 80765 00187
                  </p>
                </div>
              </a>

              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/temptingbites_10/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-start
                  gap-3
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
                    bg-white/5
                    transition
                    group-hover:bg-white/10
                  "
                >
                 <span className="text-base text-pink-200">
  ◎
</span>
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-wider
                      text-white/30
                    "
                  >
                    Instagram
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-white/65
                      transition
                      group-hover:text-white
                    "
                  >
                    @temptingbites_10
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* ===============================
              DELIVERY AREA
          =============================== */}

          <div>
            <h4
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
              "
            >
              We Deliver
            </h4>

            <div
              className="
                mt-6
                rounded-[1.5rem]
                border
                border-white/10
                bg-white/5
                p-5
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-200
                  text-[#542432]
                "
              >
                <MapPin
                  size={19}
                />
              </div>

              <p
                className="
                  mt-5
                  font-serif
                  text-xl
                  font-bold
                "
              >
                Panvel
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-pink-200
                "
              >
                India Bulls
              </p>

              <p
                className="
                  mt-3
                  text-xs
                  font-bold
                  tracking-wider
                  text-white/50
                "
              >
                PIN — 410206
              </p>

              <div
                className="
                  my-4
                  h-px
                  bg-white/10
                "
              />

              <p
                className="
                  text-[11px]
                  leading-5
                  text-white/40
                "
              >
                Currently delivering only
                within our selected Panvel
                and India Bulls service
                area.
              </p>
            </div>
          </div>
        </div>

        {/* =================================
            BOTTOM BAR
        ================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-white/10
            pt-7
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
          "
        >
          <p
            className="
              text-[10px]
              text-white/30
            "
          >
            © {new Date().getFullYear()} Tempting Bites.
            All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              justify-center
              gap-1.5
              text-[10px]
              text-white/30
            "
          >
            Handcrafted with

            <Heart
              size={11}
              fill="currentColor"
              className="text-pink-400"
            />

            for every sweet moment.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;