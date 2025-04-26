import { connectDB } from '@/lib/mongoose';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();

    await Category.deleteMany();

    const categoriesData = [
      {
        name: "Automobiles",
        icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/vehicles.png",
        subcategories: [
          {
            name: "Buses",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/bus.png",
            brands: ["Isuzu", "Scania", "Mercedes-Benz"],
            customFields: ["fuelType", "seatingCapacity", "condition"]
          },
          {
            name: "Sedans & SUVs",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/car.png",
            brands: ["Toyota", "Nissan", "BMW", "Mercedes-Benz"],
            customFields: ["fuelType", "transmission", "condition"]
          },
          {
            name: "Heavy Duty",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/heavy_equipment.png",
            brands: ["Caterpillar", "Komatsu", "JCB"],
            customFields: ["fuelType", "operatingWeight", "condition"]
          },
          {
            name: "Motorcycles",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/motorbikes.png",
            brands: ["Honda", "Yamaha", "KTM"],
            customFields: ["engineCapacity", "fuelType", "condition"]
          },
          {
            name: "Haulers & Trailers",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/trailers.png",
            brands: ["Great Dane", "Utility", "Wabash"],
            customFields: ["axleCount", "length", "condition"]
          },
          {
            name: "Freight Trucks",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/trucks.png",
            brands: ["Kenworth", "Peterbilt", "Mack"],
            customFields: ["fuelType", "axleConfiguration", "condition"]
          },
          {
            name: "Watercraft",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/water_vehicles.png",
            brands: ["Yamaha", "Sea-Doo", "Bayliner"],
            customFields: ["engineType", "hullMaterial", "condition"]
          }
        ]
      },
      {
        name: "Tech & Devices",
        icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/electronics.png",
        subcategories: [
          {
            name: "Mobile & Tablets",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/phones.png",
            brands: ["Apple", "Samsung", "OnePlus"],
            customFields: ["storageCapacity", "RAM", "color", "condition"]
          },
          {
            name: "Printers & Scanners",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/printers.png",
            brands: ["HP", "Canon", "Epson"],
            customFields: ["type", "printingTechnology", "condition"]
          },
          {
            name: "Surveillance Systems",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/cctv.png",
            brands: ["Hikvision", "Dahua", "Ring"],
            customFields: ["cameraType", "resolution", "condition"]
          },
          {
            name: "TV & Screens",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/tv.png",
            brands: ["LG", "Samsung", "Sony"],
            customFields: ["screenSize", "resolution", "condition"]
          },
          {
            name: "Gaming Gear",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/gaming.png",
            brands: ["Sony", "Microsoft", "Nintendo"],
            customFields: ["consoleType", "storageCapacity", "condition"]
          },
          {
            name: "Smart Watches & Wearables",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/wearables.png",
            brands: ["Apple", "Samsung", "Garmin"],
            customFields: ["strapMaterial", "batteryLife", "condition"]
          },
          {
            name: "Laptops & Notebooks",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/laptops.png",
            brands: ["Apple", "Dell", "Lenovo"],
            customFields: ["RAM", "storageCapacity", "processor", "condition"]
          },
          {
            name: "Computer Accessories",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/computer_accessories.png",
            brands: ["Logitech", "Razer", "Corsair"],
            customFields: ["accessoryType", "connectivity", "condition"]
          },
          {
            name: "Networking Devices",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/networking.png",
            brands: ["TP-Link", "Netgear", "D-Link"],
            customFields: ["deviceType", "speed", "condition"]
          },
          {
            name: "Home Audio & Theater",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/audio.png",
            brands: ["Bose", "Sony", "JBL"],
            customFields: ["systemType", "powerOutput", "condition"]
          },
          {
            name: "Drones & Cameras",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/cameras.png",
            brands: ["DJI", "Canon", "Nikon"],
            customFields: ["cameraType", "resolution", "condition"]
          }
        ]
      },
      // Add other categories ("Properties", "Style & Trends", "Beauty & Care") similarly...
    ];

    // Create all categories in parallel
    const categoryPromises = categoriesData.map(async (categoryData) => {
      const createdCategory = await Category.create({
        name: categoryData.name,
        icon: categoryData.icon,
      });

      createdCategory.subcategories = categoryData.subcategories.map((subcategory) => ({
        name: subcategory.name,
        icon: subcategory.icon,
      }));

      await createdCategory.save();
    });

    await Promise.all(categoryPromises);

    return Response.json({ message: 'Seeded successfully with extended data ✅ (Fast Parallel Mode)' });

  } catch (error) {
    console.error('Seeding Error:', error);
    return new Response(JSON.stringify({ message: 'Seeding failed', error: error.message }), { status: 500 });
  }
}
