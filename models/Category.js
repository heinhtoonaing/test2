import mongoose from "mongoose";

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0, // Optional: Set a default value for order if needed
  },
});

// Create the Category model
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
