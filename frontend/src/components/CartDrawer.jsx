import {
  useEffect,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MapPin,
} from "lucide-react";

import {
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/cartSlice";


function CartDrawer() {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  /* =========================
     CART STATE
  ========================= */

  const isOpen =
    useSelector(
      (state) =>
        state.cart.isOpen
    );


  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );


  /* =========================
     CALCULATE SUBTOTAL
  ========================= */

  const subtotal =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price ||
            0
        ) *
          Number(
            item.quantity ||
              1
          ),
      0
    );


  /* =========================
     TOTAL ITEMS
  ========================= */

  const totalItems =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity ||
            1
        ),
      0
    );


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
     ESCAPE KEY
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

          dispatch(
            closeCart()
          );

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
    dispatch,
  ]);


  /* =========================
     CHECKOUT
  ========================= */

  const handleCheckout =
    () => {

      if (
        cartItems.length ===
        0
      ) {
        return;
      }


      dispatch(
        closeCart()
      );


      navigate(
        "/checkout"
      );

    };


  /* =========================
     EXPLORE CAKES
  ========================= */

  const handleExplore =
    () => {

      dispatch(
        closeCart()
      );


      navigate(
        "/cakes"
      );

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

            onClick={() =>
              dispatch(
                closeCart()
              )
            }

            className="
              fixed
              inset-0
              z-[190]
              bg-black/55
              backdrop-blur-sm
            "
          />


          {/* =========================
              CART DRAWER

              MOBILE:
              Bottom sheet

              TABLET / DESKTOP:
              Right drawer
          ========================= */}

          <motion.aside

            initial={{
              y: "100%",
            }}

            animate={{
              y: 0,
            }}

            exit={{
              y: "100%",
            }}

            transition={{
              type:
                "spring",
              damping: 28,
              stiffness: 240,
            }}

            className="
              fixed
              bottom-0
              left-0
              right-0
              z-[200]
              flex
              max-h-[92dvh]
              w-full
              flex-col
              overflow-hidden
              rounded-t-[2rem]
              bg-[#fffaf8]
              shadow-2xl

              sm:bottom-auto
              sm:left-auto
              sm:right-0
              sm:top-0
              sm:h-full
              sm:max-h-none
              sm:max-w-md
              sm:rounded-none
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
                z-50
                h-1
                w-10
                -translate-x-1/2
                rounded-full
                bg-white/40

                sm:hidden
              "
            />


            {/* =========================
                HEADER
            ========================= */}

            <div
              className="
                relative
                shrink-0
                overflow-hidden
                bg-[#542432]
                px-5
                pb-5
                pt-7
                text-white

                sm:px-6
                sm:pb-7
                sm:pt-7
              "
            >


              {/* DECORATIVE BUBBLE */}

              <motion.div

                animate={{
                  x: [
                    0,
                    20,
                    0,
                  ],

                  y: [
                    0,
                    -10,
                    0,
                  ],
                }}

                transition={{
                  duration: 6,
                  repeat:
                    Infinity,
                }}

                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-40
                  w-40
                  rounded-full
                  bg-pink-400/20
                  blur-2xl
                "
              />


              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >


                {/* TITLE */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3

                    sm:gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-pink-500
                      shadow-lg

                      sm:h-12
                      sm:w-12
                    "
                  >

                    <ShoppingBag
                      size={20}
                    />

                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >

                    <p
                      className="
                        truncate
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-pink-300

                        sm:text-[10px]
                        sm:tracking-[0.25em]
                      "
                    >
                      Your sweet picks
                    </p>


                    <h2
                      className="
                        mt-1
                        font-serif
                        text-xl
                        font-bold

                        sm:text-2xl
                      "
                    >
                      Shopping Bag
                    </h2>

                  </div>

                </div>


                {/* CLOSE */}

                <motion.button

                  type="button"

                  whileHover={{
                    rotate: 90,
                  }}

                  whileTap={{
                    scale: 0.9,
                  }}

                  onClick={() =>
                    dispatch(
                      closeCart()
                    )
                  }

                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    backdrop-blur-md
                  "

                  aria-label="Close cart"
                >

                  <X
                    size={18}
                  />

                </motion.button>

              </div>


              {/* ITEM COUNT */}

              {totalItems >
                0 && (

                <p
                  className="
                    relative
                    mt-4
                    text-xs
                    text-white/60

                    sm:mt-5
                    sm:text-sm
                  "
                >

                  {totalItems}{" "}

                  {totalItems ===
                  1
                    ? "delicious item"
                    : "delicious items"}{" "}

                  waiting for you

                </p>

              )}

            </div>


            {/* =========================
                DELIVERY AREA NOTICE
            ========================= */}

            {cartItems.length >
              0 && (

              <div
                className="
                  shrink-0
                  border-b
                  border-pink-100
                  bg-[#fff4f6]
                  px-4
                  py-3

                  sm:px-5
                "
              >

                <div
                  className="
                    flex
                    items-center
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
                      bg-white
                      text-pink-500
                      shadow-sm
                    "
                  >

                    <MapPin
                      size={16}
                    />

                  </div>


                  <div>

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-pink-500
                      "
                    >
                      Delivery Area
                    </p>


                    <p
                      className="
                        mt-0.5
                        text-xs
                        font-semibold
                        text-[#542432]

                        sm:text-sm
                      "
                    >
                      Panvel • India Bulls • PIN 410206
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =========================
                CART CONTENT
            ========================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                px-4
                py-5

                sm:px-5
                sm:py-6

                [scrollbar-width:thin]
              "
            >


              {cartItems.length ===
              0 ? (


                /* =========================
                    EMPTY CART
                ========================= */

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  className="
                    flex
                    min-h-[380px]
                    flex-col
                    items-center
                    justify-center
                    px-4
                    py-10
                    text-center
                  "
                >

                  <motion.div

                    animate={{
                      y: [
                        0,
                        -8,
                        0,
                      ],
                    }}

                    transition={{
                      duration: 3,
                      repeat:
                        Infinity,
                    }}

                    className="
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      bg-pink-50

                      sm:h-24
                      sm:w-24
                    "
                  >

                    <ShoppingBag

                      size={34}

                      className="
                        text-pink-300

                        sm:size-[38px]
                      "
                    />

                  </motion.div>


                  <h3
                    className="
                      mt-6
                      font-serif
                      text-2xl
                      font-bold
                      text-[#542432]

                      sm:text-3xl
                    "
                  >
                    Your bag feels light
                  </h3>


                  <p
                    className="
                      mt-3
                      max-w-xs
                      text-sm
                      leading-6
                      text-gray-400
                    "
                  >
                    Add something
                    delicious and make
                    your day a little
                    sweeter.
                  </p>


                  <motion.button

                    type="button"

                    whileHover={{
                      scale: 1.03,
                    }}

                    whileTap={{
                      scale: 0.97,
                    }}

                    onClick={
                      handleExplore
                    }

                    className="
                      mt-7
                      flex
                      min-h-12
                      items-center
                      justify-center
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

                    Explore Cakes

                    <ArrowRight
                      size={17}
                    />

                  </motion.button>

                </motion.div>


              ) : (


                /* =========================
                    CART ITEMS
                ========================= */

                <div
                  className="
                    space-y-3

                    sm:space-y-4
                  "
                >

                  <AnimatePresence
                    initial={false}
                  >

                    {cartItems.map(
                      (
                        item,
                        index
                      ) => (

                        <motion.div

                          key={`${item.id}-${item.weight}-${item.cakeType || "default"}-${index}`}

                          layout

                          initial={{
                            opacity: 0,
                            x: 30,
                          }}

                          animate={{
                            opacity: 1,
                            x: 0,
                          }}

                          exit={{
                            opacity: 0,
                            x: 30,
                            scale:
                              0.95,
                          }}

                          className="
                            rounded-[1.4rem]
                            bg-white
                            p-3
                            shadow-[0_10px_35px_rgba(80,30,45,0.06)]

                            sm:rounded-[1.5rem]
                            sm:p-4
                          "
                        >


                          <div
                            className="
                              flex
                              gap-3

                              sm:gap-4
                            "
                          >


                            {/* IMAGE */}

                            <div
                              className="
                                h-20
                                w-20
                                shrink-0
                                overflow-hidden
                                rounded-xl
                                bg-pink-50

                                min-[380px]:h-24
                                min-[380px]:w-24

                                sm:rounded-2xl
                              "
                            >

                              {item.image ? (

                                <motion.img

                                  whileHover={{
                                    scale:
                                      1.1,
                                  }}

                                  src={
                                    item.image
                                  }

                                  alt={
                                    item.name
                                  }

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
                                    items-center
                                    justify-center
                                    text-3xl
                                  "
                                >
                                  🎂
                                </div>

                              )}

                            </div>


                            {/* DETAILS */}

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >


                              {/* NAME + REMOVE */}

                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-2
                                "
                              >

                                <div
                                  className="
                                    min-w-0
                                  "
                                >

                                  <h3
                                    className="
                                      line-clamp-2
                                      font-serif
                                      text-base
                                      font-bold
                                      leading-tight
                                      text-[#542432]

                                      sm:text-lg
                                    "
                                  >
                                    {item.name}
                                  </h3>


                                  <p
                                    className="
                                      mt-1
                                      text-[10px]
                                      text-gray-400

                                      sm:text-xs
                                    "
                                  >

                                    {item.weight}

                                    {item.cakeType &&
                                      ` • ${item.cakeType}`}

                                  </p>

                                </div>


                                {/* REMOVE */}

                                <motion.button

                                  type="button"

                                  whileHover={{
                                    scale:
                                      1.1,
                                  }}

                                  whileTap={{
                                    scale:
                                      0.9,
                                  }}

                                  onClick={() =>
                                    dispatch(
                                      removeFromCart(
                                        {
                                          id:
                                            item.id,

                                          weight:
                                            item.weight,
                                        }
                                      )
                                    )
                                  }

                                  className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-300
                                    transition

                                    hover:bg-red-50
                                    hover:text-red-500
                                  "

                                  aria-label={`Remove ${item.name}`}
                                >

                                  <Trash2
                                    size={15}
                                  />

                                </motion.button>

                              </div>


                              {/* =========================
                                  CAKE MESSAGE
                              ========================= */}

                              {item.message && (

                                <div
                                  className="
                                    mt-2
                                    rounded-xl
                                    bg-pink-50
                                    px-3
                                    py-2
                                  "
                                >

                                  <p
                                    className="
                                      text-[8px]
                                      font-bold
                                      uppercase
                                      tracking-wider
                                      text-pink-500
                                    "
                                  >
                                    Cake message
                                  </p>


                                  <p
                                    className="
                                      mt-0.5
                                      line-clamp-2
                                      text-[10px]
                                      text-[#704653]

                                      sm:text-xs
                                    "
                                  >
                                    "
                                    {item.message}
                                    "
                                  </p>

                                </div>

                              )}


                              {/* =========================
                                  PRICE + QUANTITY
                              ========================= */}

                              <div
                                className="
                                  mt-3
                                  flex
                                  items-center
                                  justify-between
                                  gap-2

                                  sm:mt-4
                                "
                              >


                                {/* PRICE */}

                                <motion.p

                                  key={`${item.price}-${item.quantity}`}

                                  initial={{
                                    scale:
                                      0.95,
                                  }}

                                  animate={{
                                    scale: 1,
                                  }}

                                  className="
                                    text-sm
                                    font-black
                                    text-pink-500

                                    sm:text-base
                                  "
                                >

                                  ₹
                                  {Number(
                                    item.price ||
                                      0
                                  ) *
                                    Number(
                                      item.quantity ||
                                        1
                                    )}

                                </motion.p>


                                {/* QUANTITY */}

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    bg-pink-50
                                    p-1

                                    min-[380px]:gap-2
                                  "
                                >

                                  <motion.button

                                    type="button"

                                    whileTap={{
                                      scale:
                                        0.8,
                                    }}

                                    onClick={() =>
                                      dispatch(
                                        decreaseQuantity(
                                          {
                                            id:
                                              item.id,

                                            weight:
                                              item.weight,
                                          }
                                        )
                                      )
                                    }

                                    className="
                                      flex
                                      h-8
                                      w-8
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
                                      size={13}
                                    />

                                  </motion.button>


                                  <span
                                    className="
                                      min-w-5
                                      text-center
                                      text-xs
                                      font-bold
                                      text-[#542432]
                                    "
                                  >
                                    {
                                      item.quantity
                                    }
                                  </span>


                                  <motion.button

                                    type="button"

                                    whileTap={{
                                      scale:
                                        0.8,
                                    }}

                                    onClick={() =>
                                      dispatch(
                                        increaseQuantity(
                                          {
                                            id:
                                              item.id,

                                            weight:
                                              item.weight,
                                          }
                                        )
                                      )
                                    }

                                    className="
                                      flex
                                      h-8
                                      w-8
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
                                      size={13}
                                    />

                                  </motion.button>

                                </div>

                              </div>

                            </div>

                          </div>

                        </motion.div>

                      )
                    )}

                  </AnimatePresence>

                </div>

              )}

            </div>


            {/* =========================
                CART FOOTER
            ========================= */}

            {cartItems.length >
              0 && (

              <div
                className="
                  shrink-0
                  border-t
                  border-pink-100
                  bg-white
                  px-4
                  pb-[max(1rem,env(safe-area-inset-bottom))]
                  pt-4

                  sm:px-6
                  sm:pb-7
                  sm:pt-5
                "
              >


                {/* =========================
                    SUBTOTAL
                ========================= */}

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        text-gray-400

                        sm:text-sm
                      "
                    >
                      Subtotal
                    </p>


                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        leading-4
                        text-gray-400

                        sm:text-[10px]
                      "
                    >
                      Delivery details
                      confirmed at checkout
                    </p>

                  </div>


                  <motion.p

                    key={
                      subtotal
                    }

                    initial={{
                      scale: 0.9,
                    }}

                    animate={{
                      scale: 1,
                    }}

                    className="
                      shrink-0
                      text-2xl
                      font-black
                      text-[#542432]
                    "
                  >

                    ₹
                    {subtotal}

                  </motion.p>

                </div>


                {/* =========================
                    CHECKOUT BUTTON
                ========================= */}

                <motion.button

                  type="button"

                  whileHover={{
                    scale: 1.02,

                    boxShadow:
                      "0px 12px 30px rgba(236,72,153,0.25)",
                  }}

                  whileTap={{
                    scale: 0.97,
                  }}

                  onClick={
                    handleCheckout
                  }

                  className="
                    mt-4
                    flex
                    min-h-13
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-pink-500
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-white

                    sm:mt-5
                  "
                >

                  Proceed to Checkout

                  <ArrowRight
                    size={18}
                  />

                </motion.button>


                {/* DELIVERY RESTRICTION */}

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    text-center
                    text-[9px]
                    text-gray-400

                    sm:text-[10px]
                  "
                >

                  <MapPin
                    size={11}
                    className="
                      shrink-0
                      text-pink-400
                    "
                  />

                  Delivery only in Panvel /
                  India Bulls – 410206

                </div>

              </div>

            )}

          </motion.aside>

        </>

      )}

    </AnimatePresence>

  );

}


export default CartDrawer;