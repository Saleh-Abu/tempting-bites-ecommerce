import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

import {
  Search,
  X,
  CakeSlice,
  ArrowRight,
} from "lucide-react";


function SearchModal({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const [query, setQuery] =
    useState("");

  const [cakes, setCakes] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     FETCH CAKES
  ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const fetchCakes =
      async () => {
        try {
          setLoading(true);

         const response =
  await axios.get(
    `${API_URL}/api/cakes`
  );

          setCakes(
            response.data
              .cakes || []
          );
        } catch (error) {
          console.error(
            "Search cakes error:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCakes();
  }, [isOpen]);

  /* =========================
     FILTER RESULTS
  ========================= */

  const searchResults =
    query.trim()
      ? cakes.filter(
          (cake) => {
            const searchText =
              `${cake.name || ""} ${cake.category || ""} ${cake.description || ""}`
                .toLowerCase();

            return searchText.includes(
              query
                .toLowerCase()
                .trim()
            );
          }
        )
      : [];

  /* =========================
     CLOSE
  ========================= */

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  /* =========================
     VIEW CAKE
  ========================= */

  const handleViewCake = (
    cake
  ) => {
    handleClose();

    /*
      For now this sends the
      customer to Cakes page.

      Later we can open a
      dedicated cake details page.
    */

    navigate("/cakes", {
      state: {
        selectedCakeId:
          cake._id,
      },
    });
  };

  return (
    <AnimatePresence>

      {isOpen && (
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
              handleClose
            }
            className="fixed inset-0 z-[100] bg-[#2d1019]/70 backdrop-blur-md"
          />


          {/* SEARCH PANEL */}

          <motion.div
            initial={{
              opacity: 0,
              y: -40,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.98,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed left-1/2 top-4 z-[110] flex max-h-[calc(100svh-2rem)] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 flex-col overflow-hidden rounded-[2rem] bg-[#fffaf7] shadow-2xl sm:top-8 sm:w-[calc(100%-3rem)]"
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#542432]/10 px-5 py-5 sm:px-7">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-500">
                  Find your favourite
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#542432] sm:text-3xl">
                  Search Cakes
                </h2>

              </div>


              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={
                  handleClose
                }
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#542432]/5 text-[#542432]"
              >

                <X size={21} />

              </motion.button>

            </div>


            {/* SEARCH INPUT */}

            <div className="px-5 pt-5 sm:px-7">

              <div className="flex items-center gap-3 rounded-full border border-pink-100 bg-white px-5 shadow-sm">

                <Search
                  size={19}
                  className="shrink-0 text-pink-400"
                />

                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(
                    event
                  ) =>
                    setQuery(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Chocolate, strawberry, red velvet..."
                  className="h-14 w-full bg-transparent text-sm text-[#542432] outline-none placeholder:text-gray-300"
                />

                {query && (

                  <button
                    type="button"
                    onClick={() =>
                      setQuery("")
                    }
                    className="text-xs font-bold text-pink-500"
                  >
                    Clear
                  </button>

                )}

              </div>

            </div>


            {/* RESULTS */}

            <div className="mt-4 flex-1 overflow-y-auto px-5 pb-6 sm:px-7">

              {/* LOADING */}

              {loading && (

                <div className="py-16 text-center">

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
                    className="mx-auto h-8 w-8 rounded-full border-2 border-pink-100 border-t-pink-500"
                  />

                  <p className="mt-4 text-sm text-gray-400">
                    Finding something sweet...
                  </p>

                </div>

              )}


              {/* EMPTY SEARCH */}

              {!loading &&
                !query && (

                <div className="py-14 text-center">

                  <CakeSlice
                    size={45}
                    className="mx-auto text-pink-200"
                  />

                  <p className="mt-4 font-serif text-xl font-bold text-[#542432]">
                    What are you craving?
                  </p>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                    Search by cake name,
                    flavour or category.
                  </p>

                </div>

              )}


              {/* NO RESULTS */}

              {!loading &&
                query &&
                searchResults.length ===
                  0 && (

                <div className="py-14 text-center">

                  <CakeSlice
                    size={42}
                    className="mx-auto text-pink-200"
                  />

                  <p className="mt-4 font-serif text-xl font-bold text-[#542432]">
                    No cakes found
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Try searching for another flavour.
                  </p>

                </div>

              )}


              {/* SEARCH RESULTS */}

              {!loading &&
                searchResults.length >
                  0 && (

                <div>

                  <p className="mb-3 text-xs font-semibold text-gray-400">
                    {
                      searchResults.length
                    }{" "}
                    {searchResults.length ===
                    1
                      ? "cake found"
                      : "cakes found"}
                  </p>


                  <div className="space-y-3">

                    {searchResults.map(
                      (
                        cake,
                        index
                      ) => (

                        <motion.button
                          key={
                            cake._id
                          }
                          type="button"
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.04,
                          }}
                          onClick={() =>
                            handleViewCake(
                              cake
                            )
                          }
                          className="group flex w-full items-center gap-4 rounded-2xl border border-[#542432]/5 bg-white p-3 text-left transition hover:border-pink-100 hover:shadow-md sm:p-4"
                        >

                          {/* IMAGE */}

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-pink-50 sm:h-24 sm:w-24">

                            {cake.image ? (

                              <img
                                src={
                                  cake.image
                                }
                                alt={
                                  cake.name
                                }
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <CakeSlice
                                  size={25}
                                  className="text-pink-200"
                                />

                              </div>

                            )}

                          </div>


                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">

                            <p className="text-[9px] font-bold uppercase tracking-wider text-pink-400">
                              {cake.category ||
                                "Cake"}
                            </p>

                            <h3 className="mt-1 truncate font-serif text-lg font-bold text-[#542432] sm:text-xl">
                              {
                                cake.name
                              }
                            </h3>


                            <div className="mt-2 flex items-center gap-2">

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  cake.isAvailable !==
                                  false
                                    ? "bg-green-500"
                                    : "bg-red-400"
                                }`}
                              />

                              <span className="text-[11px] font-semibold text-gray-400">

                                {cake.isAvailable !==
                                false
                                  ? "Available"
                                  : "Out of stock"}

                              </span>

                            </div>

                          </div>


                          {/* ARROW */}

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#542432]/5 text-[#542432] transition group-hover:bg-[#542432] group-hover:text-white">

                            <ArrowRight
                              size={16}
                            />

                          </div>

                        </motion.button>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </motion.div>

        </>
      )}

    </AnimatePresence>
  );
}

export default SearchModal;