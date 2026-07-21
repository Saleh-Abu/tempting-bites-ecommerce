import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CakeSlice,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  PackageCheck,
  PackageX,
  X,
  Save,
  Sparkles,
  Flame,
  Star,
  TrendingUp,
  Crown,
  ImagePlus,
  IndianRupee,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/cakes";
const UPLOAD_URL = "http://localhost:5000/api/upload/cake";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  image: "",

  prices: {
    "500g": "",
    "1kg": "",
    "2kg": "",
  },

  isAvailable: true,
  isTodaysExclusive: false,
  isMostOrdered: false,
  isNew: false,
  isFeatured: false,
  isTrending: false,
};

function AdminCakesPage() {
  const navigate = useNavigate();

  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCake, setEditingCake] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /* =========================
     ADMIN TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  /* =========================
     FETCH CAKES
  ========================= */

  const fetchCakes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setCakes(response.data.cakes || []);
    } catch (error) {
      console.error("Unable to load cakes:", error);

      alert("Unable to load cakes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  /* =========================
     OPEN ADD FORM
  ========================= */

  const openAddForm = () => {
    setEditingCake(null);

    setForm({
      ...emptyForm,
      prices: {
        ...emptyForm.prices,
      },
    });

    setImageFile(null);
    setImagePreview("");

    setShowForm(true);
  };

  /* =========================
     OPEN EDIT FORM
  ========================= */

  const openEditForm = (cake) => {
    setEditingCake(cake);

    setForm({
      name: cake.name || "",

      description:
        cake.description || "",

      category:
        cake.category || "",

      image:
        cake.image || "",

      prices: {
        "500g":
          cake.prices?.["500g"] ?? "",

        "1kg":
          cake.prices?.["1kg"] ?? "",

        "2kg":
          cake.prices?.["2kg"] ?? "",
      },

      isAvailable:
        cake.isAvailable !== false,

      isTodaysExclusive:
        cake.isTodaysExclusive || false,

      isMostOrdered:
        cake.isMostOrdered || false,

      isNew:
        cake.isNew || false,

      isFeatured:
        cake.isFeatured || false,

      isTrending:
        cake.isTrending || false,
    });

    setImageFile(null);

    setImagePreview(
      cake.image || ""
    );

    setShowForm(true);
  };

  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {
    setShowForm(false);

    setEditingCake(null);

    setForm({
      ...emptyForm,
      prices: {
        ...emptyForm.prices,
      },
    });

    setImageFile(null);
    setImagePreview("");
  };

  /* =========================
     NORMAL FORM CHANGE
  ========================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================
     PRICE CHANGE
  ========================= */

  const handlePriceChange = (
    weight,
    value
  ) => {
    setForm((current) => ({
      ...current,

      prices: {
        ...current.prices,

        [weight]:
          value,
      },
    }));
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image must be smaller than 5 MB."
      );

      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );
  };

  /* =========================
     SAVE CAKE
  ========================= */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token =
        getToken();

      if (!token) {
        navigate(
          "/admin/login"
        );

        return;
      }

      /* =====================
         KEEP OLD IMAGE
      ===================== */

      let finalImageUrl =
        form.image || "";

      /* =====================
         UPLOAD NEW IMAGE
      ===================== */

      if (imageFile) {
        const imageData =
          new FormData();

        imageData.append(
          "image",
          imageFile
        );

        const uploadResponse =
          await axios.post(
            UPLOAD_URL,

            imageData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          !uploadResponse.data
            .imageUrl
        ) {
          throw new Error(
            "Image upload failed."
          );
        }

        finalImageUrl =
          uploadResponse.data
            .imageUrl;
      }

      /* =====================
         IMAGE REQUIRED
      ===================== */

      if (
        !editingCake &&
        !finalImageUrl
      ) {
        alert(
          "Please choose a cake image."
        );

        return;
      }

      /* =====================
         CLEAN PRICES
      ===================== */

      const cleanedPrices = {};

      Object.entries(
        form.prices
      ).forEach(
        ([weight, price]) => {
          if (
            price !== "" &&
            Number(price) > 0
          ) {
            cleanedPrices[
              weight
            ] = Number(price);
          }
        }
      );

      if (
        Object.keys(
          cleanedPrices
        ).length === 0
      ) {
        alert(
          "Please enter at least one cake price."
        );

        return;
      }

      /* =====================
         CAKE DATA
      ===================== */

      const cakeData = {
        name:
          form.name.trim(),

        description:
          form.description.trim(),

        category:
          form.category.trim(),

        image:
          finalImageUrl,

        prices:
          cleanedPrices,

        isAvailable:
          form.isAvailable,

        isTodaysExclusive:
          form.isTodaysExclusive,

        isMostOrdered:
          form.isMostOrdered,

        isNew:
          form.isNew,

        isFeatured:
          form.isFeatured,

        isTrending:
          form.isTrending,
      };

      /* =====================
         UPDATE CAKE
      ===================== */

      if (editingCake) {
        await axios.put(
          `${API_URL}/${editingCake._id}`,

          cakeData,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Cake updated successfully! 🎂"
        );
      }

      /* =====================
         ADD CAKE
      ===================== */

      else {
        await axios.post(
          API_URL,

          cakeData,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "New cake added successfully! 🎉"
        );
      }

      closeForm();

      await fetchCakes();
    } catch (error) {
      console.error(
        "Save cake error:",
        error
      );

      if (
        error.response?.status ===
          401 ||
        error.response?.status ===
          403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        navigate(
          "/admin/login"
        );

        return;
      }

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to save cake."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     AVAILABILITY
  ========================= */

  const toggleAvailability =
    async (cake) => {
      try {
        const token =
          getToken();

        if (!token) {
          navigate(
            "/admin/login"
          );

          return;
        }

        const response =
          await axios.patch(
            `${API_URL}/${cake._id}/availability`,

            {
              isAvailable:
                !cake.isAvailable,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCakes(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                cake._id
                  ? response.data
                      .cake
                  : item
            )
        );
      } catch (error) {
        console.error(
          "Availability error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to update availability."
        );
      }
    };

  /* =========================
     DELETE CAKE
  ========================= */

  const deleteCake =
    async (cake) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${cake.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          getToken();

        if (!token) {
          navigate(
            "/admin/login"
          );

          return;
        }

        await axios.delete(
          `${API_URL}/${cake._id}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCakes(
          (current) =>
            current.filter(
              (item) =>
                item._id !==
                cake._id
            )
        );

        alert(
          "Cake deleted successfully."
        );
      } catch (error) {
        console.error(
          "Delete error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to delete cake."
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#fff8f5] px-4 py-6 sm:px-6 md:px-10 md:py-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================
            HEADER
        ===================== */}

        <button
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
          className="flex items-center gap-2 text-sm font-bold text-[#542432]"
        >
          <ArrowLeft
            size={17}
          />

          Dashboard
        </button>


        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold text-pink-500">
              Tempting Bites Admin
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold text-[#542432] sm:text-4xl">
              Manage Cakes
            </h1>

            <p className="mt-2 max-w-lg text-sm text-gray-400">
              Add new cakes, change
              photos, manage prices,
              availability and website
              promotions.
            </p>

          </div>


          <div className="grid grid-cols-2 gap-3 sm:flex">

            <button
              onClick={
                fetchCakes
              }
              className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-[#542432] shadow-sm"
            >

              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>


            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={
                openAddForm
              }
              className="flex items-center justify-center gap-2 rounded-full bg-[#542432] px-4 py-3 text-sm font-bold text-white"
            >

              <Plus
                size={18}
              />

              Add Cake

            </motion.button>

          </div>

        </div>


        {/* =====================
            STATS
        ===================== */}

        <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">

          <MiniStat
            title="Total"
            value={
              cakes.length
            }
          />

          <MiniStat
            title="Available"
            value={
              cakes.filter(
                (cake) =>
                  cake.isAvailable !==
                  false
              ).length
            }
          />

          <MiniStat
            title="Out of Stock"
            value={
              cakes.filter(
                (cake) =>
                  cake.isAvailable ===
                  false
              ).length
            }
          />

        </div>


        {/* =====================
            LOADING
        ===================== */}

        {loading ? (

          <div className="py-24 text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-pink-500"
            />

            <p className="mt-4 text-sm text-gray-400">
              Loading cakes...
            </p>

          </div>

        ) : cakes.length ===
          0 ? (

          /* =====================
             EMPTY
          ===================== */

          <div className="mt-10 rounded-[2rem] bg-white px-5 py-20 text-center">

            <CakeSlice
              size={45}
              className="mx-auto text-pink-200"
            />

            <h2 className="mt-4 font-serif text-2xl font-bold text-[#542432]">
              No cakes yet
            </h2>

            <button
              onClick={
                openAddForm
              }
              className="mt-6 rounded-full bg-[#542432] px-6 py-3 text-sm font-bold text-white"
            >
              Add First Cake
            </button>

          </div>

        ) : (

          /* =====================
             CAKE CARDS
          ===================== */

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {cakes.map(
              (cake) => (

                <motion.div
                  key={
                    cake._id
                  }
                  whileHover={{
                    y: -4,
                  }}
                  className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_15px_50px_rgba(80,30,45,0.07)]"
                >

                  {/* IMAGE */}

                  <div className="relative h-52 bg-gradient-to-br from-pink-50 to-[#fff3ee] sm:h-56">

                    {cake.image ? (

                      <img
                        src={
                          cake.image
                        }
                        alt={
                          cake.name
                        }
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">

                        <CakeSlice
                          size={55}
                          className="text-pink-200"
                        />

                      </div>

                    )}


                    {/* AVAILABILITY */}

                    <div className="absolute left-4 top-4">

                      {cake.isAvailable !==
                      false ? (

                        <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow">

                          <PackageCheck
                            size={13}
                          />

                          Available

                        </span>

                      ) : (

                        <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow">

                          <PackageX
                            size={13}
                          />

                          Out of Stock

                        </span>

                      )}

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="p-5 sm:p-6">

                    <p className="text-xs font-bold uppercase tracking-wider text-pink-400">

                      {cake.category ||
                        "Cake"}

                    </p>


                    <h2 className="mt-2 font-serif text-xl font-bold text-[#542432] sm:text-2xl">

                      {cake.name}

                    </h2>


                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">

                      {cake.description ||
                        "No description"}

                    </p>


                    {/* PRICES */}

                    <div className="mt-5">

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Prices
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {cake.prices &&
                          Object.entries(
                            cake.prices
                          ).map(
                            ([
                              weight,
                              price,
                            ]) => (

                              <span
                                key={
                                  weight
                                }
                                className="rounded-full bg-pink-50 px-3 py-2 text-xs font-bold text-[#542432]"
                              >
                                {weight} · ₹
                                {price}
                              </span>

                            )
                          )}

                      </div>

                    </div>


                    {/* TAGS */}

                    <CakeTags
                      cake={
                        cake
                      }
                    />


                    {/* ACTIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <button
                        onClick={() =>
                          openEditForm(
                            cake
                          )
                        }
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#542432] px-3 py-3 text-xs font-bold text-white"
                      >

                        <Pencil
                          size={14}
                        />

                        Edit

                      </button>


                      <button
                        onClick={() =>
                          toggleAvailability(
                            cake
                          )
                        }
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-pink-50 px-3 py-3 text-xs font-bold text-pink-500"
                      >

                        {cake.isAvailable !==
                        false ? (

                          <>
                            <PackageX
                              size={14}
                            />

                            Out of Stock
                          </>

                        ) : (

                          <>
                            <PackageCheck
                              size={14}
                            />

                            Available
                          </>

                        )}

                      </button>

                    </div>


                    <button
                      onClick={() =>
                        deleteCake(
                          cake
                        )
                      }
                      className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-bold text-red-500"
                    >

                      <Trash2
                        size={14}
                      />

                      Delete Cake

                    </button>

                  </div>

                </motion.div>

              )
            )}

          </div>

        )}

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <AnimatePresence>

        {showForm && (

          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
              }}
              className="max-h-[95vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-[2rem] sm:p-8"
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">

                    {editingCake
                      ? "Edit Product"
                      : "New Product"}

                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-[#542432] sm:text-3xl">

                    {editingCake
                      ? "Edit Cake"
                      : "Add New Cake"}

                  </h2>

                </div>


                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >

                  <X
                    size={18}
                  />

                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-7 space-y-6"
              >

                {/* NAME */}

                <InputField
                  label="Cake Name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Chocolate Truffle"
                  required
                />


                {/* CATEGORY */}

                <InputField
                  label="Category"
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Birthday, Chocolate, Bento..."
                  required
                />


                {/* DESCRIPTION */}

                <div>

                  <label className="text-sm font-bold text-[#542432]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Describe the cake..."
                    className="mt-2 min-h-28 w-full rounded-xl border border-pink-100 bg-[#fffafa] p-4 text-base outline-none focus:border-pink-400 sm:text-sm"
                  />

                </div>


                {/* =====================
                    IMAGE
                ===================== */}

                <div>

                  <label className="text-sm font-bold text-[#542432]">
                    Cake Image
                  </label>

                  <p className="mt-1 text-xs text-gray-400">

                    {editingCake
                      ? "Keep the current image or choose a new photo from your phone."
                      : "Choose a cake photo from your phone gallery."}

                  </p>


                  <div className="mt-3 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 p-4">

                    {imagePreview ? (

                      <div className="relative mb-4 overflow-hidden rounded-2xl">

                        <img
                          src={
                            imagePreview
                          }
                          alt="Cake preview"
                          className="h-52 w-full object-cover sm:h-64"
                        />


                        {imageFile && (

                          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white">

                            New Image Selected

                          </span>

                        )}

                      </div>

                    ) : (

                      <div className="mb-4 flex h-44 flex-col items-center justify-center rounded-2xl bg-white">

                        <ImagePlus
                          size={42}
                          className="text-pink-200"
                        />

                        <p className="mt-3 text-sm font-semibold text-gray-400">
                          No image selected
                        </p>

                      </div>

                    )}


                    <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#542432] px-5 py-3.5 text-sm font-bold text-white">

                      <ImagePlus
                        size={18}
                      />

                      {editingCake
                        ? "Choose New Image"
                        : "Choose Cake Image"}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />

                    </label>


                    {imageFile && (

                      <p className="mt-3 break-all text-center text-xs font-semibold text-green-600">

                        ✓ {imageFile.name}

                      </p>

                    )}

                  </div>

                </div>


                {/* =====================
                    PRICES
                ===================== */}

                <div>

                  <div className="flex items-center gap-2">

                    <IndianRupee
                      size={18}
                      className="text-pink-500"
                    />

                    <p className="text-sm font-bold text-[#542432]">
                      Cake Prices
                    </p>

                  </div>


                  <p className="mt-1 text-xs text-gray-400">
                    Set prices according
                    to cake weight.
                  </p>


                  <div className="mt-4 space-y-3">

                    {[
                      "500g",
                      "1kg",
                      "2kg",
                    ].map(
                      (weight) => (

                        <div
                          key={
                            weight
                          }
                          className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-[#fffafa] p-3"
                        >

                          <div className="w-14 shrink-0">

                            <p className="text-sm font-bold text-[#542432]">

                              {weight}

                            </p>

                          </div>


                          <div className="flex flex-1 items-center rounded-xl bg-white px-4">

                            <span className="font-bold text-pink-500">
                              ₹
                            </span>

                            <input
                              type="number"
                              min="0"
                              value={
                                form
                                  .prices[
                                  weight
                                ]
                              }
                              onChange={(
                                e
                              ) =>
                                handlePriceChange(
                                  weight,
                                  e
                                    .target
                                    .value
                                )
                              }
                              placeholder="Enter price"
                              className="min-h-12 w-full bg-transparent px-3 text-base outline-none"
                            />

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* =====================
                    PROMOTIONS
                ===================== */}

                <div>

                  <p className="text-sm font-bold text-[#542432]">
                    Product Highlights
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Control where this
                    cake appears on the
                    customer website.
                  </p>


                  <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <Toggle
                      name="isTodaysExclusive"
                      checked={
                        form.isTodaysExclusive
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Crown
                      }
                      label="Today's Exclusive"
                    />


                    <Toggle
                      name="isMostOrdered"
                      checked={
                        form.isMostOrdered
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Flame
                      }
                      label="Most Ordered"
                    />


                    <Toggle
                      name="isNew"
                      checked={
                        form.isNew
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Sparkles
                      }
                      label="New"
                    />


                    <Toggle
                      name="isFeatured"
                      checked={
                        form.isFeatured
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Star
                      }
                      label="Featured"
                    />


                    <Toggle
                      name="isTrending"
                      checked={
                        form.isTrending
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        TrendingUp
                      }
                      label="Trending"
                    />


                    <Toggle
                      name="isAvailable"
                      checked={
                        form.isAvailable
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        PackageCheck
                      }
                      label="Available"
                    />

                  </div>

                </div>


                {/* SAVE */}

                <motion.button
                  type="submit"
                  whileTap={{
                    scale: 0.98,
                  }}
                  disabled={
                    saving
                  }
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#542432] py-4 text-sm font-bold text-white disabled:opacity-50"
                >

                  {saving ? (

                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      {imageFile
                        ? "Uploading & Saving..."
                        : "Saving Changes..."}

                    </>

                  ) : (

                    <>
                      <Save
                        size={17}
                      />

                      {editingCake
                        ? "Save Changes"
                        : "Add Cake"}

                    </>

                  )}

                </motion.button>

              </form>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </main>
  );
}


/* =========================
   INPUT FIELD
========================= */

function InputField({
  label,
  ...props
}) {

  return (

    <div>

      <label className="text-sm font-bold text-[#542432]">
        {label}
      </label>

      <input
        {...props}
        className="mt-2 min-h-12 w-full rounded-xl border border-pink-100 bg-[#fffafa] px-4 py-3.5 text-base outline-none focus:border-pink-400 sm:text-sm"
      />

    </div>

  );
}


/* =========================
   TOGGLE
========================= */

function Toggle({
  icon: Icon,
  label,
  ...props
}) {

  return (

    <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-pink-50 p-4">

      <input
        type="checkbox"
        {...props}
        className="h-5 w-5 shrink-0 accent-pink-500"
      />

      <Icon
        size={18}
        className="shrink-0 text-pink-500"
      />

      <span className="text-sm font-semibold text-[#704653]">
        {label}
      </span>

    </label>

  );
}


/* =========================
   CAKE TAGS
========================= */

function CakeTags({
  cake,
}) {

  const tags = [

    cake.isTodaysExclusive &&
      "Today's Exclusive",

    cake.isMostOrdered &&
      "Most Ordered",

    cake.isNew &&
      "New",

    cake.isFeatured &&
      "Featured",

    cake.isTrending &&
      "Trending",

  ].filter(Boolean);


  if (
    tags.length === 0
  ) {
    return null;
  }


  return (

    <div className="mt-4 flex flex-wrap gap-2">

      {tags.map(
        (tag) => (

          <span
            key={
              tag
            }
            className="rounded-full bg-pink-50 px-3 py-1.5 text-[10px] font-bold text-pink-500"
          >

            {tag}

          </span>

        )
      )}

    </div>

  );
}


/* =========================
   MINI STAT
========================= */

function MiniStat({
  title,
  value,
}) {

  return (

    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-5">

      <p className="text-[11px] text-gray-400 sm:text-sm">
        {title}
      </p>

      <p className="mt-1 text-xl font-black text-[#542432] sm:text-2xl">
        {value}
      </p>

    </div>

  );
}


export default AdminCakesPage;