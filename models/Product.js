import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", // Ensure the reference matches the model name
    default: null // Set default to null if no category is assigned
  },
});

// Create the Product model
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
