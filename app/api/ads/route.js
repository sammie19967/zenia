// app/api/ads/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Ad from "@/models/Ad";
import { getServerSession } from "next-auth/next";
//import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get the session to authenticate the user
    // const session = await getServerSession(authOptions);
    //if (!session || !session.user) {
    //  return NextResponse.json(
    //    { error: "Unauthorized: You must be logged in" },
    //    { status: 401 }
    //  );
    //} */

    // Parse the request body
    const data = await request.json();
    
    // Create the ad with user ID from session
    const ad = await Ad.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(
      { message: "Ad created successfully", ad },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const subcategory = url.searchParams.get("subcategory");
    const county = url.searchParams.get("county");
    const subcounty = url.searchParams.get("subcounty");
    
    // Build filter object
    const filter = { status: "active" };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (county) filter["location.county"] = county;
    if (subcounty) filter["location.subcounty"] = subcounty;
    
    // Query the database
    const ads = await Ad.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads", details: error.message },
      { status: 500 }
    );
  }
}