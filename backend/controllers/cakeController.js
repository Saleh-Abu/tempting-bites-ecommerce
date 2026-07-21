const Cake = require("../models/Cake");

/* =========================
   GET ALL CAKES
   PUBLIC
========================= */

const getCakes = async (req, res) => {
  try {
    const cakes = await Cake.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: cakes.length,
      cakes,
    });
  } catch (error) {
    console.error(
      "Get cakes error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to load cakes.",
    });
  }
};

/* =========================
   GET SINGLE CAKE
   PUBLIC
========================= */

const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(
      req.params.id
    );

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: "Cake not found.",
      });
    }

    res.status(200).json({
      success: true,
      cake,
    });
  } catch (error) {
    console.error(
      "Get cake error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to load cake.",
    });
  }
};

/* =========================
   CREATE CAKE
   ADMIN ONLY
========================= */

const createCake = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      image,
      prices,
      badge,
      isAvailable,
      isTodaysExclusive,
      isMostOrdered,
      isNew,
      isFeatured,
      isTrending,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Cake name is required.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Cake category is required.",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message:
          "Cake image is required.",
      });
    }

    if (
      !prices ||
      Object.keys(prices).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please add at least one cake price.",
      });
    }

    /* =========================
       CLEAN PRICES
    ========================= */

    const cleanedPrices = {};

    Object.entries(prices).forEach(
      ([weight, price]) => {
        const numericPrice =
          Number(price);

        if (
          weight &&
          !Number.isNaN(
            numericPrice
          ) &&
          numericPrice > 0
        ) {
          cleanedPrices[weight] =
            numericPrice;
        }
      }
    );

    if (
      Object.keys(
        cleanedPrices
      ).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid cake price.",
      });
    }

    /* =========================
       CREATE
    ========================= */

    const cake =
      await Cake.create({
        name: name.trim(),

        description:
          description?.trim() || "",

        category:
          category.trim(),

        image,

        badge:
          badge || "",

        prices:
          cleanedPrices,

        isAvailable:
          isAvailable ?? true,

        isTodaysExclusive:
          isTodaysExclusive ??
          false,

        isMostOrdered:
          isMostOrdered ??
          false,

        isNew:
          isNew ?? false,

        isFeatured:
          isFeatured ?? false,

        isTrending:
          isTrending ?? false,
      });

    res.status(201).json({
      success: true,
      message:
        "Cake added successfully!",
      cake,
    });
  } catch (error) {
    console.error(
      "Create cake error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add cake.",
    });
  }
};

/* =========================
   UPDATE CAKE
   ADMIN ONLY
========================= */

const updateCake = async (req, res) => {
  try {
    const cake =
      await Cake.findById(
        req.params.id
      );

    if (!cake) {
      return res.status(404).json({
        success: false,
        message:
          "Cake not found.",
      });
    }

    /* =========================
       BASIC FIELDS
    ========================= */

    if (
      req.body.name !==
      undefined
    ) {
      cake.name =
        req.body.name.trim();
    }

    if (
      req.body.description !==
      undefined
    ) {
      cake.description =
        req.body.description.trim();
    }

    if (
      req.body.category !==
      undefined
    ) {
      cake.category =
        req.body.category.trim();
    }

    if (
      req.body.image !==
      undefined
    ) {
      cake.image =
        req.body.image;
    }

    if (
      req.body.badge !==
      undefined
    ) {
      cake.badge =
        req.body.badge;
    }

    /* =========================
       UPDATE PRICES
    ========================= */

    if (
      req.body.prices !==
      undefined
    ) {
      const cleanedPrices = {};

      Object.entries(
        req.body.prices
      ).forEach(
        ([weight, price]) => {
          const numericPrice =
            Number(price);

          if (
            weight &&
            !Number.isNaN(
              numericPrice
            ) &&
            numericPrice > 0
          ) {
            cleanedPrices[
              weight
            ] = numericPrice;
          }
        }
      );

      if (
        Object.keys(
          cleanedPrices
        ).length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please enter at least one valid price.",
          });
      }

      cake.prices =
        cleanedPrices;
    }

    /* =========================
       AVAILABILITY
    ========================= */

    if (
      typeof req.body
        .isAvailable ===
      "boolean"
    ) {
      cake.isAvailable =
        req.body.isAvailable;
    }

    /* =========================
       PRODUCT HIGHLIGHTS
    ========================= */

    if (
      typeof req.body
        .isTodaysExclusive ===
      "boolean"
    ) {
      cake.isTodaysExclusive =
        req.body
          .isTodaysExclusive;
    }

    if (
      typeof req.body
        .isMostOrdered ===
      "boolean"
    ) {
      cake.isMostOrdered =
        req.body.isMostOrdered;
    }

    if (
      typeof req.body.isNew ===
      "boolean"
    ) {
      cake.isNew =
        req.body.isNew;
    }

    if (
      typeof req.body
        .isFeatured ===
      "boolean"
    ) {
      cake.isFeatured =
        req.body.isFeatured;
    }

    if (
      typeof req.body
        .isTrending ===
      "boolean"
    ) {
      cake.isTrending =
        req.body.isTrending;
    }

    /* =========================
       SAVE
    ========================= */

    await cake.save();

    res.status(200).json({
      success: true,
      message:
        "Cake updated successfully!",
      cake,
    });
  } catch (error) {
    console.error(
      "Update cake error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update cake.",
    });
  }
};

/* =========================
   UPDATE AVAILABILITY
   ADMIN ONLY
========================= */

const updateCakeAvailability =
  async (req, res) => {
    try {
      const {
        isAvailable,
      } = req.body;

      if (
        typeof isAvailable !==
        "boolean"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Availability must be true or false.",
          });
      }

      const cake =
        await Cake.findByIdAndUpdate(
          req.params.id,

          {
            isAvailable,
          },

          {
            new: true,
            runValidators: true,
          }
        );

      if (!cake) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Cake not found.",
          });
      }

      res.status(200).json({
        success: true,

        message: isAvailable
          ? "Cake is now available."
          : "Cake marked out of stock.",

        cake,
      });
    } catch (error) {
      console.error(
        "Availability error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update availability.",
      });
    }
  };

/* =========================
   DELETE CAKE
   ADMIN ONLY
========================= */

const deleteCake = async (
  req,
  res
) => {
  try {
    const cake =
      await Cake.findById(
        req.params.id
      );

    if (!cake) {
      return res.status(404).json({
        success: false,
        message:
          "Cake not found.",
      });
    }

    await cake.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Cake deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete cake error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete cake.",
    });
  }
};

module.exports = {
  getCakes,
  getCakeById,
  createCake,
  updateCake,
  updateCakeAvailability,
  deleteCake,
};