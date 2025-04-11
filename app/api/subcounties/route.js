import { connectDB } from '@/lib/mongoose';
import Subcounty from '@/models/Subcounty';

export async function GET(req) {
  await connectDB();

  const url = new URL(req.url);
  const countyId = url.searchParams.get('countyId');

  if (!countyId) {
    return Response.json({ error: 'Missing countyId' }, { status: 400 });
  }

  const subcounties = await Subcounty.find({ countyId }).sort('name');

  return Response.json(subcounties);
}
