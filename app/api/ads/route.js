import { connectDB } from '@/lib/mongoose';
import Ad from '@/models/Ad';

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const ad = await Ad.create(data);

  return Response.json({ message: 'Ad created successfully', ad });
}
