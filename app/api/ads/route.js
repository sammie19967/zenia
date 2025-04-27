// app/api/ads/route.js

import { NextResponse } from 'next/server';
import Ad from '@/models/Ad';
import connectDB from '@/lib/mongoose';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newAd = new Ad({
      category: body.category,
      subcategory: body.subcategory,
      title: body.title,
      description: body.description,
      user: body.user,
      brand: body.brand,
      customFields: body.customFields,
      images: body.images,
      video: body.video || null,
      location: {
        county: body.location.county,
        subcounty: body.location.subcounty,
      },
    });

    const savedAd = await newAd.save();

    return NextResponse.json({ success: true, data: savedAd }, { status: 201 });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json({ success: false, message: 'Failed to create ad' }, { status: 500 });
  }
}
