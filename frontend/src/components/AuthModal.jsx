import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../config/firebase";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


function AuthModal({
  isOpen,
  onClose,
}) {

  /* =========================================
     AUTH CONTEXT
  ========================================= */

  const {
    login,
  } = useAuth();


  /* =========================================
     STATE
  ========================================= */

  const [
    step,
    setStep,
  ] = useState("login");


  const [
    phone,
    setPhone,
  ] = useState("");


  const [
    otp,
    setOtp,
  ] = useState("");


  const [
    confirmationResult,
    setConfirmationResult,
  ] = useState(null);


  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);


  const [
    otpLoading,
    setOtpLoading,
  ] = useState(false);


  const [
    resendLoading,
    setResendLoading,
  ] = useState(false);


  const [
    authError,
    setAuthError,
  ] = useState("");


  const [
    authMessage,
    setAuthMessage,
  ] = useState("");


  const [
    resendTimer,
    setResendTimer,
  ] = useState(0);


  /*
    Keep the verifier in a ref rather
    than depending only on window.
  */

  const recaptchaVerifierRef =
    useRef(null);


  /* =========================================
     RESEND TIMER
  ========================================= */

  useEffect(() => {

    if (
      resendTimer <= 0
    ) {
      return;
    }


    const timer =
      setInterval(() => {

        setResendTimer(
          (previous) => {

            if (
              previous <= 1
            ) {

              clearInterval(
                timer
              );

              return 0;

            }


            return (
              previous - 1
            );

          }
        );

      }, 1000);


    return () => {

      clearInterval(
        timer
      );

    };

  }, [
    resendTimer,
  ]);


  /* =========================================
     CLEANUP RECAPTCHA
  ========================================= */

  const clearRecaptcha = () => {

    try {

      if (
        recaptchaVerifierRef.current
      ) {

        recaptchaVerifierRef.current.clear();

      }

    } catch (error) {

      console.warn(
        "reCAPTCHA cleanup:",
        error
      );

    }


    recaptchaVerifierRef.current =
      null;


    if (
      window.recaptchaVerifier
    ) {

      try {

        window.recaptchaVerifier.clear();

      } catch {
        // Already cleared.
      }


      window.recaptchaVerifier =
        null;

    }


    /*
      Firebase can leave reCAPTCHA
      elements behind after retries.
    */

    const container =
      document.getElementById(
        "recaptcha-container"
      );


    if (container) {

      container.innerHTML =
        "";

    }

  };


  /* =========================================
     CLEAN UP WHEN COMPONENT UNMOUNTS
  ========================================= */

  useEffect(() => {

    return () => {

      clearRecaptcha();

    };

  }, []);


  /* =========================================
     SETUP FIREBASE RECAPTCHA
  ========================================= */

  const setupRecaptcha =
    () => {

      clearRecaptcha();


      const verifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {

            size:
              "invisible",


            callback: () => {

              console.log(
                "Firebase reCAPTCHA verified."
              );

            },


            "expired-callback":
              () => {

                setAuthError(
                  "Security verification expired. Please try again."
                );

                clearRecaptcha();

              },

          }
        );


      recaptchaVerifierRef.current =
        verifier;


      window.recaptchaVerifier =
        verifier;


      return verifier;

    };


  /* =========================================
     COMPLETE TEMPTING BITES LOGIN

     Used by BOTH:
     - Google
     - Phone OTP
  ========================================= */

  const completeBackendLogin =
    async (
      firebaseUser
    ) => {

      /* =====================================
         GET FIREBASE ID TOKEN
      ===================================== */

      const idToken =
        await firebaseUser.getIdToken();


      /* =====================================
         SEND TOKEN TO BACKEND
      ===================================== */

      const response =
        await api.post(
          "/auth/firebase",
          {
            idToken,
          }
        );


      /* =====================================
         GET CUSTOMER + JWT
      ===================================== */

      const {
        user,
        token,
      } = response.data;


      if (
        !user ||
        !token
      ) {

        throw new Error(
          "Invalid authentication response."
        );

      }


      /* =====================================
         SAVE LOGIN TO AUTH CONTEXT
      ===================================== */

      login(
        user,
        token
      );


      return user;

    };


  /* =========================================
     GOOGLE SIGN IN
  ========================================= */

  const handleGoogleLogin =
    async () => {

      try {

        setGoogleLoading(
          true
        );

        setAuthError("");

        setAuthMessage("");


        /* =====================================
           GOOGLE LOGIN THROUGH FIREBASE
        ===================================== */

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );


        /* =====================================
           COMPLETE BACKEND LOGIN
        ===================================== */

        const customer =
          await completeBackendLogin(
            result.user
          );


        console.log(
          "Google customer:",
          customer
        );


        /* =====================================
           CLOSE MODAL
        ===================================== */

        handleClose();

      } catch (error) {

        console.error(
          "Google login error:",
          error
        );


        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {

          setAuthError(
            "Google sign-in was cancelled."
          );

        } else if (
          error.code ===
          "auth/popup-blocked"
        ) {

          setAuthError(
            "Your browser blocked the Google sign-in popup."
          );

        } else if (
          error.code ===
          "auth/unauthorized-domain"
        ) {

          setAuthError(
            "This website is not authorized for Google Sign-In."
          );

        } else if (
          error.code ===
          "auth/network-request-failed"
        ) {

          setAuthError(
            "Network error. Please check your internet connection."
          );

        } else if (
          error.response?.data?.message
        ) {

          setAuthError(
            error.response.data.message
          );

        } else {

          setAuthError(
            "Unable to sign in with Google. Please try again."
          );

        }

      } finally {

        setGoogleLoading(
          false
        );

      }

    };


  /* =========================================
     SEND PHONE OTP
  ========================================= */

  const handleContinue =
    async () => {

      try {

        setAuthError("");

        setAuthMessage("");


        /* =====================================
           VALIDATE MOBILE NUMBER
        ===================================== */

        if (
          phone.length !==
          10
        ) {

          setAuthError(
            "Please enter a valid 10-digit mobile number."
          );

          return;

        }


        setOtpLoading(
          true
        );


        /* =====================================
           INDIAN PHONE NUMBER
        ===================================== */

        const phoneNumber =
          `+91${phone}`;


        /* =====================================
           SETUP RECAPTCHA
        ===================================== */

        const appVerifier =
          setupRecaptcha();


        /*
          Explicitly render the verifier
          before requesting the SMS.
        */

        await appVerifier.render();


        /* =====================================
           SEND REAL FIREBASE SMS OTP
        ===================================== */

        const result =
          await signInWithPhoneNumber(
            auth,
            phoneNumber,
            appVerifier
          );


        /* =====================================
           SAVE CONFIRMATION SESSION
        ===================================== */

        setConfirmationResult(
          result
        );


        /* =====================================
           CLEAR OTP FIELD
        ===================================== */

        setOtp("");


        /* =====================================
           START RESEND TIMER
        ===================================== */

        setResendTimer(
          30
        );


        /* =====================================
           SHOW OTP SCREEN
        ===================================== */

        setStep(
          "otp"
        );


        setAuthMessage(
          `OTP sent successfully to +91 ${phone}.`
        );


        console.log(
          "Firebase OTP sent successfully."
        );

      } catch (error) {

        console.error(
          "Send OTP error:",
          error
        );


        if (
          error.code ===
          "auth/invalid-phone-number"
        ) {

          setAuthError(
            "Please enter a valid mobile number."
          );

        } else if (
          error.code ===
          "auth/too-many-requests"
        ) {

          setAuthError(
            "Too many OTP requests. Please wait before trying again."
          );

        } else if (
          error.code ===
          "auth/quota-exceeded"
        ) {

          setAuthError(
            "The SMS verification limit has been reached. Please try again later."
          );

        } else if (
          error.code ===
          "auth/captcha-check-failed"
        ) {

          setAuthError(
            "Security verification failed. Please try again."
          );

        } else if (
          error.code ===
          "auth/missing-phone-number"
        ) {

          setAuthError(
            "Please enter your mobile number."
          );

        } else if (
          error.code ===
          "auth/network-request-failed"
        ) {

          setAuthError(
            "Network error. Please check your internet connection."
          );

        } else if (
          error.code ===
          "auth/operation-not-allowed"
        ) {

          setAuthError(
            "Phone authentication is not enabled in Firebase."
          );

        } else {

          setAuthError(
            error.message ||
            "Unable to send OTP. Please try again."
          );

        }


        clearRecaptcha();

      } finally {

        setOtpLoading(
          false
        );

      }

    };


  /* =========================================
     VERIFY PHONE OTP
  ========================================= */

  const handleVerify =
    async () => {

      try {

        setAuthError("");

        setAuthMessage("");


        /* =====================================
           OTP VALIDATION
        ===================================== */

        if (
          otp.length !==
          6
        ) {

          setAuthError(
            "Please enter the complete 6-digit OTP."
          );

          return;

        }


        /* =====================================
           CHECK OTP SESSION
        ===================================== */

        if (
          !confirmationResult
        ) {

          setAuthError(
            "Your OTP session has expired. Please request a new OTP."
          );

          return;

        }


        setOtpLoading(
          true
        );


        /* =====================================
           VERIFY REAL OTP WITH FIREBASE
        ===================================== */

        const result =
          await confirmationResult.confirm(
            otp
          );


        /* =====================================
           FIREBASE USER
        ===================================== */

        const firebaseUser =
          result.user;


        /* =====================================
           BACKEND + MONGODB + JWT LOGIN
        ===================================== */

        const customer =
          await completeBackendLogin(
            firebaseUser
          );


        console.log(
          "Phone customer:",
          customer
        );


        /* =====================================
           CLEAN RECAPTCHA
        ===================================== */

        clearRecaptcha();


        /* =====================================
           CLOSE MODAL
        ===================================== */

        handleClose();

      } catch (error) {

        console.error(
          "OTP verification error:",
          error
        );


        if (
          error.code ===
          "auth/invalid-verification-code"
        ) {

          setAuthError(
            "Incorrect OTP. Please check the code and try again."
          );

        } else if (
          error.code ===
          "auth/code-expired"
        ) {

          setAuthError(
            "This OTP has expired. Please request a new OTP."
          );

        } else if (
          error.code ===
          "auth/session-expired"
        ) {

          setAuthError(
            "Your OTP session has expired. Please request another OTP."
          );

        } else if (
          error.code ===
          "auth/too-many-requests"
        ) {

          setAuthError(
            "Too many verification attempts. Please wait and try again."
          );

        } else if (
          error.response?.data?.message
        ) {

          setAuthError(
            error.response.data.message
          );

        } else {

          setAuthError(
            "Unable to verify OTP. Please try again."
          );

        }

      } finally {

        setOtpLoading(
          false
        );

      }

    };


  /* =========================================
     RESEND OTP
  ========================================= */

  const handleResendOtp =
    async () => {

      /* =====================================
         DON'T RESEND DURING COUNTDOWN
      ===================================== */

      if (
        resendTimer >
        0
      ) {

        return;

      }


      try {

        setResendLoading(
          true
        );

        setAuthError("");

        setAuthMessage("");


        /* =====================================
           VALIDATE NUMBER
        ===================================== */

        if (
          phone.length !==
          10
        ) {

          setAuthError(
            "Please enter a valid mobile number."
          );

          return;

        }


        const phoneNumber =
          `+91${phone}`;


        /* =====================================
           CREATE FRESH RECAPTCHA
        ===================================== */

        const appVerifier =
          setupRecaptcha();


        await appVerifier.render();


        /* =====================================
           SEND NEW OTP
        ===================================== */

        const result =
          await signInWithPhoneNumber(
            auth,
            phoneNumber,
            appVerifier
          );


        /* =====================================
           REPLACE OLD CONFIRMATION SESSION
        ===================================== */

        setConfirmationResult(
          result
        );


        /* =====================================
           CLEAR OLD OTP
        ===================================== */

        setOtp("");


        /* =====================================
           RESTART TIMER
        ===================================== */

        setResendTimer(
          30
        );


        setAuthMessage(
          "A new OTP has been sent to your mobile number."
        );


        console.log(
          "Firebase OTP resent successfully."
        );

      } catch (error) {

        console.error(
          "Resend OTP error:",
          error
        );


        if (
          error.code ===
          "auth/too-many-requests"
        ) {

          setAuthError(
            "Too many OTP requests. Please wait before requesting another code."
          );

        } else if (
          error.code ===
          "auth/quota-exceeded"
        ) {

          setAuthError(
            "The SMS verification limit has been reached. Please try again later."
          );

        } else if (
          error.code ===
          "auth/captcha-check-failed"
        ) {

          setAuthError(
            "Security verification failed. Please try again."
          );

        } else if (
          error.code ===
          "auth/network-request-failed"
        ) {

          setAuthError(
            "Network error. Please check your internet connection."
          );

        } else {

          setAuthError(
            error.message ||
            "Unable to resend OTP. Please try again."
          );

        }


        clearRecaptcha();

      } finally {

        setResendLoading(
          false
        );

      }

    };


  /* =========================================
     CHANGE MOBILE NUMBER
  ========================================= */

  const handleChangeNumber =
    () => {

      clearRecaptcha();


      setStep(
        "login"
      );

      setOtp("");

      setConfirmationResult(
        null
      );

      setResendTimer(
        0
      );

      setAuthError("");

      setAuthMessage("");

    };


  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleClose =
    () => {

      clearRecaptcha();


      setStep(
        "login"
      );

      setPhone("");

      setOtp("");

      setConfirmationResult(
        null
      );

      setGoogleLoading(
        false
      );

      setOtpLoading(
        false
      );

      setResendLoading(
        false
      );

      setResendTimer(
        0
      );

      setAuthError("");

      setAuthMessage("");


      onClose();

    };


  return (
    <AnimatePresence>

      {isOpen && (
        <>

          {/* =================================
              FIREBASE INVISIBLE RECAPTCHA
          ================================= */}

          <div
            id="recaptcha-container"
          />


          {/* =================================
              BACKDROP
          ================================= */}

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
              handleClose
            }

            className="
              fixed
              inset-0
              z-[150]
              bg-black/60
              backdrop-blur-md
            "
          />


          {/* =================================
              AUTH MODAL
          ================================= */}

          <motion.div

            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            transition={{
              type: "spring",
              damping: 25,
              stiffness: 250,
            }}

            className="
              fixed
              left-1/2
              top-1/2
              z-[160]
              w-[92%]
              max-w-md
              -translate-x-1/2
              -translate-y-1/2
              overflow-hidden
              rounded-[2.5rem]
              bg-[#fffaf8]
              shadow-2xl
            "
          >

            {/* =================================
                TOP DESIGN
            ================================= */}

            <div
              className="
                relative
                overflow-hidden
                bg-[#542432]
                px-8
                pb-12
                pt-10
                text-white
              "
            >

              {/* DECORATIVE GLOW */}

              <motion.div

                animate={{
                  scale: [
                    1,
                    1.15,
                    1,
                  ],

                  x: [
                    0,
                    20,
                    0,
                  ],
                }}

                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}

                className="
                  absolute
                  -right-16
                  -top-16
                  h-52
                  w-52
                  rounded-full
                  bg-pink-400/20
                  blur-2xl
                "
              />


              {/* CLOSE */}

              <motion.button

                type="button"

                whileHover={{
                  rotate: 90,
                }}

                whileTap={{
                  scale: 0.9,
                }}

                onClick={
                  handleClose
                }

                aria-label="Close sign in"

                className="
                  absolute
                  right-6
                  top-6
                  z-10
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  backdrop-blur-md
                "
              >

                <X
                  size={19}
                />

              </motion.button>


              {/* TB LOGO */}

              <motion.div

                animate={{
                  y: [
                    0,
                    -5,
                    0,
                  ],
                }}

                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}

                className="
                  mb-6
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-pink-500
                  font-serif
                  text-xl
                  font-black
                  shadow-xl
                "
              >

                TB

              </motion.div>


              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-pink-300
                "
              >
                Welcome to
              </p>


              <h2
                className="
                  mt-2
                  font-serif
                  text-4xl
                  font-bold
                "
              >
                Tempting Bites
              </h2>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-white/60
                "
              >
                Sign in to order your
                favourite cakes, track
                deliveries and save your
                sweet picks.
              </p>

            </div>


            {/* =================================
                LOGIN SCREEN
            ================================= */}

            {step ===
              "login" && (

              <motion.div

                key="login"

                initial={{
                  opacity: 0,
                  x: -15,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                className="
                  p-8
                "
              >

                {/* =============================
                    GOOGLE LOGIN
                ============================= */}

                <motion.button

                  type="button"

                  whileHover={
                    !googleLoading
                      ? {
                          scale:
                            1.02,
                        }
                      : {}
                  }

                  whileTap={
                    !googleLoading
                      ? {
                          scale:
                            0.98,
                        }
                      : {}
                  }

                  onClick={
                    handleGoogleLogin
                  }

                  disabled={
                    googleLoading ||
                    otpLoading
                  }

                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    py-4
                    font-bold
                    text-gray-700
                    shadow-sm
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {googleLoading ? (

                    <>

                      <motion.span

                        animate={{
                          rotate:
                            360,
                        }}

                        transition={{
                          duration:
                            0.8,
                          repeat:
                            Infinity,
                          ease:
                            "linear",
                        }}

                        className="
                          h-5
                          w-5
                          rounded-full
                          border-2
                          border-gray-200
                          border-t-[#542432]
                        "
                      />

                      Connecting...

                    </>

                  ) : (

                    <>

                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-200
                          text-sm
                          font-black
                          text-[#4285F4]
                        "
                      >
                        G
                      </span>


                      Continue with Google

                    </>

                  )}

                </motion.button>


                {/* =============================
                    ERROR MESSAGE
                ============================= */}

                <AuthAlert
                  error={
                    authError
                  }
                  message={
                    authMessage
                  }
                />


                {/* =============================
                    DIVIDER
                ============================= */}

                <div
                  className="
                    my-7
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      h-px
                      flex-1
                      bg-gray-200
                    "
                  />


                  <span
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                    "
                  >
                    OR
                  </span>


                  <div
                    className="
                      h-px
                      flex-1
                      bg-gray-200
                    "
                  />

                </div>


                {/* =============================
                    MOBILE NUMBER
                ============================= */}

                <label
                  className="
                    text-sm
                    font-bold
                    text-[#542432]
                  "
                >
                  Mobile Number
                </label>


                <div
                  className="
                    mt-3
                    flex
                    overflow-hidden
                    rounded-2xl
                    border
                    border-pink-100
                    bg-white
                    transition
                    focus-within:border-pink-400
                    focus-within:ring-2
                    focus-within:ring-pink-100
                  "
                >

                  {/* COUNTRY CODE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      border-r
                      border-pink-100
                      px-4
                      text-sm
                      font-bold
                      text-[#542432]
                    "
                  >
                    🇮🇳 +91
                  </div>


                  {/* PHONE INPUT */}

                  <input

                    type="tel"

                    value={
                      phone
                    }

                    maxLength={
                      10
                    }

                    inputMode="numeric"

                    autoComplete="tel"

                    onChange={(e) => {

                      setPhone(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      );

                      setAuthError("");

                      setAuthMessage("");

                    }}

                    onKeyDown={(e) => {

                      if (
                        e.key ===
                          "Enter" &&
                        phone.length ===
                          10 &&
                        !otpLoading
                      ) {

                        handleContinue();

                      }

                    }}

                    placeholder="Enter mobile number"

                    className="
                      w-full
                      px-4
                      py-4
                      text-sm
                      text-[#542432]
                      outline-none
                    "
                  />

                </div>


                {/* =============================
                    SEND OTP BUTTON
                ============================= */}

                <motion.button

                  type="button"

                  whileHover={
                    phone.length ===
                      10 &&
                    !otpLoading
                      ? {
                          scale:
                            1.02,
                        }
                      : {}
                  }

                  whileTap={
                    phone.length ===
                      10 &&
                    !otpLoading
                      ? {
                          scale:
                            0.98,
                        }
                      : {}
                  }

                  onClick={
                    handleContinue
                  }

                  disabled={
                    phone.length !==
                      10 ||
                    otpLoading ||
                    googleLoading
                  }

                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-pink-500
                    py-4
                    font-bold
                    text-white
                    shadow-lg
                    shadow-pink-500/15
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  {otpLoading ? (

                    <>

                      <LoadingSpinner />

                      Sending OTP...

                    </>

                  ) : (

                    <>

                      Continue

                      <ArrowRight
                        size={18}
                      />

                    </>

                  )}

                </motion.button>


                {/* =============================
                    SECURITY
                ============================= */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-center
                    text-xs
                    text-gray-400
                  "
                >

                  <ShieldCheck
                    size={15}
                  />

                  Secure login. Your
                  information stays
                  protected.

                </div>

              </motion.div>

            )}


            {/* =================================
                OTP SCREEN
            ================================= */}

            {step ===
              "otp" && (

              <motion.div

                key="otp"

                initial={{
                  opacity: 0,
                  x: 20,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                className="
                  p-8
                "
              >

                {/* =============================
                    PHONE ICON
                ============================= */}

                <motion.div

                  animate={{
                    y: [
                      0,
                      -3,
                      0,
                    ],
                  }}

                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}

                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-pink-100
                    text-pink-500
                  "
                >

                  <Smartphone
                    size={25}
                  />

                </motion.div>


                {/* =============================
                    TITLE
                ============================= */}

                <h3
                  className="
                    mt-5
                    font-serif
                    text-3xl
                    font-bold
                    text-[#542432]
                  "
                >
                  Verify your number
                </h3>


                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  We've sent a
                  6-digit OTP to{" "}

                  <span
                    className="
                      font-bold
                      text-[#542432]
                    "
                  >
                    +91 {phone}
                  </span>
                </p>


                {/* =============================
                    OTP INPUT
                ============================= */}

                <input

                  type="text"

                  maxLength={
                    6
                  }

                  value={
                    otp
                  }

                  inputMode="numeric"

                  autoComplete="one-time-code"

                  onChange={(e) => {

                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    );

                    setAuthError("");

                    setAuthMessage("");

                  }}

                  onKeyDown={(e) => {

                    if (
                      e.key ===
                        "Enter" &&
                      otp.length ===
                        6 &&
                      !otpLoading
                    ) {

                      handleVerify();

                    }

                  }}

                  placeholder="• • • • • •"

                  className="
                    mt-7
                    w-full
                    rounded-2xl
                    border
                    border-pink-100
                    bg-white
                    px-5
                    py-4
                    text-center
                    text-2xl
                    font-bold
                    tracking-[0.4em]
                    text-[#542432]
                    outline-none
                    transition
                    focus:border-pink-400
                    focus:ring-2
                    focus:ring-pink-100
                  "
                />


                {/* =============================
                    ERROR / SUCCESS MESSAGE
                ============================= */}

                <AuthAlert
                  error={
                    authError
                  }
                  message={
                    authMessage
                  }
                />


                {/* =============================
                    VERIFY BUTTON
                ============================= */}

                <motion.button

                  type="button"

                  whileHover={
                    otp.length ===
                      6 &&
                    !otpLoading
                      ? {
                          scale:
                            1.02,
                        }
                      : {}
                  }

                  whileTap={
                    otp.length ===
                      6 &&
                    !otpLoading
                      ? {
                          scale:
                            0.98,
                        }
                      : {}
                  }

                  onClick={
                    handleVerify
                  }

                  disabled={
                    otp.length !==
                      6 ||
                    otpLoading ||
                    resendLoading
                  }

                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-pink-500
                    py-4
                    font-bold
                    text-white
                    shadow-lg
                    shadow-pink-500/15
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  {otpLoading ? (

                    <>

                      <LoadingSpinner />

                      Verifying...

                    </>

                  ) : (

                    "Verify & Continue"

                  )}

                </motion.button>


                {/* =============================
                    CHANGE NUMBER + RESEND
                ============================= */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-sm
                  "
                >

                  {/* CHANGE NUMBER */}

                  <button

                    type="button"

                    onClick={
                      handleChangeNumber
                    }

                    disabled={
                      otpLoading ||
                      resendLoading
                    }

                    className="
                      font-semibold
                      text-gray-500
                      transition
                      hover:text-[#542432]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Change number
                  </button>


                  {/* RESEND OTP */}

                  <button

                    type="button"

                    onClick={
                      handleResendOtp
                    }

                    disabled={
                      resendTimer >
                        0 ||
                      resendLoading ||
                      otpLoading
                    }

                    className="
                      flex
                      items-center
                      gap-1.5
                      font-bold
                      text-pink-500
                      transition
                      hover:text-pink-600
                      disabled:cursor-not-allowed
                      disabled:text-gray-400
                    "
                  >

                    {resendLoading ? (

                      <>

                        <RefreshCw
                          size={14}
                          className="
                            animate-spin
                          "
                        />

                        Sending...

                      </>

                    ) : resendTimer >
                      0 ? (

                      `Resend in ${resendTimer}s`

                    ) : (

                      <>

                        <RefreshCw
                          size={14}
                        />

                        Resend OTP

                      </>

                    )}

                  </button>

                </div>


                {/* =============================
                    SECURITY MESSAGE
                ============================= */}

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-center
                    text-xs
                    text-gray-400
                  "
                >

                  <ShieldCheck
                    size={15}
                  />

                  OTP verification keeps
                  your account secure.

                </div>

              </motion.div>

            )}

          </motion.div>

        </>
      )}

    </AnimatePresence>
  );

}


/* =========================================
   ERROR / SUCCESS ALERT
========================================= */

function AuthAlert({
  error,
  message,
}) {

  return (
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

          className="
            mt-4
            rounded-2xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-center
            text-xs
            font-semibold
            leading-5
            text-red-500
          "
        >

          {error}

        </motion.div>

      )}


      {!error &&
        message && (

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

          className="
            mt-4
            rounded-2xl
            border
            border-green-100
            bg-green-50
            px-4
            py-3
            text-center
            text-xs
            font-semibold
            leading-5
            text-green-600
          "
        >

          {message}

        </motion.div>

      )}

    </AnimatePresence>
  );

}


/* =========================================
   LOADING SPINNER
========================================= */

function LoadingSpinner() {

  return (

    <motion.span

      animate={{
        rotate:
          360,
      }}

      transition={{
        duration:
          0.8,
        repeat:
          Infinity,
        ease:
          "linear",
      }}

      className="
        h-5
        w-5
        rounded-full
        border-2
        border-white/40
        border-t-white
      "
    />

  );

}


export default AuthModal;