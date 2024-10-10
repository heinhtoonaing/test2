// app/api/category/[id]/route.js
import { NextResponse } from 'next/server';
import Category from '@/models/Category';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}
