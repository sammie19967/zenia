import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose"; // You'll need to create this db connection utility
import Ad from "@/models/Ad"; // Import the Ad model you provided

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, description, price, negotiable, category, subcategory, customFields, location, brand, images, userId, contactInfo } = body;
    
    // Create a new ad
    const newAd = new Ad({
      title,
      description,
      price,
      negotiable,
      category,
      subcategory,
      customFields,
      location,
      brand,
      images,
      userId,
      contactInfo
    });
    
    await newAd.save();
    
    return NextResponse.json({ message: "Ad created successfully", ad: newAd }, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const county = searchParams.get("county");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const status = searchParams.get("status") || "pending";
    const paymentPlan = searchParams.get("paymentPlan");
    const limit = parseInt(searchParams.get("limit")) || 100;

    const query = { status };

    if (category) query.category = category;
    if (county) query["location.county"] = county;
    if (priceMin) query.price = { $gte: parseInt(priceMin) };
    if (priceMax) {
      if (query.price) {
        query.price.$lte = parseInt(priceMax);
      } else {
        query.price = { $lte: parseInt(priceMax) };
      }
    }

    if (paymentPlan) {
      // Case-insensitive match
      query.paymentPlan = { $regex: new RegExp(`^${paymentPlan}$`, "i") };
    }

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(ads); // remove the `{ ads }` wrapper for compatibility with your frontend
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
