import { connectDB } from '@/lib/mongoose';
import Ad from '@/models/Ad';
import County from '@/models/County'; // ✅ Import it


// CREATE AD
export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const ad = await Ad.create(data);
  return Response.json({ message: 'Ad created successfully', ad });
}

// GET ADS WITH FILTER
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const categoryId = searchParams.get("categoryId");
  const countyId = searchParams.get("countyId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy");
  const packageType = searchParams.get("package");

  const filter = {};

  if (categoryId) filter.categoryId = categoryId;
  if (countyId) filter.countyId = countyId;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (packageType) filter.package = packageType; // ✅ Apply the package filter

  const sortOption = sortBy === "views" ? { views: -1 } : { createdAt: -1 };

  const ads = await Ad.find(filter)
  .populate('countyId', 'name')
  .populate('subcountyId', 'name')
  .sort(sortOption);

  return Response.json(ads);
}

// DELETE AD
export async function DELETE(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const adId = searchParams.get('adId');

  if (!adId) {
    return Response.json({ error: 'Missing adId' }, { status: 400 });
  }

  await Ad.findByIdAndDelete(adId);

  return Response.json({ message: 'Ad deleted successfully' });
}
