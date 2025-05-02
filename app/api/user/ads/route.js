import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions"; // We'll extract this from nextauth route
import { connectDB } from "@/lib/mongoose";
import Ad from "@/models/Ad";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    const ads = await Ad.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return Response.json(ads);
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}
