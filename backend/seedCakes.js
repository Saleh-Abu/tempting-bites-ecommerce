const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Cake = require("./models/Cake");

dotenv.config();

const cakes = [
  {
    name: "Belgian Chocolate Truffle",
    category: "Chocolate",
    description:
      "A rich chocolate cake layered with silky chocolate ganache.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 186,
    prices: {
      "500g": 699,
      "1kg": 1199,
      "2kg": 2199,
    },
    available: true,
  },

  {
    name: "Chocolate Dream Cake",
    category: "Chocolate",
    description:
      "An indulgent chocolate creation for true chocolate lovers.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85",
    badge: "Most Loved",
    rating: 4.8,
    reviews: 142,
    prices: {
      "500g": 749,
      "1kg": 1299,
      "2kg": 2299,
    },
    available: true,
  },

  {
    name: "Birthday Sprinkle Bliss",
    category: "Birthday",
    description:
      "A colourful celebration cake made to brighten every birthday.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85",
    badge: "Celebration Pick",
    rating: 4.7,
    reviews: 91,
    prices: {
      "500g": 799,
      "1kg": 1399,
      "2kg": 2499,
    },
    available: true,
  },

  {
    name: "Rose Anniversary Cake",
    category: "Anniversary",
    description:
      "An elegant romantic cake designed for anniversaries and special moments.",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1000&q=85",
    badge: "Romantic",
    rating: 4.9,
    reviews: 116,
    prices: {
      "500g": 849,
      "1kg": 1499,
      "2kg": 2699,
    },
    available: true,
  },

  {
    name: "Chocolate Mini Bento",
    category: "Bento",
    description:
      "A cute mini chocolate bento cake perfect for small celebrations.",
    image:
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1000&q=85",
    badge: "Cute & Tiny",
    rating: 4.8,
    reviews: 74,
    prices: {
      "300g": 349,
      "500g": 549,
      "1kg": 999,
    },
    available: true,
  },

  {
    name: "Strawberry Love Bento",
    category: "Bento",
    description:
      "A charming strawberry bento cake made for sweet little surprises.",
    image:
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=1000&q=85",
    badge: "Trending",
    rating: 4.9,
    reviews: 103,
    prices: {
      "300g": 399,
      "500g": 599,
      "1kg": 1099,
    },
    available: true,
  },

  {
    name: "Pistachio Kunafa Chocolate",
    category: "Kunafa",
    description:
      "A luxurious fusion of crispy kunafa, pistachio and rich chocolate.",
    image:
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=85",
    badge: "Luxury Pick",
    rating: 4.9,
    reviews: 158,
    prices: {
      "500g": 999,
      "1kg": 1799,
      "2kg": 3299,
    },
    available: true,
  },

  {
    name: "Dubai Chocolate Kunafa",
    category: "Kunafa",
    description:
      "A premium Dubai-inspired chocolate and kunafa fusion creation.",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85",
    badge: "Viral",
    rating: 4.9,
    reviews: 207,
    prices: {
      "500g": 1099,
      "1kg": 1999,
      "2kg": 3599,
    },
    available: true,
  },

  {
    name: "Royal Floral Custom Cake",
    category: "Custom",
    description:
      "A premium custom celebration cake designed specially for your occasion.",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85",
    badge: "Made For You",
    rating: 4.8,
    reviews: 67,
    prices: {
      "1kg": 1699,
      "2kg": 2999,
      "3kg": 4199,
    },
    available: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected for seeding");

    // Prevent duplicate data when re-running seed
    await Cake.deleteMany({});

    console.log("Old cake data cleared");

    const createdCakes =
      await Cake.insertMany(cakes);

    console.log(
      `${createdCakes.length} cakes added successfully`
    );

    await mongoose.connection.close();

    console.log(
      "Database connection closed"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed error:",
      error.message
    );

    process.exit(1);
  }
};

seedDatabase();