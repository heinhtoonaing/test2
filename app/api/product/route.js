import { NextResponse } from 'next/server';
import Product from '@/models/Product';

// Fetch all products
export async function GET() {
  try {
    const product = await Product.findById(id);  // Without populate

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    // Basic validation
    if (!body.code || !body.name || !body.description || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = new Product(body);
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// Update an existing product (replace)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    // Basic validation
    if (!updateData.code && !updateData.name && !updateData.description && !updateData.price) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Partially update an existing product
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to partially update product' }, { status: 500 });
  }
}

// Delete a product by ID
export async function DELETE(request, { params }) {
  const { id } = params; // Extract ID from the URL parameters

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
