import { useState } from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  MapPin,
  X,
  CakeSlice,
  GraduationCap,
  Home,
  Package,
  Heart,
  LogOut,
  User,
  ChevronDown,
  MapPinned,
} from "lucide-react";

import {
  openCart,
} from "../features/cartSlice";

import {
  useAuth,
} from "../context/AuthContext";

import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";


function Navbar() {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /* =========================
     CUSTOMER AUTH
  ========================= */

  const {
    user,
    logout,
  } = useAuth();


  /* =========================
     MODALS
  ========================= */

  const [
    authOpen,
    setAuthOpen,
  ] = useState(false);

  const [
    locationOpen,
    setLocationOpen,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  /* =========================
     LOCATION
  ========================= */

  const [
    deliveryLocation,
    setDeliveryLocation,
  ] = useState(
    localStorage.getItem(
      "temptingBitesPincode"
    ) || ""
  );


  const handleLocationSelect = (
    pincode
  ) => {

    setDeliveryLocation(
      pincode
    );

    localStorage.setItem(
      "temptingBitesPincode",
      pincode
    );

  };


  /* =========================
     CART
  ========================= */

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );


  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    );


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    setProfileOpen(false);

    setMobileMenuOpen(false);

    logout();

    navigate("/");

  };


  /* =========================
     PROFILE NAVIGATION
  ========================= */

  const handleProfileNavigation = (
    path
  ) => {

    setProfileOpen(false);

    setMobileMenuOpen(false);

    navigate(path);

  };


  /* =========================
     LOGIN BUTTON
  ========================= */

  const handleLoginClick = () => {

    if (user) {

      setProfileOpen(
        (previous) =>
          !previous
      );

      return;

    }

    setAuthOpen(true);

  };


  /* =========================
     CLOSE MOBILE MENU
  ========================= */

  const closeMobileMenu =
    () => {

      setMobileMenuOpen(
        false
      );

    };


  /* =========================
     SCROLL TO SECTION
  ========================= */

  const scrollToSection = (
    sectionId
  ) => {

    closeMobileMenu();


    /*
     * If customer is already
     * on homepage, scroll directly.
     */

    if (
      location.pathname === "/"
    ) {

      const section =
        document.getElementById(
          sectionId
        );

      if (section) {

        section.scrollIntoView({
          behavior:
            "smooth",
        });

      }

      return;

    }


    /*
     * If customer is on another
     * page, first go home.
     */

    navigate("/");


    /*
     * Wait for homepage
     * components to render.
     */

    setTimeout(() => {

      const section =
        document.getElementById(
          sectionId
        );

      if (section) {

        section.scrollIntoView({
          behavior:
            "smooth",
        });

      }

    }, 300);

  };


  return (
    <>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <motion.header

        initial={{
          y: -100,
          opacity: 0,
        }}

        animate={{
          y: 0,
          opacity: 1,
        }}

        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}

        className="
          fixed
          left-0
          top-0
          z-70
          w-full
          px-3
          pt-3
          sm:px-5
          sm:pt-5
        "
      >

        {/* =================================
            NAVBAR OVAL CONTAINER
        ================================= */}

        <nav
          className="
            mx-auto
            flex
            h-[72px]
            max-w-7xl
            items-center
            justify-between
            rounded-full
            border
            border-white/15
            bg-black/15
            px-4
            text-white
            shadow-[0_15px_50px_rgba(0,0,0,0.15)]
            backdrop-blur-xl
            sm:h-20
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================
              LOGO
          ================================= */}

          <Link
            to="/"
            onClick={
              closeMobileMenu
            }
          >

            <motion.div

              whileHover={{
                scale: 1.03,
              }}

              className="
                flex
                items-center
                gap-2
                sm:gap-3
              "
            >

              {/* LOGO ICON */}

              <motion.div

                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}

                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  backdrop-blur-md
                  sm:h-11
                  sm:w-11
                "
              >

                <CakeSlice
                  size={20}
                  className="
                    text-pink-200
                  "
                />

              </motion.div>


              {/* BRAND NAME */}

              <div>

                <h1
                  className="
                    whitespace-nowrap
                    font-serif
                    text-lg
                    font-bold
                    italic
                    tracking-wide
                    sm:text-2xl
                  "
                >
                  Tempting Bites
                </h1>


                <p
                  className="
                    hidden
                    text-[7px]
                    uppercase
                    tracking-[0.3em]
                    text-white/60
                    sm:block
                  "
                >
                  Baked with love
                </p>

              </div>

            </motion.div>

          </Link>


          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}

          <div
            className="
              hidden
              items-center
              gap-7
              lg:flex
            "
          >

            <NavItem
              to="/"
              label="Home"
            />


            <NavItem
              to="/cakes"
              label="Cakes"
            />


            <NavItem
              to="/cakes"
              label="Custom Cakes"
            />


            {/* CAREER */}

            <motion.button

              whileHover={{
                y: -3,
              }}

              onClick={() =>
                scrollToSection(
                  "careers"
                )
              }

              className="
                flex
                items-center
                gap-1.5
                text-sm
                font-medium
                text-white/90
                transition
                hover:text-pink-200
              "
            >

              Career

            </motion.button>


            {/* REVIEWS */}

            <motion.button

              whileHover={{
                y: -3,
              }}

              onClick={() =>
                scrollToSection(
                  "reviews"
                )
              }

              className="
                text-sm
                font-medium
                text-white/90
                transition
                hover:text-pink-200
              "
            >

              Reviews

            </motion.button>

          </div>


          {/* =================================
              RIGHT SIDE
          ================================= */}

          <div
            className="
              flex
              items-center
              gap-3
              sm:gap-4
            "
          >

            {/* =================================
                DELIVERY LOCATION
            ================================= */}

            <motion.button

              whileHover={{
                scale: 1.04,
              }}

              whileTap={{
                scale: 0.96,
              }}

              onClick={() =>
                setLocationOpen(
                  true
                )
              }

              className="
                hidden
                items-center
                gap-2
                text-sm
                md:flex
              "
            >

              <MapPin
                size={18}
              />


              <div
                className="
                  text-left
                "
              >

                <p
                  className="
                    text-[9px]
                    text-white/50
                  "
                >
                  Deliver to
                </p>


                <p
                  className="
                    max-w-[100px]
                    truncate
                    text-[11px]
                    font-bold
                  "
                >

                  {deliveryLocation
                    ? `PIN ${deliveryLocation}`
                    : "Select Location"}

                </p>

              </div>

            </motion.button>


            {/* =================================
                SEARCH
            ================================= */}

            <motion.button

              whileHover={{
                scale: 1.15,
              }}

              whileTap={{
                scale: 0.9,
              }}

              aria-label="Search"

              className="
                hidden
                sm:block
              "
            >

              <Search
                size={20}
              />

            </motion.button>


            {/* =================================
                CUSTOMER LOGIN / PROFILE
            ================================= */}

            <div
              className="
                relative
              "
            >

              <motion.button

                whileHover={{
                  scale: 1.08,
                }}

                whileTap={{
                  scale: 0.94,
                }}

                onClick={
                  handleLoginClick
                }

                aria-label={
                  user
                    ? "Customer profile"
                    : "Login"
                }

                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {/* =============================
                    LOGGED-IN CUSTOMER
                ============================= */}

                {user ? (

                  <>

                    {user.avatar ? (

                      <img
                        src={
                          user.avatar
                        }
                        alt={
                          user.name ||
                          "Customer"
                        }
                        referrerPolicy="no-referrer"
                        className="
                          h-9
                          w-9
                          rounded-full
                          border-2
                          border-white/30
                          object-cover
                          shadow-md
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/20
                          bg-white/10
                        "
                      >

                        <UserRound
                          size={19}
                        />

                      </div>

                    )}


                    {/* NAME ON LARGE SCREEN */}

                    <div
                      className="
                        hidden
                        text-left
                        xl:block
                      "
                    >

                      <p
                        className="
                          text-[8px]
                          text-white/50
                        "
                      >
                        Welcome
                      </p>

                      <p
                        className="
                          max-w-[90px]
                          truncate
                          text-[11px]
                          font-bold
                        "
                      >
                        {user.name ||
                          "Customer"}
                      </p>

                    </div>


                    <ChevronDown
                      size={14}
                      className={`
                        hidden
                        transition-transform
                        xl:block
                        ${
                          profileOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />

                  </>

                ) : (

                  <UserRound
                    size={20}
                  />

                )}

              </motion.button>


              {/* =================================
                  CUSTOMER PROFILE DROPDOWN
              ================================= */}

              <AnimatePresence>

                {user &&
                  profileOpen && (

                  <>

                    {/* INVISIBLE CLICK AREA */}

                    <div
                      className="
                        fixed
                        inset-0
                        z-[95]
                      "
                      onClick={() =>
                        setProfileOpen(
                          false
                        )
                      }
                    />


                    <motion.div

                      initial={{
                        opacity: 0,
                        y: -10,
                        scale: 0.96,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}

                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.96,
                      }}

                      transition={{
                        duration: 0.18,
                      }}

                      className="
                        absolute
                        right-0
                        top-[52px]
                        z-[100]
                        w-[290px]
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-white/30
                        bg-[#fffaf8]
                        text-[#542432]
                        shadow-[0_25px_70px_rgba(0,0,0,0.28)]
                      "
                    >

                      {/* =========================
                          PROFILE HEADER
                      ========================= */}

                      <div
                        className="
                          bg-[#542432]
                          p-5
                          text-white
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          {user.avatar ? (

                            <img
                              src={
                                user.avatar
                              }
                              alt={
                                user.name ||
                                "Customer"
                              }
                              referrerPolicy="no-referrer"
                              className="
                                h-12
                                w-12
                                shrink-0
                                rounded-full
                                border-2
                                border-white/30
                                object-cover
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-pink-500
                              "
                            >

                              <UserRound
                                size={22}
                              />

                            </div>

                          )}


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                text-[9px]
                                uppercase
                                tracking-[0.18em]
                                text-pink-200
                              "
                            >
                              Welcome back
                            </p>


                            <p
                              className="
                                mt-1
                                truncate
                                font-serif
                                text-lg
                                font-bold
                              "
                            >
                              {user.name ||
                                "Customer"}
                            </p>


                            {user.email && (

                              <p
                                className="
                                  mt-0.5
                                  truncate
                                  text-[10px]
                                  text-white/55
                                "
                              >
                                {user.email}
                              </p>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* =========================
                          PROFILE LINKS
                      ========================= */}

                      <div
                        className="
                          p-3
                        "
                      >

                        <ProfileMenuItem
                          icon={
                            <User
                              size={17}
                            />
                          }
                          label="My Account"
                          description="Profile & personal details"
                          onClick={() =>
                            handleProfileNavigation(
                              "/account"
                            )
                          }
                        />


                        <ProfileMenuItem
                          icon={
                            <Package
                              size={17}
                            />
                          }
                          label="My Orders"
                          description="View current & previous orders"
                          onClick={() =>
                            handleProfileNavigation(
                              "/my-orders"
                            )
                          }
                        />


                        <ProfileMenuItem
                          icon={
                            <MapPinned
                              size={17}
                            />
                          }
                          label="Track Order"
                          description="Follow your cake delivery"
                          onClick={() =>
                            handleProfileNavigation(
                              "/my-orders"
                            )
                          }
                        />


                        <ProfileMenuItem
                          icon={
                            <Heart
                              size={17}
                            />
                          }
                          label="Wishlist"
                          description="Your favourite cakes"
                          onClick={() =>
                            handleProfileNavigation(
                              "/wishlist"
                            )
                          }
                        />


                        {/* DIVIDER */}

                        <div
                          className="
                            my-2
                            h-px
                            bg-[#542432]/10
                          "
                        />


                        {/* LOGOUT */}

                        <motion.button

                          whileHover={{
                            x: 3,
                          }}

                          whileTap={{
                            scale: 0.98,
                          }}

                          onClick={
                            handleLogout
                          }

                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-2xl
                            px-3
                            py-3
                            text-left
                            text-red-500
                            transition
                            hover:bg-red-50
                          "
                        >

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-red-50
                            "
                          >

                            <LogOut
                              size={17}
                            />

                          </div>


                          <div>

                            <p
                              className="
                                text-sm
                                font-bold
                              "
                            >
                              Logout
                            </p>


                            <p
                              className="
                                text-[10px]
                                text-red-400
                              "
                            >
                              Sign out of your account
                            </p>

                          </div>

                        </motion.button>

                      </div>

                    </motion.div>

                  </>

                )}

              </AnimatePresence>

            </div>


            {/* =================================
                CART
            ================================= */}

            <motion.button

              whileHover={{
                scale: 1.15,
              }}

              whileTap={{
                scale: 0.9,
              }}

              onClick={() =>
                dispatch(
                  openCart()
                )
              }

              className="
                relative
              "

              aria-label="Open cart"
            >

              <ShoppingBag
                size={21}
              />


              {/* CART COUNT */}

              {cartCount > 0 && (

                <motion.span

                  key={
                    cartCount
                  }

                  initial={{
                    scale: 0,
                  }}

                  animate={{
                    scale: 1,
                  }}

                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-pink-500
                    px-1
                    text-[9px]
                    font-bold
                    text-white
                    shadow-lg
                  "
                >

                  {cartCount}

                </motion.span>

              )}

            </motion.button>


            {/* =================================
                MOBILE MENU BUTTON
            ================================= */}

            <motion.button

              whileTap={{
                scale: 0.9,
              }}

              onClick={() =>
                setMobileMenuOpen(
                  true
                )
              }

              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/10
                lg:hidden
              "

              aria-label="Open menu"
            >

              <Menu
                size={21}
              />

            </motion.button>

          </div>

        </nav>

      </motion.header>


      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <AnimatePresence>

        {mobileMenuOpen && (

          <>

            {/* BACKDROP */}

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
                closeMobileMenu
              }

              className="
                fixed
                inset-0
                z-[80]
                bg-black/60
                backdrop-blur-sm
                lg:hidden
              "
            />


            {/* MENU DRAWER */}

            <motion.div

              initial={{
                x: "100%",
              }}

              animate={{
                x: 0,
              }}

              exit={{
                x: "100%",
              }}

              transition={{
                type:
                  "spring",
                stiffness:
                  250,
                damping:
                  28,
              }}

              className="
                fixed
                right-0
                top-0
                z-[90]
                flex
                h-full
                w-[88%]
                max-w-[380px]
                flex-col
                overflow-y-auto
                bg-[#2b1219]
                p-6
                text-white
                shadow-2xl
                lg:hidden
              "
            >

              {/* =================================
                  MOBILE HEADER
              ================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
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
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-white/10
                    "
                  >

                    <CakeSlice
                      size={19}
                      className="
                        text-pink-200
                      "
                    />

                  </div>


                  <div>

                    <h2
                      className="
                        font-serif
                        text-xl
                        font-bold
                        italic
                      "
                    >
                      Tempting Bites
                    </h2>


                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/40
                      "
                    >
                      Baked with love
                    </p>

                  </div>

                </div>


                <motion.button

                  whileTap={{
                    scale: 0.9,
                  }}

                  onClick={
                    closeMobileMenu
                  }

                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                  "
                >

                  <X
                    size={20}
                  />

                </motion.button>

              </div>


              {/* =================================
                  MOBILE CUSTOMER PROFILE
              ================================= */}

              {user && (

                <div
                  className="
                    mt-7
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    {user.avatar ? (

                      <img
                        src={
                          user.avatar
                        }
                        alt={
                          user.name ||
                          "Customer"
                        }
                        referrerPolicy="no-referrer"
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-full
                          border-2
                          border-white/20
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-pink-500
                        "
                      >

                        <UserRound
                          size={21}
                        />

                      </div>

                    )}


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-pink-200
                        "
                      >
                        Signed in as
                      </p>


                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          font-bold
                        "
                      >
                        {user.name ||
                          "Customer"}
                      </p>


                      {user.email && (

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-white/40
                          "
                        >
                          {user.email}
                        </p>

                      )}

                    </div>

                  </div>


                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleProfileNavigation(
                          "/my-orders"
                        )
                      }
                      className="
                        rounded-xl
                        bg-white/5
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        transition
                        hover:bg-white/10
                      "
                    >
                      My Orders
                    </button>


                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        rounded-xl
                        bg-red-500/10
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-red-300
                        transition
                        hover:bg-red-500/20
                      "
                    >
                      Logout
                    </button>

                  </div>

                </div>

              )}


              {/* =================================
                  MOBILE LINKS
              ================================= */}

              <div
                className="
                  mt-8
                  flex
                  flex-col
                  gap-2
                "
              >

                <MobileLink
                  icon={
                    <Home
                      size={18}
                    />
                  }
                  label="Home"
                  onClick={() => {
                    navigate("/");
                    closeMobileMenu();
                  }}
                />


                <MobileLink
                  icon={
                    <CakeSlice
                      size={18}
                    />
                  }
                  label="Explore Cakes"
                  onClick={() => {
                    navigate(
                      "/cakes"
                    );
                    closeMobileMenu();
                  }}
                />


                <MobileLink
                  icon={
                    <SparkIcon />
                  }
                  label="Custom Cakes"
                  onClick={() => {
                    navigate(
                      "/cakes"
                    );
                    closeMobileMenu();
                  }}
                />


                {/* CUSTOMER LINKS */}

                {user && (

                  <>

                    <MobileLink
                      icon={
                        <Package
                          size={18}
                        />
                      }
                      label="My Orders"
                      onClick={() =>
                        handleProfileNavigation(
                          "/my-orders"
                        )
                      }
                    />


                    <MobileLink
                      icon={
                        <Heart
                          size={18}
                        />
                      }
                      label="Wishlist"
                      onClick={() =>
                        handleProfileNavigation(
                          "/wishlist"
                        )
                      }
                    />

                  </>

                )}


                <MobileLink
                  icon={
                    <GraduationCap
                      size={18}
                    />
                  }
                  label="Learn Baking & Career"
                  onClick={() =>
                    scrollToSection(
                      "careers"
                    )
                  }
                />


                <MobileLink
                  icon={
                    <span
                      className="
                        text-lg
                      "
                    >
                      ★
                    </span>
                  }
                  label="Customer Reviews"
                  onClick={() =>
                    scrollToSection(
                      "reviews"
                    )
                  }
                />

              </div>


              {/* =================================
                  MOBILE LOGIN
              ================================= */}

              {!user && (

                <motion.button

                  whileTap={{
                    scale: 0.98,
                  }}

                  onClick={() => {

                    closeMobileMenu();

                    setAuthOpen(
                      true
                    );

                  }}

                  className="
                    mt-7
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-pink-500
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                  "
                >

                  <UserRound
                    size={18}
                  />

                  Sign In

                </motion.button>

              )}


              {/* =================================
                  MOBILE DELIVERY
              ================================= */}

              <button

                type="button"

                onClick={() => {

                  closeMobileMenu();

                  setLocationOpen(
                    true
                  );

                }}

                className="
                  mt-8
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  text-left
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
                    rounded-full
                    bg-pink-200
                    text-[#542432]
                  "
                >

                  <MapPin
                    size={18}
                  />

                </div>


                <div>

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-wider
                      text-white/40
                    "
                  >
                    Delivery Area
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      font-bold
                    "
                  >
                    Panvel • India Bulls
                  </p>


                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-pink-200
                    "
                  >
                    PIN 410206
                  </p>

                </div>

              </button>


              {/* =================================
                  MOBILE BOTTOM
              ================================= */}

              <div
                className="
                  mt-auto
                  border-t
                  border-white/10
                  pt-6
                "
              >

                <p
                  className="
                    text-xs
                    leading-6
                    text-white/40
                  "
                >
                  Handcrafted cakes made
                  with love for your
                  sweetest celebrations.
                </p>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>


      {/* =====================================
          AUTH MODAL
      ===================================== */}

      <AuthModal
        isOpen={
          authOpen
        }
        onClose={() =>
          setAuthOpen(
            false
          )
        }
      />


      {/* =====================================
          LOCATION MODAL
      ===================================== */}

      <LocationModal
        isOpen={
          locationOpen
        }
        onClose={() =>
          setLocationOpen(
            false
          )
        }
        onLocationSelect={
          handleLocationSelect
        }
      />

    </>
  );
}


/* =========================================
   PROFILE MENU ITEM
========================================= */

function ProfileMenuItem({
  icon,
  label,
  description,
  onClick,
}) {

  return (

    <motion.button

      type="button"

      whileHover={{
        x: 3,
      }}

      whileTap={{
        scale: 0.98,
      }}

      onClick={
        onClick
      }

      className="
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        px-3
        py-3
        text-left
        transition
        hover:bg-[#542432]/5
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
          bg-pink-50
          text-pink-500
        "
      >

        {icon}

      </div>


      <div
        className="
          min-w-0
        "
      >

        <p
          className="
            text-sm
            font-bold
            text-[#542432]
          "
        >
          {label}
        </p>


        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            text-gray-400
          "
        >
          {description}
        </p>

      </div>

    </motion.button>

  );

}


/* =========================================
   DESKTOP NAV ITEM
========================================= */

function NavItem({
  to,
  label,
}) {

  return (

    <motion.div

      whileHover={{
        y: -3,
      }}

    >

      <Link

        to={to}

        className="
          text-sm
          font-medium
          text-white/90
          transition
          hover:text-pink-200
        "
      >

        {label}

      </Link>

    </motion.div>

  );

}


/* =========================================
   MOBILE LINK
========================================= */

function MobileLink({
  icon,
  label,
  onClick,
}) {

  return (

    <motion.button

      type="button"

      whileTap={{
        scale: 0.98,
      }}

      onClick={
        onClick
      }

      className="
        flex
        w-full
        items-center
        gap-4
        rounded-2xl
        px-4
        py-4
        text-left
        transition
        hover:bg-white/5
      "
    >

      <span
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/5
          text-pink-200
        "
      >

        {icon}

      </span>


      <span
        className="
          text-sm
          font-semibold
        "
      >

        {label}

      </span>

    </motion.button>

  );

}


/* =========================================
   CUSTOM CAKE SMALL ICON
========================================= */

function SparkIcon() {

  return (

    <span
      className="
        text-lg
      "
    >
      ✦
    </span>

  );

}


export default Navbar;