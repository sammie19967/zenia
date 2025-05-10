import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose"; // You'll need to create this db connection utility
import Ad from "@/models/Ad"; // Import the Ad model you provided

export async function GET(request) {
  try {
    await connectDB();
    
    // Get URL search params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const county = searchParams.get("county");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const status = searchParams.get("status") || "active";
    
    // Build query
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
    
    // Fetch ads
    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .limit(100) // Limit to prevent too many results
      .lean();
    
    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}