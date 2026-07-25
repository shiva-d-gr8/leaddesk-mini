const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const Admin = require("./src/models/Admin");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(
      "Admin@12345",
      10
    );

    await Admin.create({
      email: "admin@leaddesk.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin(); 