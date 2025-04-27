// app/api/categories/route.js

import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import connectDB from '@/lib/mongoose';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({}).lean();

    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
  }
}
