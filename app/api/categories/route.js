import { NextResponse } from 'next/server';
import Category from '@/models/Category'; // assuming you have a Category model
import connectDB from '@/utils/db'; // a file to connect to MongoDB

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().lean();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
