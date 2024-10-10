import { NextResponse } from 'next/server';
import Category from '@/models/Category';

// Fetch categories
export async function GET(request) {
  try {
    // Pagination and size handling
    const pno = parseInt(request.nextUrl.searchParams.get("pno")) || 1;
    const size = parseInt(request.nextUrl.searchParams.get("size")) || 3;
    const s = request.nextUrl.searchParams.get("s");

    let categories;

    if (s) {
      // Search handling
      categories = await Category.find({ name: { $regex: s, $options: 'i' } }) // Case-insensitive search
        .sort({ order: -1 })
        .skip((pno - 1) * size)
        .limit(size);
    } else {
      // Default: Return all categories with pagination
      categories = await Category.find()
        .sort({ order: -1 })
        .skip((pno - 1) * size)
        .limit(size);
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Create a new category
export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = new Category(body);
    await category.save();
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// Update an existing category
export async function PUT(request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body._id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(body._id, body, { new: true });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
