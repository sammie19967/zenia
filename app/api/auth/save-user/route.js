import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose"; // Your MongoDB connection function
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const user = await User.findOneAndUpdate(
      { uid: body.uid },
      { $set: body },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
