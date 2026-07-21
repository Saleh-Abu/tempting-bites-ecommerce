const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      required: true,
    },

    badge: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    // Different prices according to cake weight
    // Example:
    // {
    //   "500g": 699,
    //   "1kg": 1199,
    //   "2kg": 2199
    // }
    prices: {
      type: Map,
      of: Number,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isTodaysExclusive: {
      type: Boolean,
      default: false,
    },

    isMostOrdered: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cake", cakeSchema);