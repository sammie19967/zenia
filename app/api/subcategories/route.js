import { connectDB } from '@/lib/mongoose';
import Subcategory from '@/models/Subcategory';

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const subs = await Subcategory.find({ categoryId });
  return Response.json(subs);
}
