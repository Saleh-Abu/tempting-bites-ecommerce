import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { useDispatch } from "react-redux";

import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  addToCart,
  openCart,
} from "../features/cartSlice";


function CakeQuickView({
  cake,
  isOpen,
  onClose,
}) {

  const dispatch =
    useDispatch();


  /* =========================
     STATE
  ========================= */

  const [weight, setWeight] =
    useState("");

  const [
    cakeType,
    setCakeType,
  ] = useState("Eggless");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    added,
    setAdded,
  ] = useState(false);


  /* =========================
     RESET WHEN CAKE OPENS
  ========================= */

  useEffect(() => {

    if (
      !cake ||
      !isOpen
    ) {
      return;
    }


    const availableWeights =
      Object.keys(
        cake.prices || {}
      );


    setWeight(
      availableWeights[0] ||
        ""
    );

    setCakeType(
      "Eggless"
    );

    setMessage("");

    setQuantity(1);

    setAdded(false);

  }, [
    cake,
    isOpen,
  ]);


  /* =========================
     PREVENT BACKGROUND SCROLL
  ========================= */

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    const previousOverflow =
      document.body.style
        .overflow;


    document.body.style
      .overflow = "hidden";


    return () => {

      document.body.style
        .overflow =
        previousOverflow;

    };

  }, [
    isOpen,
  ]);


  /* =========================
     ESCAPE TO CLOSE
  ========================= */

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    const handleKeyDown =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {

          onClose();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    isOpen,
    onClose,
  ]);


  if (!cake) {
    return null;
  }


  /* =========================
     PRICE DATA
  ========================= */

  const prices =
    cake.prices || {};


  const priceEntries =
    Object.entries(
      prices
    );


  const selectedPrice =
    Number(
      prices[weight] ||
        0
    );


  const totalPrice =
    selectedPrice *
    quantity;


  const isAvailable =
    cake.isAvailable !==
    false;


  const canAdd =
    isAvailable &&
    weight &&
    selectedPrice > 0;


  /* =========================
     ADD TO CART
  ========================= */

  const handleAdd = () => {

    if (!canAdd) {
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

        cakeType,

        message:
          message.trim(),

        price:
          selectedPrice,

        quantity,

      })
    );


    setAdded(true);


    setTimeout(() => {

      onClose();

    }, 500);

  };


  /* =========================
     ADD + OPEN CART
  ========================= */

  const handleOrderNow =
    () => {

      if (!canAdd) {
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

          cakeType,

          message:
            message.trim(),

          price:
            selectedPrice,

          quantity,

        })
      );


      onClose();


      setTimeout(() => {

        dispatch(
          openCart()
        );

      }, 200);

    };


  return (

    <AnimatePresence>

      {isOpen && (

        <>

          {/* =========================
              BACKDROP
          ========================= */}

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

            onClick={
              onClose
            }

            className="
              fixed
              inset-0
              z-[110]
              bg-black/65
              backdrop-blur-sm
            "
          />


          {/* =========================
              MODAL WRAPPER
          ========================= */}

          <div
            className="
              pointer-events-none
              fixed
              inset-0
              z-[120]
              flex
              items-end
              justify-center

              sm:items-center
              sm:p-5
            "
          >

            <motion.div

              initial={{
                opacity: 0,
                y: 80,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: 80,
              }}

              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}

              onClick={(
                event
              ) =>
                event.stopPropagation()
              }

              className="
                pointer-events-auto
                relative
                w-full
                max-w-4xl
                overflow-hidden
                rounded-t-[2rem]
                bg-white
                shadow-2xl

                sm:max-h-[92vh]
                sm:rounded-[2rem]
              "
            >


              {/* =========================
                  MOBILE DRAG INDICATOR
              ========================= */}

              <div
                className="
                  absolute
                  left-1/2
                  top-2
                  z-40
                  h-1
                  w-10
                  -translate-x-1/2
                  rounded-full
                  bg-white/60

                  sm:hidden
                "
              />


              {/* =========================
                  MOBILE CLOSE
              ========================= */}

              <motion.button

                type="button"

                whileTap={{
                  scale: 0.9,
                }}

                onClick={
                  onClose
                }

                className="
                  absolute
                  right-4
                  top-4
                  z-50
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  text-[#542432]
                  shadow-lg
                  backdrop-blur-md

                  md:hidden
                "

                aria-label="Close quick view"
              >

                <X
                  size={18}
                />

              </motion.button>


              {/* =========================
                  SCROLL AREA
              ========================= */}

              <div
                className="
                  grid
                  max-h-[94vh]
                  overflow-y-auto

                  md:max-h-[90vh]
                  md:grid-cols-2
                "
              >


                {/* =========================
                    IMAGE
                ========================= */}

                <div
                  className="
                    relative
                    h-[260px]
                    overflow-hidden
                    bg-pink-50

                    min-[420px]:h-[320px]

                    sm:h-[360px]

                    md:sticky
                    md:top-0
                    md:h-full
                    md:min-h-[620px]
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

                      className="
                        absolute
                        inset-0
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
                        bg-pink-50
                        text-7xl
                      "
                    >
                      🎂
                    </div>

                  )}


                  {/* IMAGE GRADIENT */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/40
                      via-transparent
                      to-black/10
                    "
                  />


                  {/* MOBILE CAKE NAME */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-full
                      p-5
                      text-white

                      md:hidden
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-pink-200
                      "
                    >
                      {cake.category ||
                        "Handcrafted Cake"}
                    </p>


                    <h2
                      className="
                        mt-1
                        font-serif
                        text-2xl
                        font-bold
                      "
                    >
                      {cake.name}
                    </h2>

                  </div>

                </div>


                {/* =========================
                    DETAILS
                ========================= */}

                <div
                  className="
                    relative
                    p-5
                    pb-8

                    sm:p-7

                    md:p-9
                    lg:p-10
                  "
                >


                  {/* DESKTOP CLOSE */}

                  <motion.button

                    type="button"

                    whileHover={{
                      rotate: 90,
                    }}

                    whileTap={{
                      scale: 0.9,
                    }}

                    onClick={
                      onClose
                    }

                    className="
                      absolute
                      right-6
                      top-6
                      hidden
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-pink-50
                      text-[#542432]

                      md:flex
                    "

                    aria-label="Close quick view"
                  >

                    <X
                      size={19}
                    />

                  </motion.button>


                  {/* =========================
                      DESKTOP TITLE
                  ========================= */}

                  <div
                    className="
                      hidden
                      md:block
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-pink-500
                      "
                    >
                      {cake.category ||
                        "Handcrafted Cake"}
                    </p>


                    <h2
                      className="
                        mt-3
                        max-w-[85%]
                        font-serif
                        text-4xl
                        font-bold
                        leading-tight
                        text-[#421f27]
                      "
                    >
                      {cake.name}
                    </h2>

                  </div>


                  {/* =========================
                      RATING
                  ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      md:mt-4
                    "
                  >

                    <Star

                      size={16}

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
                      {" "}
                      reviews)
                    </span>

                  </div>


                  {/* =========================
                      DESCRIPTION
                  ========================= */}

                  {cake.description && (

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-6
                        text-gray-500
                      "
                    >
                      {
                        cake.description
                      }
                    </p>

                  )}


                  {/* =========================
                      PRICE
                  ========================= */}

                  <motion.div

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
                      mt-5
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-gray-400
                      "
                    >
                      {weight ||
                        "Select Weight"}
                    </p>


                    <p
                      className="
                        mt-1
                        text-3xl
                        font-black
                        text-pink-500
                      "
                    >
                      {selectedPrice >
                      0
                        ? `₹${selectedPrice}`
                        : "—"}
                    </p>

                  </motion.div>


                  {/* =========================
                      WEIGHT
                  ========================= */}

                  <div
                    className="
                      mt-6
                    "
                  >

                    <p
                      className="
                        mb-3
                        text-sm
                        font-bold
                        text-[#542c38]
                      "
                    >
                      Select Weight
                    </p>


                    {priceEntries.length >
                    0 ? (

                      <div
                        className="
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

                                sm:px-5
                                sm:text-sm

                                ${
                                  weight ===
                                  item
                                    ? "bg-[#542c38] text-white shadow-md"
                                    : "bg-pink-50 text-[#704653]"
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
                          text-sm
                          text-gray-400
                        "
                      >
                        No weight options
                        available.
                      </p>

                    )}

                  </div>


                  {/* =========================
                      CAKE PREFERENCE
                  ========================= */}

                  <div
                    className="
                      mt-6
                    "
                  >

                    <p
                      className="
                        mb-3
                        text-sm
                        font-bold
                        text-[#542c38]
                      "
                    >
                      Cake Preference
                    </p>


                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >

                      {[
                        "Eggless",
                        "With Egg",
                      ].map(
                        (
                          type
                        ) => (

                          <button

                            type="button"

                            key={
                              type
                            }

                            onClick={() =>
                              setCakeType(
                                type
                              )
                            }

                            className={`
                              min-h-11
                              rounded-full
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              transition

                              sm:text-sm

                              ${
                                cakeType ===
                                type
                                  ? "bg-pink-500 text-white shadow-md"
                                  : "bg-pink-50 text-[#704653]"
                              }
                            `}
                          >

                            {type}

                          </button>

                        )
                      )}

                    </div>

                  </div>


                  {/* =========================
                      CAKE MESSAGE
                  ========================= */}

                  <div
                    className="
                      mt-6
                    "
                  >

                    <label
                      htmlFor={`cake-message-${
                        cake._id ||
                        cake.id
                      }`}

                      className="
                        text-sm
                        font-bold
                        text-[#542c38]
                      "
                    >
                      Message on Cake
                    </label>


                    <input

                      id={`cake-message-${
                        cake._id ||
                        cake.id
                      }`}

                      value={
                        message
                      }

                      onChange={(
                        event
                      ) =>
                        setMessage(
                          event
                            .target
                            .value
                        )
                      }

                      maxLength={
                        40
                      }

                      placeholder="e.g. Happy Birthday Sara!"

                      className="
                        mt-3
                        min-h-13
                        w-full
                        rounded-2xl
                        border
                        border-pink-100
                        bg-[#fff9fa]
                        px-4
                        py-3
                        text-sm
                        text-[#542432]
                        outline-none
                        transition

                        placeholder:text-gray-400

                        focus:border-pink-400
                        focus:ring-4
                        focus:ring-pink-100/50

                        sm:px-5
                        sm:py-4
                      "
                    />


                    <p
                      className="
                        mt-1
                        text-right
                        text-[10px]
                        text-gray-400
                      "
                    >
                      {message.length}
                      /40
                    </p>

                  </div>


                  {/* =========================
                      QUANTITY + TOTAL
                  ========================= */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >


                    {/* QUANTITY */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-full
                        bg-pink-50
                        p-1.5
                      "
                    >

                      <motion.button

                        type="button"

                        whileTap={{
                          scale: 0.85,
                        }}

                        onClick={() =>
                          setQuantity(
                            Math.max(
                              1,
                              quantity -
                                1
                            )
                          )
                        }

                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[#542432]
                          shadow-sm
                        "

                        aria-label="Decrease quantity"
                      >

                        <Minus
                          size={15}
                        />

                      </motion.button>


                      <span
                        className="
                          min-w-5
                          text-center
                          text-sm
                          font-bold
                          text-[#542432]
                        "
                      >
                        {quantity}
                      </span>


                      <motion.button

                        type="button"

                        whileTap={{
                          scale: 0.85,
                        }}

                        onClick={() =>
                          setQuantity(
                            quantity +
                              1
                          )
                        }

                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[#542432]
                          shadow-sm
                        "

                        aria-label="Increase quantity"
                      >

                        <Plus
                          size={15}
                        />

                      </motion.button>

                    </div>


                    {/* TOTAL */}

                    <div
                      className="
                        text-right
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-gray-400
                        "
                      >
                        Total
                      </p>


                      <motion.p

                        key={
                          totalPrice
                        }

                        initial={{
                          opacity: 0,
                          scale:
                            0.95,
                        }}

                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}

                        className="
                          text-xl
                          font-black
                          text-[#542432]

                          sm:text-2xl
                        "
                      >
                        ₹
                        {
                          totalPrice
                        }
                      </motion.p>

                    </div>

                  </div>


                  {/* =========================
                      ACTION BUTTONS
                  ========================= */}

                  <div
                    className="
                      mt-7
                      grid
                      gap-2

                      min-[420px]:grid-cols-2
                    "
                  >

                    <motion.button

                      type="button"

                      whileHover={
                        canAdd
                          ? {
                              scale:
                                1.02,
                            }
                          : {}
                      }

                      whileTap={
                        canAdd
                          ? {
                              scale:
                                0.97,
                            }
                          : {}
                      }

                      onClick={
                        handleAdd
                      }

                      disabled={
                        !canAdd
                      }

                      className={`
                        flex
                        min-h-13
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        px-4
                        py-4
                        text-sm
                        font-bold
                        text-white
                        transition

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
                        size={18}
                      />

                      {added
                        ? "Added ✓"
                        : "Add to Cart"}

                    </motion.button>


                    <motion.button

                      type="button"

                      whileHover={
                        canAdd
                          ? {
                              scale:
                                1.02,
                            }
                          : {}
                      }

                      whileTap={
                        canAdd
                          ? {
                              scale:
                                0.97,
                            }
                          : {}
                      }

                      onClick={
                        handleOrderNow
                      }

                      disabled={
                        !canAdd
                      }

                      className="
                        min-h-13
                        rounded-full
                        bg-[#542432]
                        px-4
                        py-4
                        text-sm
                        font-bold
                        text-white

                        disabled:cursor-not-allowed
                        disabled:bg-gray-300
                      "
                    >
                      Order Now
                    </motion.button>

                  </div>


                  {/* =========================
                      UNAVAILABLE
                  ========================= */}

                  {!isAvailable && (

                    <p
                      className="
                        mt-4
                        text-center
                        text-xs
                        font-semibold
                        text-red-400
                      "
                    >
                      This cake is
                      currently unavailable.
                    </p>

                  )}

                </div>

              </div>

            </motion.div>

          </div>

        </>

      )}

    </AnimatePresence>

  );

}


export default CakeQuickView;