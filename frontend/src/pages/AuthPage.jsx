import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
  Smartphone,
  Sparkles,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================
     CHANGE LOGIN / REGISTER MODE
  ========================================= */

  const changeMode = (newMode) => {
    setMode(newMode);

    setError("");

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    if (mode === "register") {
      if (!formData.name.trim()) {
        return "Please enter your full name.";
      }

      if (!formData.phone.trim()) {
        return "Please enter your mobile number.";
      }

      if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
        return "Please enter a valid 10-digit mobile number.";
      }
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!formData.password) {
      return "Please enter your password.";
    }

    if (formData.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (
      mode === "register" &&
      formData.password !== formData.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =========================================
     SUBMIT EMAIL AUTHENTICATION
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;

      if (mode === "login") {
        response = await api.post(
          "/auth/login",
          {
            email: formData.email.trim(),
            password: formData.password,
          }
        );
      } else {
        response = await api.post(
          "/auth/register",
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
          }
        );
      }

      const {
        token,
        user,
      } = response.data;

      /*
        Saves customer login into AuthContext.
      */

      login(user, token);

      navigate("/");

    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     GOOGLE
  ========================================= */

  const handleGoogleLogin = () => {
    /*
      We'll connect Firebase Google Authentication
      in the next phase.
    */

    setError(
      "Google Sign-In setup is coming next."
    );
  };

  /* =========================================
     MOBILE OTP
  ========================================= */

  const handleMobileLogin = () => {
    /*
      We'll connect Firebase Phone Authentication
      after Google authentication.
    */

    setError(
      "Mobile OTP login setup is coming next."
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f5]">

      {/* =====================================
          BACKGROUND DECORATION
      ===================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-pink-200/40 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-orange-100/70 blur-[120px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#542432]/5 blur-[100px]" />


      {/* =====================================
          BACK BUTTON
      ===================================== */}

      <motion.button
        type="button"
        whileHover={{
          x: -4,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-xs font-bold text-[#542432] shadow-sm backdrop-blur-xl sm:left-8 sm:top-8"
      >
        <ArrowLeft size={16} />

        Home
      </motion.button>


      {/* =====================================
          PAGE
      ===================================== */}

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">

        {/* =================================
            BRAND SIDE
        ================================= */}

        <motion.section
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="hidden lg:block"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-[#542432]/10 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">

            <Sparkles
              size={14}
              className="text-pink-500"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8d6974]">
              Tempting Bites
            </span>

          </div>


          <h1 className="mt-7 max-w-xl font-serif text-6xl font-bold leading-[1.03] tracking-[-0.03em] text-[#542432]">

            Your sweetest

            <span className="block italic text-pink-500">
              moments begin here.
            </span>

          </h1>


          <p className="mt-6 max-w-lg text-base leading-8 text-gray-500">

            Sign in to discover handcrafted cakes,
            save your favourites, manage your orders
            and follow every celebration from our
            kitchen to your doorstep.

          </p>


          {/* FEATURES */}

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">

            <div className="rounded-3xl border border-white bg-white/60 p-5 shadow-sm backdrop-blur-xl">

              <p className="font-serif text-xl font-bold text-[#542432]">
                My Orders
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                View current and previous cake orders.
              </p>

            </div>


            <div className="rounded-3xl border border-white bg-white/60 p-5 shadow-sm backdrop-blur-xl">

              <p className="font-serif text-xl font-bold text-[#542432]">
                Live Tracking
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Follow your cake from baking to delivery.
              </p>

            </div>

          </div>

        </motion.section>


        {/* =================================
            AUTH CARD
        ================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto w-full max-w-[520px]"
        >

          <div className="rounded-[2.2rem] border border-white/80 bg-white/85 p-5 shadow-[0_30px_90px_rgba(84,36,50,0.12)] backdrop-blur-2xl sm:p-8">

            {/* MOBILE LOGO */}

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#542432] shadow-lg shadow-[#542432]/15">

                <span className="font-serif text-2xl font-bold text-white">
                  TB
                </span>

              </div>


              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-500">
                Tempting Bites
              </p>


              <AnimatePresence mode="wait">

                <motion.div
                  key={mode}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                >

                  <h2 className="mt-2 font-serif text-3xl font-bold text-[#542432] sm:text-4xl">

                    {mode === "login"
                      ? "Welcome Back"
                      : "Create Account"}

                  </h2>


                  <p className="mt-2 text-sm text-gray-400">

                    {mode === "login"
                      ? "Sign in and continue your sweet journey."
                      : "Join us and make every celebration sweeter."}

                  </p>

                </motion.div>

              </AnimatePresence>

            </div>


            {/* =================================
                LOGIN / REGISTER SWITCH
            ================================= */}

            <div className="relative mt-7 grid grid-cols-2 rounded-full bg-[#fff5f6] p-1.5">

              <motion.div
                layout
                className={`absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-[#542432] shadow-md ${
                  mode === "login"
                    ? "left-1.5"
                    : "left-[50%]"
                }`}
              />


              <button
                type="button"
                onClick={() =>
                  changeMode("login")
                }
                className={`relative z-10 rounded-full py-3 text-xs font-bold transition ${
                  mode === "login"
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                Sign In
              </button>


              <button
                type="button"
                onClick={() =>
                  changeMode("register")
                }
                className={`relative z-10 rounded-full py-3 text-xs font-bold transition ${
                  mode === "register"
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                Create Account
              </button>

            </div>


            {/* =================================
                SOCIAL LOGIN
            ================================= */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  handleGoogleLogin
                }
                className="flex min-h-[52px] items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 text-sm font-bold text-[#542432] shadow-sm transition hover:shadow-md"
              >

                {/* GOOGLE G */}

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 font-bold text-[#4285F4]">
                  G
                </span>

                Google

              </motion.button>


              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  handleMobileLogin
                }
                className="flex min-h-[52px] items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 text-sm font-bold text-[#542432] shadow-sm transition hover:shadow-md"
              >

                <Smartphone
                  size={18}
                  className="text-pink-500"
                />

                Mobile OTP

              </motion.button>

            </div>


            {/* DIVIDER */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-100" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                or continue with email
              </span>

              <div className="h-px flex-1 bg-gray-100" />

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <AnimatePresence initial={false}>

                {mode ===
                  "register" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden"
                  >

                    {/* NAME */}

                    <div className="mb-4">

                      <label className="mb-2 block text-xs font-bold text-[#542432]">
                        Full Name
                      </label>

                      <div className="relative">

                        <User
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />

                        <input
                          type="text"
                          name="name"
                          value={
                            formData.name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Your full name"
                          autoComplete="name"
                          className="w-full rounded-2xl border border-gray-100 bg-[#fffafa] py-4 pl-11 pr-4 text-sm text-[#542432] outline-none transition focus:border-pink-300 focus:bg-white"
                        />

                      </div>

                    </div>


                    {/* PHONE */}

                    <div className="mb-4">

                      <label className="mb-2 block text-xs font-bold text-[#542432]">
                        Mobile Number
                      </label>

                      <div className="relative">

                        <Phone
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={
                            formData.phone
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel"
                          className="w-full rounded-2xl border border-gray-100 bg-[#fffafa] py-4 pl-11 pr-4 text-sm text-[#542432] outline-none transition focus:border-pink-300 focus:bg-white"
                        />

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>


              {/* EMAIL */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-bold text-[#542432]">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-gray-100 bg-[#fffafa] py-4 pl-11 pr-4 text-sm text-[#542432] outline-none transition focus:border-pink-300 focus:bg-white"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="mb-4">

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-xs font-bold text-[#542432]">
                    Password
                  </label>


                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-[11px] font-bold text-pink-500"
                    >
                      Forgot Password?
                    </button>
                  )}

                </div>


                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Minimum 6 characters"
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    className="w-full rounded-2xl border border-gray-100 bg-[#fffafa] py-4 pl-11 pr-12 text-sm text-[#542432] outline-none transition focus:border-pink-300 focus:bg-white"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition hover:text-[#542432]"
                  >

                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <AnimatePresence initial={false}>

                {mode ===
                  "register" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden"
                  >

                    <div className="mb-4">

                      <label className="mb-2 block text-xs font-bold text-[#542432]">
                        Confirm Password
                      </label>


                      <div className="relative">

                        <LockKeyhole
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />


                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={
                            formData.confirmPassword
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Enter password again"
                          autoComplete="new-password"
                          className="w-full rounded-2xl border border-gray-100 bg-[#fffafa] py-4 pl-11 pr-12 text-sm text-[#542432] outline-none transition focus:border-pink-300 focus:bg-white"
                        />


                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                        >

                          {showConfirmPassword ? (
                            <EyeOff
                              size={18}
                            />
                          ) : (
                            <Eye
                              size={18}
                            />
                          )}

                        </button>

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>


              {/* =================================
                  ERROR
              ================================= */}

              <AnimatePresence>

                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-500"
                  >
                    {error}
                  </motion.div>
                )}

              </AnimatePresence>


              {/* =================================
                  SUBMIT
              ================================= */}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  !loading
                    ? {
                        scale: 1.015,
                      }
                    : {}
                }
                whileTap={
                  !loading
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
                className="flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#542432] px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(84,36,50,0.2)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <span className="flex items-center gap-3">

                    <motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />

                    Please wait...

                  </span>

                ) : mode ===
                  "login" ? (

                  "Sign In"

                ) : (

                  "Create My Account"

                )}

              </motion.button>

            </form>


            {/* BOTTOM SWITCH */}

            <p className="mt-6 text-center text-xs text-gray-400">

              {mode === "login"
                ? "New to Tempting Bites?"
                : "Already have an account?"}


              <button
                type="button"
                onClick={() =>
                  changeMode(
                    mode === "login"
                      ? "register"
                      : "login"
                  )
                }
                className="ml-2 font-bold text-pink-500"
              >

                {mode === "login"
                  ? "Create Account"
                  : "Sign In"}

              </button>

            </p>

          </div>

        </motion.section>

      </div>

    </main>
  );
}

export default AuthPage;