// app/api/ads/[id]/route.js
import { connectDB } from "@/lib/mongoose";
import Ad from "@/models/Ad";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const ad = await Ad.findById(params.id);

  if (!ad) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }

  return NextResponse.json(ad);
}
