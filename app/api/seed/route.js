import { connectDB } from '@/lib/mongoose';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Brand from '@/models/Brand';

export async function GET() {
  await connectDB();

  await Category.deleteMany();
  await Subcategory.deleteMany();
  await Brand.deleteMany();

  const categoriesData = [
    {
      name: 'Electronics',
      subcategories: [
        { name: 'Smartphones', brands: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus'] },
        { name: 'Laptops', brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Apple'] },
        { name: 'Televisions', brands: ['Sony', 'LG', 'Samsung', 'TCL'] },
        { name: 'Audio Systems', brands: ['JBL', 'Sony', 'Bose', 'Marshall'] }
      ]
    },
    {
      name: 'Fashion',
      subcategories: [
        { name: "Men's Clothing", brands: ['Nike', 'Adidas', 'Zara', 'H&M'] },
        { name: "Women's Clothing", brands: ['Zara', 'H&M', 'Forever 21', 'Shein'] },
        { name: 'Watches', brands: ['Fossil', 'Casio', 'Rolex', 'Timex'] },
        { name: 'Shoes', brands: ['Nike', 'Adidas', 'Puma', 'Reebok'] }
      ]
    },
    {
      name: 'Home Appliances',
      subcategories: [
        { name: 'Refrigerators', brands: ['LG', 'Samsung', 'Whirlpool', 'Bosch'] },
        { name: 'Washing Machines', brands: ['LG', 'Samsung', 'Bosch', 'IFB'] },
        { name: 'Microwaves', brands: ['Panasonic', 'Samsung', 'LG', 'IFB'] }
      ]
    },
    {
      name: 'Beauty & Personal Care',
      subcategories: [
        { name: 'Skincare', brands: ['Nivea', 'Neutrogena', 'L\'Oreal', 'The Ordinary'] },
        { name: 'Haircare', brands: ['Dove', 'Pantene', 'Tresemme', 'L\'Oreal'] },
        { name: 'Fragrances', brands: ['Dior', 'Chanel', 'Gucci', 'Calvin Klein'] }
      ]
    },
    {
      name: 'Gaming',
      subcategories: [
        { name: 'Consoles', brands: ['Sony', 'Microsoft', 'Nintendo'] },
        { name: 'PC Gaming', brands: ['Alienware', 'MSI', 'Asus ROG', 'HP Omen'] },
        { name: 'Games', brands: ['EA', 'Ubisoft', 'Rockstar', 'Activision'] }
      ]
    },
    {
      name: 'Real Estate',
      subcategories: [
        { name: 'Apartments', brands: ['Local Agents', 'Verified Developers'] },
        { name: 'Land', brands: ['Land Agents', 'Realty Corp'] },
        { name: 'Houses', brands: ['Modern Homes Ltd', 'Build Africa'] }
      ]
    },
    {
      name: 'Vehicles',
      subcategories: [
        { name: 'Cars', brands: ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz'] },
        { name: 'Motorcycles', brands: ['Yamaha', 'Honda', 'KTM', 'Suzuki'] },
        { name: 'Trucks', brands: ['Isuzu', 'Tata', 'Ford', 'Scania'] }
      ]
    }
  ];

  for (const categoryData of categoriesData) {
    const category = await Category.create({ name: categoryData.name });

    for (const sub of categoryData.subcategories) {
      await Subcategory.create({ name: sub.name, categoryId: category._id });

      for (const brand of sub.brands) {
        const brandExists = await Brand.findOne({ name: brand, categoryId: category._id });
        if (!brandExists) {
          await Brand.create({ name: brand, categoryId: category._id });
        }
      }
    }
  }

  return Response.json({ message: 'Seeded successfully with extended data ✅' });
}
