import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  await User.findOneAndUpdate({ email: session.user.email }, body);
  return Response.json({ success: true });
}
