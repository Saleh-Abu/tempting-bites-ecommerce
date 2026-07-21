const mongoose =
  require("mongoose");

const dotenv =
  require("dotenv");

const Admin =
  require("./models/Admin");

dotenv.config();

const createAdmin =
  async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI
      );

      const email =
        process.env.ADMIN_EMAIL;

      const password =
        process.env.ADMIN_PASSWORD;

      if (
        !email ||
        !password
      ) {
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
        );
      }

      const existingAdmin =
        await Admin.findOne({
          email,
        });

      if (existingAdmin) {
        console.log(
          "Admin already exists."
        );

        process.exit(0);
      }

      await Admin.create({
        name:
          "Tempting Bites Admin",

        email,

        password,
      });

      console.log(
        "Admin created successfully!"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Create admin error:",
        error.message
      );

      process.exit(1);
    }
  };

createAdmin();