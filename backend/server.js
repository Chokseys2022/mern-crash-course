import express from "express"; // Import Express framework
import dotenv from "dotenv"; // Import dotenv for environment variable management
import { connectDB } from "./config/db.js"; // Import function to connect to the database

import productsRoutes from "./routes/product.route.js"; // Import product routes

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json()); // Middleware to parse incoming JSON request bodies

app.use("/api/products",productsRoutes )

//**** Connect to the database before starting the server ****//
connectDB()

//**** Start the server on the specified port and log a message ****//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`); // Log server start message
});

//**** Start the server on port 5001 and log a message ****//
//*** another way to write code as above ***/

// app.listen(5001, () => {
//   connectDB()
//   console.log("Server started on port 5001");
// })

export default app; // Export the Express app for potential use in other modules
