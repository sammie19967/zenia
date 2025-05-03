import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Ad from "@/models/Ad";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/authOptions"; // Adjust the path as necessary

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get the session to authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }

    // Parse the request body
    const data = await request.json();
    
    // Create the ad with the user ID from the session
    const ad = await Ad.create({
      ...data,
      userId: session.user.id,  // Associate the ad with the logged-in user
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
export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters from the URL
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const subcategory = url.searchParams.get("subcategory");
    const county = url.searchParams.get("county");
    const subcounty = url.searchParams.get("subcounty");
    
    // Build the filter object for the ads query
    const filter = { status: "active" }; // Default to only active ads
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (county) filter["location.county"] = county;
    if (subcounty) filter["location.subcounty"] = subcounty;
    
    // Query the database with the filters
    const ads = await Ad.find(filter)
      .sort({ createdAt: -1 })  // Sort by the most recent ad first
      .limit(50);  // Limit to 50 ads for pagination
    
    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads", details: error.message },
      { status: 500 }
    );
  }
}

