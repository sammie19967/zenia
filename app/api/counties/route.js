import { connectDB } from '@/lib/mongoose';
import County from '@/models/County';

export async function GET() {
  await connectDB();

  const counties = await County.find().sort('name');

  return Response.json(counties);
}
