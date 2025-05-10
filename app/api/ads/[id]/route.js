// app/api/ads/[id]/route.js
import { connectDB } from "@/lib/mongoose";
import Ad from "@/models/Ad";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;

  await connectDB();

  try {
    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ad" },
      { status: 500 }
    );
  }
}