import { connectDB } from '@/lib/mongoose';
import Brand from '@/models/Brand';

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const brands = await Brand.find({ categoryId });
  return Response.json(brands);
}
