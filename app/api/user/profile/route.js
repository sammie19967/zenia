import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Ad from "@/models/Ad";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  const ads = await Ad.find({ userId: user._id });

  return Response.json({ user, ads });
}
