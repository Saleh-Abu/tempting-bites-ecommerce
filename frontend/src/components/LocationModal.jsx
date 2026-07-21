import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
} from "lucide-react";

function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
}) {
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(false);

  const checkDelivery = () => {
    if (pincode.length !== 6) return;

    setChecking(true);
    setAvailable(false);

    // Temporary frontend simulation.
    // Later this will check serviceable PIN codes from backend.
    setTimeout(() => {
      setChecking(false);
      setAvailable(true);
    }, 800);
  };

  const saveLocation = () => {
    onLocationSelect(pincode);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[170] bg-black/60 backdrop-blur-md"
          />

          {/* MODAL */}

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
            className="fixed left-1/2 top-1/2 z-[180] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.5rem] bg-[#fffaf8] shadow-2xl"
          >
            {/* HEADER */}

            <div className="relative overflow-hidden bg-[#542432] px-8 pb-10 pt-9 text-white">

              <motion.div
                animate={{
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                }}
                className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pink-400/20 blur-3xl"
              />

              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
              >
                <X size={19} />
              </button>

              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500 shadow-lg"
              >
                <MapPin size={25} />
              </motion.div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                Where should we deliver?
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
                Enter your PIN code to check whether
                Tempting Bites delivers fresh cakes to
                your location.
              </p>

            </div>

            {/* CONTENT */}

            <div className="p-8">

              <label className="text-sm font-bold text-[#542432]">
                Delivery PIN Code
              </label>

              <div className="mt-3 flex items-center overflow-hidden rounded-2xl border border-pink-100 bg-white focus-within:border-pink-400">

                <MapPin
                  size={19}
                  className="ml-5 shrink-0 text-pink-400"
                />

                <input
                  type="text"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => {
                    setPincode(
                      e.target.value.replace(/\D/g, "")
                    );
                    setAvailable(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkDelivery();
                    }
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="w-full px-4 py-4 outline-none"
                />

                <button
                  onClick={checkDelivery}
                  disabled={pincode.length !== 6}
                  className="mr-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#542432] text-white disabled:opacity-30"
                >
                  <Search size={17} />
                </button>

              </div>

              {/* CHECKING */}

              {checking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 flex items-center gap-3 rounded-2xl bg-pink-50 p-4"
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Navigation
                      size={19}
                      className="text-pink-500"
                    />
                  </motion.div>

                  <p className="text-sm font-semibold text-[#704653]">
                    Checking delivery availability...
                  </p>
                </motion.div>
              )}

              {/* AVAILABLE */}

              {available && !checking && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5"
                >
                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={22}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="font-bold text-green-700">
                        Sweet news! We deliver here.
                      </p>

                      <p className="mt-1 text-sm text-green-700/70">
                        Fresh cakes can be delivered to PIN{" "}
                        {pincode}.
                      </p>
                    </div>

                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={saveLocation}
                    className="mt-5 w-full rounded-full bg-green-600 py-4 text-sm font-bold text-white"
                  >
                    Deliver Here
                  </motion.button>

                </motion.div>
              )}

              {/* CURRENT LOCATION */}

              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-pink-100 py-4 text-sm font-bold text-pink-500 transition hover:bg-pink-50"
                onClick={() =>
                  alert(
                    "Browser location detection will be connected later."
                  )
                }
              >
                <Navigation size={17} />

                Use My Current Location
              </button>

              <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                Your location helps us show accurate
                delivery availability and delivery times.
              </p>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LocationModal;