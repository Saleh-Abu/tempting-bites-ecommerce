import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import API_URL from "../config/api";

import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

import {
  addToCart,
  openCart,
} from "../features/cartSlice";

import CakeQuickView from "../components/CakeQuickView";


/* =========================================
   API
========================================= */


/* =========================================
   CATEGORIES
========================================= */

const categories = [
  "All Cakes",
  "Chocolate",
  "Birthday",
  "Anniversary",
  "Bento",
  "Kunafa",
  "Custom",
];


/* =========================================
   URL OCCASION → CATEGORY
========================================= */

const occasionCategoryMap = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  chocolate: "Chocolate",
  custom: "Custom",
};


/* =========================================
   PRODUCT CARD
========================================= */

function ProductCard({
  cake,
  index,
}) {

  const dispatch =
    useDispatch();


  /* =====================================
     PRICE OPTIONS
  ===================================== */

  const priceEntries =
    Object.entries(
      cake.prices || {}
    );


  const firstWeight =
    priceEntries.length > 0
      ? priceEntries[0][0]
      : "";


  /* =====================================
     STATE
  ===================================== */

  const [weight, setWeight] =
    useState(
      firstWeight
    );


  const [liked, setLiked] =
    useState(false);


  const [
    quickViewOpen,
    setQuickViewOpen,
  ] = useState(false);


  const [added, setAdded] =
    useState(false);


  /* =====================================
     UPDATE WEIGHT
  ===================================== */

  useEffect(() => {

    const weights =
      Object.keys(
        cake.prices || {}
      );


    if (
      weights.length > 0
    ) {

      setWeight(
        weights[0]
      );

    } else {

      setWeight("");

    }

  }, [
    cake._id,
    cake.prices,
  ]);


  /* =====================================
     AVAILABILITY
  ===================================== */

  const isAvailable =
    cake.isAvailable !==
    false;


  /* =====================================
     SELECTED PRICE
  ===================================== */

  const selectedPrice =
    weight
      ? cake.prices?.[
          weight
        ]
      : null;


  /* =====================================
     ADD TO CART
  ===================================== */

  const handleAdd = () => {

    if (
      !isAvailable ||
      !weight ||
      selectedPrice ===
        undefined ||
      selectedPrice ===
        null
    ) {

      return;

    }


    dispatch(
      addToCart({
        id:
          cake._id ||
          cake.id,

        name:
          cake.name,

        image:
          cake.image,

        category:
          cake.category,

        weight,

        price:
          selectedPrice,

        quantity: 1,
      })
    );


    setAdded(true);


    setTimeout(() => {

      setAdded(false);

    }, 1200);

  };


  /* =====================================
     ADD + OPEN CART
  ===================================== */

  const handleBuyNow = () => {

    if (
      !isAvailable ||
      !weight ||
      selectedPrice ===
        undefined ||
      selectedPrice ===
        null
    ) {

      return;

    }


    dispatch(
      addToCart({
        id:
          cake._id ||
          cake.id,

        name:
          cake.name,

        image:
          cake.image,

        category:
          cake.category,

        weight,

        price:
          selectedPrice,

        quantity: 1,
      })
    );


    dispatch(
      openCart()
    );

  };


  return (

    <>

      {/* =====================================
          PRODUCT CARD
      ===================================== */}

      <motion.article

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
          amount: 0.1,
        }}

        transition={{
          duration: 0.5,
          delay:
            Math.min(
              index * 0.04,
              0.25
            ),
        }}

        whileHover={{
          y: -6,
        }}

        className="
          group
          relative
          overflow-hidden
          rounded-[1.7rem]
          border
          border-[#542432]/[0.04]
          bg-white
          shadow-[0_18px_60px_rgba(79,31,45,0.08)]

          sm:rounded-[2rem]
        "
      >


        {/* =================================
            IMAGE
        ================================= */}

        <div
          className="
            relative
            h-[250px]
            overflow-hidden
            bg-pink-50

            min-[420px]:h-[280px]

            sm:h-72
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

              onError={(
                event
              ) => {

                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80";

              }}

              className="
                h-full
                w-full
                object-cover
                transition-transform
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
                bg-[#fff3f6]
                text-6xl
              "
            >
              🎂
            </div>

          )}


          {/* GRADIENT */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/35
              via-transparent
              to-transparent
            "
          />


          {/* =================================
              BADGE
          ================================= */}

          {cake.badge && (

            <span
              className="
                absolute
                left-3
                top-3
                max-w-[55%]
                truncate
                rounded-full
                bg-white/90
                px-3
                py-2
                text-[8px]
                font-bold
                uppercase
                tracking-wider
                text-[#713247]
                shadow-sm
                backdrop-blur-md

                sm:left-4
                sm:top-4
                sm:px-4
                sm:text-[10px]
              "
            >

              {cake.badge}

            </span>

          )}


          {/* =================================
              OUT OF STOCK
          ================================= */}

          {!isAvailable && (

            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-[#241016]/55
                backdrop-blur-[2px]
              "
            >

              <span
                className="
                  rounded-full
                  border
                  border-white/20
                  bg-black/30
                  px-5
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  backdrop-blur-md
                "
              >
                Currently Unavailable
              </span>

            </div>

          )}


          {/* =================================
              HEART
          ================================= */}

          <motion.button

            type="button"

            whileTap={{
              scale: 0.8,
            }}

            onClick={() =>
              setLiked(
                !liked
              )
            }

            className="
              absolute
              right-3
              top-3
              z-30
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white/90
              shadow-lg

              sm:right-4
              sm:top-4
              sm:h-11
              sm:w-11
            "

            aria-label={
              liked
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >

            <Heart
              size={18}

              fill={
                liked
                  ? "#ec4899"
                  : "none"
              }

              className={
                liked
                  ? "text-pink-500"
                  : "text-[#633846]"
              }
            />

          </motion.button>


          {/* =================================
              DESKTOP QUICK VIEW
          ================================= */}

          {isAvailable && (

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-10
                hidden
                translate-y-full
                justify-center
                pb-5
                transition-transform
                duration-500

                sm:flex
                sm:group-hover:translate-y-0
              "
            >

              <motion.button

                type="button"

                whileHover={{
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}

                onClick={() =>
                  setQuickViewOpen(
                    true
                  )
                }

                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-[#542c38]
                  shadow-xl
                "
              >

                <Eye
                  size={16}
                />

                Quick View

              </motion.button>

            </div>

          )}


          {/* =================================
              MOBILE QUICK VIEW
          ================================= */}

          {isAvailable && (

            <motion.button

              type="button"

              whileTap={{
                scale: 0.92,
              }}

              onClick={() =>
                setQuickViewOpen(
                  true
                )
              }

              className="
                absolute
                bottom-3
                right-3
                z-10
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-[#542432]
                shadow-lg
                backdrop-blur-md

                sm:hidden
              "

              aria-label={`Quick view ${cake.name}`}
            >

              <Eye
                size={17}
              />

            </motion.button>

          )}

        </div>


        {/* =====================================
            PRODUCT DETAILS
        ===================================== */}

        <div
          className="
            p-5

            sm:p-6
          "
        >


          {/* CATEGORY */}

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-pink-500

              sm:text-[10px]
            "
          >

            {cake.category ||
              "Handcrafted Cake"}

          </p>


          {/* NAME */}

          <h3
            className="
              mt-2
              font-serif
              text-xl
              font-bold
              leading-tight
              text-[#421f27]

              sm:min-h-[58px]
              sm:text-2xl
            "
          >

            {cake.name}

          </h3>


          {/* =================================
              RATING
          ================================= */}

          <div
            className="
              mt-3
              flex
              items-center
              gap-2
            "
          >

            <Star
              size={14}
              fill="currentColor"
              className="
                text-yellow-500
              "
            />


            <span
              className="
                text-sm
                font-bold
                text-[#542432]
              "
            >

              {cake.rating ||
                0}

            </span>


            <span
              className="
                text-xs
                text-gray-400
              "
            >

              (
              {cake.reviews ||
                0}
              )

            </span>

          </div>


          {/* =================================
              DESCRIPTION
          ================================= */}

          {cake.description && (

            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                leading-5
                text-gray-400

                sm:min-h-[40px]
              "
            >

              {cake.description}

            </p>

          )}


          {/* =================================
              WEIGHT OPTIONS
          ================================= */}

          {priceEntries.length >
            0 ? (

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >

              {priceEntries.map(
                ([
                  item,
                  price,
                ]) => (

                  <button

                    type="button"

                    key={
                      item
                    }

                    onClick={() =>
                      setWeight(
                        item
                      )
                    }

                    className={`
                      min-h-10
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      transition

                      ${
                        weight ===
                        item
                          ? "bg-[#542c38] text-white shadow-md"
                          : "bg-pink-50 text-[#704653] hover:bg-pink-100"
                      }
                    `}
                  >

                    {item}

                    <span
                      className="
                        ml-1
                        opacity-60
                      "
                    >
                      ₹{price}
                    </span>

                  </button>

                )
              )}

            </div>

          ) : (

            <p
              className="
                mt-5
                text-xs
                font-semibold
                text-gray-400
              "
            >
              Price options
              currently unavailable.
            </p>

          )}


          {/* =================================
              PRICE
          ================================= */}

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

              <p
                className="
                  text-[9px]
                  text-gray-400
                "
              >
                {weight
                  ? `${weight} cake`
                  : "Price"}
              </p>


              <motion.p

                key={
                  weight
                }

                initial={{
                  opacity: 0,
                  y: 5,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                className="
                  mt-0.5
                  text-2xl
                  font-black
                  text-[#542c38]
                "
              >

                {selectedPrice !==
                undefined &&
                selectedPrice !==
                null
                  ? `₹${selectedPrice}`
                  : "—"}

              </motion.p>

            </div>


            {/* DESKTOP ADD */}

            <motion.button

              type="button"

              whileHover={
                isAvailable
                  ? {
                      scale:
                        1.05,
                    }
                  : {}
              }

              whileTap={
                isAvailable
                  ? {
                      scale:
                        0.95,
                    }
                  : {}
              }

              onClick={
                handleAdd
              }

              disabled={
                !isAvailable ||
                !weight
              }

              className={`
                hidden
                min-h-12
                items-center
                gap-2
                rounded-full
                px-5
                py-3
                text-xs
                font-bold
                text-white
                transition

                sm:flex

                ${
                  added
                    ? "bg-green-600"
                    : "bg-pink-500"
                }

                disabled:cursor-not-allowed
                disabled:bg-gray-300
              `}
            >

              <ShoppingBag
                size={16}
              />

              {!isAvailable
                ? "Unavailable"
                : added
                ? "Added ✓"
                : "Add"}

            </motion.button>

          </div>


          {/* =================================
              MOBILE ACTION BUTTONS
          ================================= */}

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-2

              sm:hidden
            "
          >

            <motion.button

              type="button"

              whileTap={{
                scale: 0.97,
              }}

              onClick={
                handleAdd
              }

              disabled={
                !isAvailable ||
                !weight
              }

              className={`
                flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                px-3
                text-xs
                font-bold
                text-white

                ${
                  added
                    ? "bg-green-600"
                    : "bg-pink-500"
                }

                disabled:cursor-not-allowed
                disabled:bg-gray-300
              `}
            >

              <ShoppingBag
                size={15}
              />

              {!isAvailable
                ? "Unavailable"
                : added
                ? "Added ✓"
                : "Add"}

            </motion.button>


            <motion.button

              type="button"

              whileTap={{
                scale: 0.97,
              }}

              onClick={
                handleBuyNow
              }

              disabled={
                !isAvailable ||
                !weight
              }

              className="
                min-h-12
                rounded-full
                bg-[#542432]
                px-3
                text-xs
                font-bold
                text-white

                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              Order Now
            </motion.button>

          </div>

        </div>

      </motion.article>


      {/* =====================================
          QUICK VIEW
      ===================================== */}

      <CakeQuickView

        cake={{
          ...cake,

          id:
            cake._id ||
            cake.id,
        }}

        isOpen={
          quickViewOpen
        }

        onClose={() =>
          setQuickViewOpen(
            false
          )
        }

      />

    </>

  );

}


/* =========================================
   CAKES PAGE
========================================= */

function CakesPage() {

  const location =
    useLocation();

  const navigate =
    useNavigate();


  /* =========================================
     API STATE
  ========================================= */

  const [cakes, setCakes] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  /* =========================================
     FILTER STATE
  ========================================= */

  const [search, setSearch] =
    useState("");


  const [category, setCategory] =
    useState(
      "All Cakes"
    );


  const [sort, setSort] =
    useState(
      "featured"
    );


  /* =========================================
     READ OCCASION FROM URL
  ========================================= */

  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );


    const occasion =
      params.get(
        "occasion"
      );


    if (!occasion) {

      return;

    }


    const mappedCategory =
      occasionCategoryMap[
        occasion.toLowerCase()
      ];


    if (
      mappedCategory
    ) {

      setCategory(
        mappedCategory
      );

    }

  }, [
    location.search,
  ]);


  /* =========================================
     FETCH CAKES
  ========================================= */

  const fetchCakes =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
  await axios.get(
    `${API_URL}/api/cakes`
  );


        const apiCakes =
          response.data
            .cakes || [];


        const formattedCakes =
          apiCakes.map(
            (cake) => ({

              ...cake,

              id:
                cake._id ||
                cake.id,

            })
          );


        setCakes(
          formattedCakes
        );

      } catch (error) {

        console.error(
          "Failed to fetch cakes:",
          error
        );


        setError(
          "We couldn't load our cakes right now. Please try again."
        );

      } finally {

        setLoading(
          false
        );

      }

    };


  /* =========================================
     LOAD CAKES
  ========================================= */

  useEffect(() => {

    fetchCakes();

  }, []);


  /* =========================================
     GET STARTING PRICE
  ========================================= */

  const getStartingPrice =
    (cake) => {

      const values =
        Object.values(
          cake.prices ||
            {}
        )
          .map(Number)
          .filter(
            (price) =>
              !Number.isNaN(
                price
              ) &&
              price > 0
          );


      if (
        !values.length
      ) {

        return Infinity;

      }


      return Math.min(
        ...values
      );

    };


  /* =========================================
     FILTER + SORT
  ========================================= */

  const filteredCakes =
    useMemo(() => {

      let result =
        cakes.filter(
          (cake) => {

            /*
              We keep unavailable
              cakes visible so customers
              can see they are currently
              unavailable.

              Add to Cart is disabled.
            */


            const cakeName =
              cake.name ||
              "";


            const cakeCategory =
              cake.category ||
              "";


            const searchText =
              search
                .trim()
                .toLowerCase();


            const matchesSearch =
              !searchText ||
              cakeName
                .toLowerCase()
                .includes(
                  searchText
                ) ||
              cakeCategory
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesCategory =
              category ===
                "All Cakes" ||
              cakeCategory
                .toLowerCase() ===
                category.toLowerCase();


            return (
              matchesSearch &&
              matchesCategory
            );

          }
        );


      /* =================================
         FEATURED
      ================================= */

      if (
        sort ===
        "featured"
      ) {

        result = [
          ...result,
        ].sort(
          (a, b) =>
            Number(
              b.isFeatured ||
                false
            ) -
            Number(
              a.isFeatured ||
                false
            )
        );

      }


      /* =================================
         LOW TO HIGH
      ================================= */

      if (
        sort ===
        "low"
      ) {

        result = [
          ...result,
        ].sort(
          (a, b) =>
            getStartingPrice(
              a
            ) -
            getStartingPrice(
              b
            )
        );

      }


      /* =================================
         HIGH TO LOW
      ================================= */

      if (
        sort ===
        "high"
      ) {

        result = [
          ...result,
        ].sort(
          (a, b) =>
            getStartingPrice(
              b
            ) -
            getStartingPrice(
              a
            )
        );

      }


      /* =================================
         TOP RATED
      ================================= */

      if (
        sort ===
        "rating"
      ) {

        result = [
          ...result,
        ].sort(
          (a, b) =>
            (b.rating ||
              0) -
            (a.rating ||
              0)
        );

      }


      return result;

    }, [
      cakes,
      search,
      category,
      sort,
    ]);


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  const clearSearch = () => {

    setSearch("");

  };


  /* =========================================
     RESET FILTERS
  ========================================= */

  const resetFilters =
    () => {

      setSearch("");

      setCategory(
        "All Cakes"
      );

      setSort(
        "featured"
      );


      /*
        Remove occasion query
        from URL.
      */

      navigate(
        "/cakes",
        {
          replace: true,
        }
      );

    };


  /* =========================================
     CATEGORY CHANGE
  ========================================= */

  const handleCategoryChange =
    (item) => {

      setCategory(
        item
      );


      /*
        If user manually selects
        a category, remove old
        occasion query.
      */

      if (
        location.search
      ) {

        navigate(
          "/cakes",
          {
            replace:
              true,
          }
        );

      }

    };


  return (

    <main
      className="
        min-h-screen
        bg-[#fff9f7]
      "
    >


      {/* =====================================
          PAGE HERO
      ===================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#542432]
          px-4
          pb-14
          pt-32
          text-white

          sm:px-6
          sm:pb-16
          sm:pt-36

          lg:pb-20
          lg:pt-40
        "
      >

        {/* BACKGROUND GLOW */}

        <motion.div

          animate={{
            scale: [
              1,
              1.1,
              1,
            ],
          }}

          transition={{
            duration: 8,
            repeat:
              Infinity,
          }}

          className="
            pointer-events-none
            absolute
            -right-20
            top-10
            h-80
            w-80
            rounded-full
            bg-pink-400/10
            blur-3xl
          "
        />


        <motion.div

          animate={{
            y: [
              0,
              -20,
              0,
            ],
          }}

          transition={{
            duration: 7,
            repeat:
              Infinity,
          }}

          className="
            pointer-events-none
            absolute
            -left-20
            bottom-0
            h-60
            w-60
            rounded-full
            bg-white/5
            blur-3xl
          "
        />


        <div
          className="
            relative
            mx-auto
            max-w-7xl
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-pink-300
            "
          >

            <Sparkles
              size={16}
            />


            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]

                sm:text-xs
                sm:tracking-[0.3em]
              "
            >
              Baked fresh for you
            </span>

          </div>


          <h1
            className="
              mt-4
              max-w-3xl
              font-serif
              text-4xl
              font-bold
              leading-[1.05]

              min-[420px]:text-5xl

              md:text-6xl

              lg:mt-5
              lg:text-7xl
            "
          >

            Find Your Next

            <span
              className="
                block
                italic
                text-pink-300
              "
            >
              Temptation.
            </span>

          </h1>


          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-6
              text-white/60

              sm:text-base
              sm:leading-7
            "
          >

            From adorable Bento
            cakes to rich chocolate
            and luxurious Kunafa
            creations, there's
            something tempting for
            every celebration.

          </p>

        </div>

      </section>


      {/* =====================================
          SHOP
      ===================================== */}

      <section
        className="
          px-4
          py-10

          sm:px-6
          sm:py-14

          lg:py-16
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >


          {/* =================================
              SEARCH + SORT
          ================================= */}

          <div
            className="
              flex
              flex-col
              gap-3

              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:gap-6
            "
          >


            {/* SEARCH */}

            <div
              className="
                relative
                w-full
                lg:max-w-xl
              "
            >

              <Search
                size={18}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />


              <input

                type="text"

                placeholder="Search cakes..."

                value={
                  search
                }

                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }

                className="
                  min-h-14
                  w-full
                  rounded-full
                  border
                  border-pink-100
                  bg-white
                  py-4
                  pl-13
                  pr-12
                  text-sm
                  text-[#542432]
                  outline-none
                  transition

                  placeholder:text-gray-400

                  focus:border-pink-400
                  focus:ring-4
                  focus:ring-pink-100/50
                "
              />


              {search && (

                <button

                  type="button"

                  onClick={
                    clearSearch
                  }

                  className="
                    absolute
                    right-4
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-[#542432]/5
                    text-[#542432]
                  "

                  aria-label="Clear search"
                >

                  <X
                    size={14}
                  />

                </button>

              )}

            </div>


            {/* =================================
                SORT
            ================================= */}

            <div
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-full
                border
                border-pink-100
                bg-white
                px-5

                lg:w-auto
              "
            >

              <SlidersHorizontal
                size={17}
                className="
                  shrink-0
                  text-[#542c38]
                "
              />


              <select

                value={
                  sort
                }

                onChange={(
                  event
                ) =>
                  setSort(
                    event
                      .target
                      .value
                  )
                }

                className="
                  min-h-14
                  w-full
                  bg-transparent
                  text-sm
                  font-semibold
                  text-[#542c38]
                  outline-none

                  lg:w-auto
                "
              >

                <option value="featured">
                  Featured
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Top Rated
                </option>

              </select>

            </div>

          </div>


          {/* =================================
              CATEGORIES
          ================================= */}

          <div
            className="
              -mx-4
              mt-7
              flex
              snap-x
              gap-2
              overflow-x-auto
              px-4
              pb-3

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:-mx-0
              sm:px-0
            "
          >

            {categories.map(
              (item) => (

                <motion.button

                  type="button"

                  key={
                    item
                  }

                  whileTap={{
                    scale: 0.95,
                  }}

                  onClick={() =>
                    handleCategoryChange(
                      item
                    )
                  }

                  className={`
                    min-h-11
                    shrink-0
                    snap-start
                    whitespace-nowrap
                    rounded-full
                    px-5
                    py-3
                    text-xs
                    font-bold
                    transition

                    sm:px-6
                    sm:text-sm

                    ${
                      category ===
                      item
                        ? "bg-[#542c38] text-white shadow-lg"
                        : "bg-white text-[#704653] shadow-sm hover:bg-pink-50"
                    }
                  `}
                >

                  {item}

                </motion.button>

              )
            )}

          </div>


          {/* =================================
              RESULTS
          ================================= */}

          {!loading &&
            !error && (

            <div
              className="
                mt-7
                flex
                items-center
                justify-between
                gap-3

                sm:mt-10
              "
            >

              <p
                className="
                  text-xs
                  text-gray-500

                  sm:text-sm
                "
              >

                Showing{" "}

                <strong
                  className="
                    text-[#542c38]
                  "
                >
                  {
                    filteredCakes
                      .length
                  }
                </strong>{" "}

                tempting creations

              </p>


              {(search ||
                category !==
                  "All Cakes" ||
                sort !==
                  "featured") && (

                <button

                  type="button"

                  onClick={
                    resetFilters
                  }

                  className="
                    shrink-0
                    text-xs
                    font-bold
                    text-pink-500
                  "
                >
                  Reset
                </button>

              )}

            </div>

          )}


          {/* =================================
              LOADING
          ================================= */}

          {loading ? (

            <div
              className="
                py-24
                text-center

                sm:py-28
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
                  mx-auto
                  h-11
                  w-11
                  rounded-full
                  border-4
                  border-pink-100
                  border-t-pink-500
                "
              />


              <p
                className="
                  mt-5
                  text-sm
                  font-semibold
                  text-[#704653]
                "
              >
                Baking up something
                tempting...
              </p>

            </div>


          ) : error ? (


            /* =================================
                ERROR
            ================================= */

            <div
              className="
                py-24
                text-center
              "
            >

              <h3
                className="
                  font-serif
                  text-2xl
                  font-bold
                  text-[#542c38]

                  sm:text-3xl
                "
              >
                Oops! Something went
                wrong.
              </h3>


              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  text-gray-500
                "
              >
                {error}
              </p>


              <motion.button

                type="button"

                whileHover={{
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}

                onClick={
                  fetchCakes
                }

                className="
                  mx-auto
                  mt-6
                  flex
                  min-h-12
                  items-center
                  gap-2
                  rounded-full
                  bg-pink-500
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                "
              >

                <RefreshCw
                  size={16}
                />

                Try Again

              </motion.button>

            </div>


          ) : filteredCakes.length >
            0 ? (


            /* =================================
                PRODUCT GRID
            ================================= */

            <div
              className="
                mt-6
                grid
                grid-cols-1
                gap-5

                min-[520px]:grid-cols-2

                sm:mt-8
                sm:gap-6

                lg:grid-cols-3
                lg:gap-7
              "
            >

              {filteredCakes.map(
                (
                  cake,
                  index
                ) => (

                  <ProductCard

                    key={
                      cake._id ||
                      cake.id
                    }

                    cake={
                      cake
                    }

                    index={
                      index
                    }

                  />

                )
              )}

            </div>


          ) : (


            /* =================================
                NO RESULTS
            ================================= */

            <div
              className="
                py-24
                text-center
              "
            >

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-50
                  text-3xl
                "
              >
                🎂
              </div>


              <h3
                className="
                  mt-5
                  font-serif
                  text-2xl
                  font-bold
                  text-[#542c38]

                  sm:text-3xl
                "
              >
                No tempting cakes
                found.
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  text-gray-500
                "
              >
                Try another search
                or explore all our
                cakes.
              </p>


              <button

                type="button"

                onClick={
                  resetFilters
                }

                className="
                  mt-6
                  min-h-12
                  rounded-full
                  bg-[#542c38]
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                "
              >
                View All Cakes
              </button>

            </div>

          )}

        </div>

      </section>

    </main>

  );

}


export default CakesPage;