import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/products.model.js";

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Connect to the database before starting the server
connectDB();

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    // ✅ Correct validation inside the route handler
    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create and save new product
    const newProduct = new Product({ name, price, image });
    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

export default app;