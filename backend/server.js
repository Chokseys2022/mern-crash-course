import express from "express"; // Import Express framework
import dotenv from "dotenv"; // Import dotenv for environment variable management
import { connectDB } from "./config/db.js"; // Import function to connect to the database
import Product from "./models/products.model.js"; // Import Product model
import mongoose from "mongoose";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON request bodies

//**** Route to fetch all products from the database ****//
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products from the database
    res.status(200).json({ success: true, data: products }); // Send success response with product data
  } catch (error) {
    console.error("Error fetching products:", error.message); // Log error to the console
    res.status(500).json({ success: false, message: "Server error" }); // Send error response
  }
});

//**** Connect to the database before starting the server ****//
connectDB();

//**** Route to create a new product and store it in the database ****//
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image } = req.body; // Extract product details from request body

    // Validate request body to ensure all fields are provided
    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product instance
    const newProduct = new Product({ name, price, image });
    await newProduct.save(); // Save the product to the database

    res.status(201).json({ success: true, data: newProduct }); // Send success response with created product data
  } catch (error) {
    console.error("Error creating product:", error.message); // Log error to the console
    res.status(500).json({ success: false, message: "Server error" }); // Send error response
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Extract product ID from request parameters
  const product = req.body; // Extract updated product details from request body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" }); // Send error response
  }
});

//**** Route to delete a product from the database using its ID ****//
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Extract product ID from request parameters

  try {
    await Product.findByIdAndDelete(id); // Attempt to delete the product by ID
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ success: false, message: "Product not found" }); // Send error response if deletion fails
  }
});

//**** Start the server on the specified port and log a message ****//
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`); // Log server start message
});

export default app; // Export the Express app for potential use in other modules
