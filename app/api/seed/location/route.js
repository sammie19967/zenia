import { connectDB } from '@/lib/mongoose';
import County from '@/models/County';
import Subcounty from '@/models/Subcounty';

export async function GET() {
  await connectDB();

  await County.deleteMany();
  await Subcounty.deleteMany();

  const locationData = [
    {
      name: 'Nairobi',
      subcounties: ['Westlands', 'Langata', 'Embakasi', 'Starehe', 'Kasarani']
    },
    {
      name: 'Mombasa',
      subcounties: ['Mvita', 'Changamwe', 'Kisauni', 'Likoni']
    },
    {
      name: 'Kisumu',
      subcounties: ['Kisumu East', 'Kisumu West', 'Nyando']
    },
    {
      name: 'Nakuru',
      subcounties: ['Nakuru Town East', 'Nakuru Town West', 'Naivasha', 'Rongai']
    },
    {
      name: 'Kiambu',
      subcounties: ['Thika Town', 'Ruiru', 'Githunguri', 'Limuru']
    },
    {
      name: 'Uasin Gishu',
      subcounties: ['Eldoret East', 'Eldoret West', 'Soy', 'Turbo']
    },
    {
      name: 'Machakos',
      subcounties: ['Machakos Town', 'Kangundo', 'Mwala', 'Mavoko']
    },
    {
      name: 'Meru',
      subcounties: ['Imenti North', 'Imenti South', 'Buuri']
    },
    {
      name: 'Kakamega',
      subcounties: ['Lurambi', 'Malava', 'Mumias East', 'Mumias West']
    },
    {
      name: 'Garissa',
      subcounties: ['Dadaab', 'Garissa Township', 'Balambala']
    }
  ];

  for (const countyData of locationData) {
    const county = await County.create({ name: countyData.name });

    for (const sub of countyData.subcounties) {
      await Subcounty.create({ name: sub, countyId: county._id });
    }
  }

  return Response.json({ message: 'Seeded counties and subcounties ✅' });
}
