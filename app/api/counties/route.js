import { NextResponse } from 'next/server';
import County from '@/models/County'; // assuming you have a County model
import {connectDB} from '@/lib/mongoose'; // to connect to MongoDB  

export async function GET() {
  try {
    await connectDB();
    const counties = await County.find().lean();
    return NextResponse.json(counties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch counties' }, { status: 500 });
  }
}
