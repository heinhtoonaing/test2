import Product from "@/models/Product";
import { NextResponse } from 'next/server';

// Fetch a single product by ID and populate category
export async function GET(request, { params }) {
  try {
    const id = params.id;

    // Log the id to check if it's being passed correctly
    console.log("Fetching product with ID:", id);

    // Check if the ID is valid ObjectId before querying
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Check the product count for debugging purposes
    const productCount = await Product.countDocuments();
    console.log("Total number of products in the collection:", productCount);

    const product = await Product.findById(id).populate("category");

    if (!product) {
      console.log("Product not found with ID:", id);  // Log if product is missing
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
