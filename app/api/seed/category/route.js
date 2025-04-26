import { connectDB } from '@/lib/mongoose';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany();

    const categoriesData = [
      {
        name: "Tech & Devices",
        icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/electronics.png",
        subcategories: [
          {
            name: "Mobile & Tablets",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/phones.png",
            brands: ["Apple", "Samsung", "Tecno", "Infinix", "Huawei", "Oppo", "Nokia"],
            customFields: {
              storageCapacity: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
              RAM: ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB"],
              color: ["Black", "White", "Blue", "Red", "Gold", "Silver", "Green"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              screenSize: ["Below 5\"", "5-6\"", "6-7\"", "Above 7\""],
              os: ["Android", "iOS", "Other"],
            },
          },
          {
            name: "Printers & Scanners",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/printers.png",
            brands: ["HP", "Canon", "Epson", "Brother", "Xerox"],
            customFields: {
              type: ["Inkjet", "Laser", "All-in-One", "Dot Matrix", "Photo Printer"],
              connectivity: ["USB", "Wi-Fi", "Ethernet", "Bluetooth", "All"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              functionality: ["Print Only", "Print & Scan", "Print, Scan & Copy", "Multifunction"],
            },
          },
          {
            name: "Surveillance Systems",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/cctv.png",
            brands: ["Hikvision", "Dahua", "CP Plus", "Honeywell", "Axis"],
            customFields: {
              cameraType: ["Dome", "Bullet", "PTZ", "Hidden", "IP Camera"],
              resolution: ["720p", "1080p", "2K", "4K", "5MP", "8MP"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              features: ["Night Vision", "Weatherproof", "Motion Detection", "Audio", "AI Detection"],
            },
          },
          {
            name: "TV & Screens",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/tv.png",
            brands: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Skyworth"],
            customFields: {
              screenSize: ["24\" & Below", "25-32\"", "33-42\"", "43-50\"", "51-60\"", "61\" & Above"],
              resolution: ["HD", "Full HD", "4K UHD", "8K UHD", "OLED", "QLED"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              smartFeatures: ["Basic Smart TV", "Android TV", "WebOS", "Roku", "None"],
            },
          },
          {
            name: "Gaming Gear",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/gaming.png",
            brands: ["Sony", "Microsoft", "Nintendo", "Razer", "Logitech G"],
            customFields: {
              consoleType: ["PlayStation", "Xbox", "Nintendo Switch", "Gaming PC", "Handheld"],
              storageCapacity: ["250GB", "500GB", "1TB", "2TB", "Custom"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              includedAccessories: ["Controller", "VR Headset", "Games", "Charger", "None"],
            },
          },
          {
            name: "Smart Watches & Wearables",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/wearables.png",
            brands: ["Apple", "Samsung", "Huawei", "Xiaomi", "Fitbit", "Garmin"],
            customFields: {
              screenSize: ["Small (38-40mm)", "Medium (41-43mm)", "Large (44mm & above)"],
              batteryLife: ["<1 day", "1-3 days", "4-7 days", "1-2 weeks", ">2 weeks"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              features: ["Heart Rate", "GPS", "Waterproof", "Sleep Tracking", "NFC Payments"],
            },
          },
          {
            name: "Laptops & Notebooks",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/laptops.png",
            brands: ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "Toshiba"],
            customFields: {
              storageCapacity: ["128GB", "256GB", "512GB", "1TB", "2TB", "HDD", "SSD"],
              RAM: ["4GB", "8GB", "16GB", "32GB", "64GB"],
              processor: ["Intel i3", "Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "M1", "M2"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              screenSize: ["11-12\"", "13-14\"", "15-16\"", "17\" & above"],
              gpu: ["Integrated", "NVIDIA", "AMD", "None"],
            },
          },
          {
            name: "Computer Accessories",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/computer_accessories.png",
            brands: ["Logitech", "HP", "Dell", "Microsoft", "Corsair", "Samsung"],
            customFields: {
              accessoryType: ["Keyboard", "Mouse", "Monitor", "Webcam", "External Storage", "UPS", "Speaker"],
              compatibility: ["Windows", "Mac", "Universal", "Linux", "Gaming"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              connectivity: ["Wired", "Wireless", "Bluetooth", "USB", "All"],
            },
          },
          {
            name: "Networking Devices",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/networking.png",
            brands: ["TP-Link", "Netgear", "Huawei", "D-Link", "MikroTik", "Ubiquiti"],
            customFields: {
              deviceType: ["Router", "Modem", "Switch", "Access Point", "Range Extender", "Mesh System"],
              speed: ["Up to 100Mbps", "Up to 300Mbps", "Up to 1Gbps", "Above 1Gbps"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              bands: ["2.4GHz", "5GHz", "Dual Band", "Tri Band"],
            },
          },
          {
            name: "Home Audio & Theater",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/audio.png",
            brands: ["Sony", "Bose", "LG", "Samsung", "JBL", "Harman Kardon"],
            customFields: {
              audioType: ["Soundbar", "Home Theater", "Bookshelf Speakers", "Tower Speakers", "Portable Speaker"],
              powerOutput: ["<50W", "50-100W", "100-200W", "200-500W", "500W+"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              connectivity: ["Bluetooth", "Wi-Fi", "Aux", "HDMI", "Optical", "All"],
            },
          },
          {
            name: "Drones & Cameras",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/cameras.png",
            brands: ["DJI", "Canon", "Nikon", "Sony", "Fujifilm", "Kodak"],
            customFields: {
              cameraType: ["DSLR", "Mirrorless", "Point & Shoot", "Action Cam", "Drone"],
              resolution: ["12MP", "16MP", "20MP", "24MP", "30MP+", "4K Video", "1080p"],
              condition: ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"],
              features: ["Zoom Lens", "Stabilization", "Waterproof", "Night Vision", "GPS"],
            },
          },
        ],
      },
      {
        name: "Automobiles",
        icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/vehicles.png",
        subcategories: [
          {
            name: "Buses",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/bus.png",
            brands: ["Toyota", "Nissan", "Isuzu", "Hino", "Scania", "Volvo", "MAN"],
            customFields: {
              type: ["Mini Bus (14-25 seats)", "Shuttle (26-35 seats)", "Large Bus (36+ seats)", "School Bus", "Tourist Bus"],
              fuelType: ["Diesel", "Petrol", "Electric", "Hybrid"],
              transmission: ["Manual", "Automatic"],
              condition: ["Brand New", "Foreign Used", "Locally Used - Excellent", "Locally Used - Good", "Needs Repair"],
              mileage: ["0-50,000 km", "50,001-100,000 km", "100,001-200,000 km", "200,000+ km"],
              year: ["2020-2024", "2015-2019", "2010-2014", "2005-2009", "2000-2004", "Pre-2000"],
            },
          },
          {
            name: "Sedans & SUVs",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/car.png",
            brands: ["Toyota", "Subaru", "Nissan", "Mitsubishi", "Honda", "Mazda", "Mercedes", "BMW", "Land Rover"],
            customFields: {
              type: ["Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible"],
              fuelType: ["Petrol", "Diesel", "Hybrid", "Electric"],
              transmission: ["Manual", "Automatic", "CVT"],
              condition: ["Brand New", "Foreign Used", "Locally Used - Excellent", "Locally Used - Good", "Needs Repair"],
              mileage: ["0-20,000 km", "20,001-50,000 km", "50,001-100,000 km", "100,000+ km"],
              year: ["2020-2024", "2015-2019", "2010-2014", "2005-2009", "Pre-2005"],
              engineSize: ["Below 1000cc", "1000-1500cc", "1501-2000cc", "2001-3000cc", "3000cc+"],
            },
          },
          {
            name: "Motorcycles & Scooters",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/motorcycle.png",
            brands: ["Yamaha", "Honda", "Suzuki", "Kawasaki", "Harley-Davidson", "Ducati"],
            customFields: {
              type: ["Cruiser", "Sport", "Touring", "Standard", "Dirt", "Electric"],
              fuelType: ["Petrol", "Electric"],
              transmission: ["Manual", "Automatic"],
              condition: ["Brand New", "Foreign Used", "Locally Used - Excellent", "Locally Used - Good", "Needs Repair"],
              mileage: ["0-5,000 km", "5,001-10,000 km", "10,001-20,000 km", "20,000+ km"],
              year: ["2020-2024", "2015-2019", "2010-2014", "2005-2009", "Pre-2005"],
              engineSize: ["Below 150cc", "150-300cc", "301-600cc", "601-1000cc", "1000cc+"],
            },
          },
          {
            name: "Bicycles",
            icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/bicycle.png",
            brands: ["Giant", "Trek", "Specialized", "Cannondale", "Bianchi", "Scott"],
            customFields: {
              type: ["Road", "Mountain", "Hybrid", "Electric", "Folding", "Cruiser"],
              frameSize: ["Small", "Medium", "Large", "X-Large"],
              wheelSize: ["26\"", "27.5\"", "29\"", "700c"],
              condition: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
              gears: ["1-7", "8-14", "15-21", "22-27", "28+"],
              color: ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Orange"],
            },
          },
        ],
      },
      {
        "name": "Properties",
        "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/real_estate.png",
        "subcategories": [
          {
            "name": "Shops for Rent",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/commercial_rent.png",
            "customFields": {
              "size": ["Under 50 sqm", "50-100 sqm", "100-200 sqm", "200-500 sqm", "500+ sqm"],
              "priceRange": ["Under KSh 20k", "KSh 20k-50k", "KSh 50k-100k", "KSh 100k-200k", "KSh 200k+"],
              "type": ["Standalone", "Shopping Mall", "Strip Mall", "Market Stall", "Kiosk", "Office Suite"],
              "amenities": ["Parking", "24/7 Security", "Staff Toilets", "Loading Bay", "AC", "Backup Generator"],
              "leaseTerms": ["Monthly", "Quarterly", "Yearly", "3+ Years"],
              "accessibility": ["Ground Floor", "First Floor", "Basement", "Upper Floors"]
            }
          },
          {
            "name": "Shops for Lease",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/commercial_lease.png",
            "customFields": {
              "size": ["Under 50 sqm", "50-100 sqm", "100-200 sqm", "200-500 sqm", "500+ sqm"],
              "leaseDuration": ["1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"],
              "type": ["Standalone", "Shopping Mall", "Strip Mall", "Market Stall", "Kiosk"],
              "amenities": ["Parking", "CCTV", "Toilets", "Loading Bay", "AC", "Elevator"],
              "priceRange": ["Under KSh 50k", "KSh 50k-100k", "KSh 100k-200k", "KSh 200k-500k", "KSh 500k+"],
              "businessType": ["Any", "Retail Only", "Office Only", "Food Service", "Medical"]
            }
          },
          {
            "name": "Event Spaces",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/event_venues.png",
            "customFields": {
              "capacity": ["Under 50", "50-100", "100-200", "200-500", "500+"],
              "type": ["Hotel Ballroom", "Garden", "Conference Hall", "Rooftop", "Beachfront", "Community Hall"],
              "amenities": ["In-house Catering", "Audio-Visual", "Furniture", "Dedicated Parking", "AC", "Outdoor Space"],
              "priceRange": ["Under KSh 20k", "KSh 20k-50k", "KSh 50k-100k", "KSh 100k-200k", "KSh 200k+"],
              "bookingType": ["Hourly", "Daily", "Weekly", "Wedding Package"],
              "timeAvailability": ["Weekdays Only", "Weekends Only", "24/7 Booking"]
            }
          },
          {
            "name": "Homes for Rent",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/house_rent.png",
            "customFields": {
              "type": ["Apartment", "Bungalow", "Maisonette", "Townhouse", "Serviced Apartment", "Single Room"],
              "bedrooms": ["Bedsitter", "1", "2", "3", "4", "5+"],
              "bathrooms": ["Shared", "1", "2", "3", "4+"],
              "priceRange": ["Under KSh 15k", "KSh 15k-30k", "KSh 30k-50k", "KSh 50k-100k", "KSh 100k+"],
              "amenities": ["Gated Community", "Parking", "Garden", "Swimming Pool", "24hr Security", "Furnished", "DSL Ready"],
              "leaseTerms": ["Monthly", "Quarterly", "Yearly", "Short-Term (<6 months)"],
              "targetTenants": ["Families", "Students", "Working Professionals", "Expats"]
            }
          },
          {
            "name": "Homes for Sale",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/house_sale.png",
            "customFields": {
              "type": ["Apartment", "Bungalow", "Maisonette", "Townhouse", "Villa", "Standalone House"],
              "bedrooms": ["1", "2", "3", "4", "5+"],
              "bathrooms": ["1", "2", "3", "4+"],
              "priceRange": ["Under KSh 5M", "KSh 5M-10M", "KSh 10M-20M", "KSh 20M-50M", "KSh 50M+"],
              "amenities": ["Gated Community", "Parking", "Garden", "Pool", "CCTV", "Solar Water Heating"],
              "propertyAge": ["New", "1-5 Years", "5-10 Years", "10-20 Years", "20+ Years"],
              "paymentPlan": ["Cash", "Mortgage", "Installments", "Rent-to-Own"]
            }
          },
          {
            "name": "Plots for Sale",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/plot_sale.png",
            "customFields": {
              "size": ["1/8 Acre", "1/4 Acre", "1/2 Acre", "1 Acre", "2-5 Acres", "5+ Acres"],
              "priceRange": ["Under KSh 1M", "KSh 1M-5M", "KSh 5M-10M", "KSh 10M-20M", "KSh 20M+"],
              "zoning": ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed Use"],
              "titleType": ["Freehold", "Leasehold", "Absolute", "Group Ranch", "Sectional"],
              "infrastructure": ["Tarmac Road", "Gravel Road", "Water", "Electricity", "Undeveloped"],
              "terrain": ["Flat", "Sloped", "Hilly", "Riverside"]
            }
          },
          {
            "name": "Plots for Lease",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/plot_rent.png",
            "customFields": {
              "size": ["1/8 Acre", "1/4 Acre", "1/2 Acre", "1 Acre", "2-5 Acres", "5+ Acres"],
              "leaseDuration": ["1-5 Years", "5-10 Years", "10-25 Years", "25-50 Years", "99 Years"],
              "priceRange": ["Under KSh 50k", "KSh 50k-100k", "KSh 100k-200k", "KSh 200k-500k", "KSh 500k+"],
              "zoning": ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed Use"],
              "allowedUse": ["Residential", "Retail", "Farming", "Warehousing", "Any"],
              "access": ["Main Road", "Access Road", "Off-Main", "Gated Area"]
            }
          }
        ]
      },
      {
        "name": "Style & Trends",
        "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/fashion.png",
        "subcategories": [
          {
            "name": "Men’s Apparel",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/men.png",
            "brands": ["Hugo Boss", "Zara", "Adidas", "Polo Ralph Lauren", "Gucci", "Local Designers"],
            "customFields": {
              "type": ["T-Shirts", "Shirts", "Jeans", "Suits", "Shorts", "Jackets", "Traditional Wear"],
              "size": ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Custom"],
              "color": ["Black", "White", "Blue", "Grey", "Brown", "Green", "Multi-color"],
              "material": ["Cotton", "Polyester", "Denim", "Linen", "Wool", "Silk"],
              "condition": ["New with Tags", "New without Tags", "Used - Like New", "Used - Good", "Used - Fair"],
              "style": ["Casual", "Formal", "Sports", "Streetwear", "Business Casual"]
            }
          },
          {
            "name": "Women’s Fashion",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/women.png",
            "brands": ["Zara", "H&M", "Forever 21", "Mango", "Local Designers", "Kitenge Styles"],
            "customFields": {
              "type": ["Dresses", "Blouses", "Skirts", "Jeans", "Jumpsuits", "Traditional Wear", "Kitenge"],
              "size": ["XS", "S", "M", "L", "XL", "XXL", "Plus Size", "Custom"],
              "color": ["Black", "White", "Red", "Blue", "Yellow", "Pink", "Multi-color"],
              "material": ["Cotton", "Polyester", "Silk", "Chiffon", "Lace", "Kitenge Fabric"],
              "condition": ["New with Tags", "New without Tags", "Used - Like New", "Used - Good", "Used - Fair"],
              "occasion": ["Everyday", "Office", "Party", "Wedding", "Casual", "Formal"]
            }
          },
          {
            "name": "Shoes & Sneakers",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/shoes.png",
            "brands": ["Nike", "Adidas", "Puma", "Gucci", "Timberland", "Local Artisans"],
            "customFields": {
              "type": ["Sneakers", "Loafers", "Sandals", "Boots", "Formal Shoes", "Athletic"],
              "size": ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45+"],
              "color": ["Black", "White", "Brown", "Blue", "Red", "Multi-color"],
              "material": ["Leather", "Synthetic", "Canvas", "Rubber", "Suede"],
              "condition": ["New", "Used - Like New", "Used - Good", "Used - Fair"],
              "gender": ["Men", "Women", "Unisex"]
            }
          },
          {
            "name": "Jewelry & Watches",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/jewelry.png",
            "brands": ["Rolex", "Casio", "Michael Kors", "Local Artisans", "Swarovski", "Tag Heuer"],
            "customFields": {
              "type": ["Necklaces", "Bracelets", "Earrings", "Rings", "Watches", "Anklets"],
              "material": ["Gold", "Silver", "Platinum", "Stainless Steel", "Beads", "Diamond"],
              "condition": ["New", "Used - Like New", "Used - Good", "Vintage"],
              "authenticity": ["Original", "First Copy", "Local Design", "Vintage"],
              "gender": ["Men", "Women", "Unisex"]
            }
          },
          {
            "name": "Kids Wear",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/kids.png",
            "brands": ["Carters", "Gap Kids", "H&M Kids", "Local Brands", "Nike Kids", "Adidas Kids"],
            "customFields": {
              "type": ["T-Shirts", "Dresses", "Shorts", "School Uniforms", "Traditional Wear"],
              "size": ["Newborn", "3-6 months", "6-12 months", "1-2 Years", "3-4 Years", "5-6 Years", "7-8 Years", "9-10 Years"],
              "color": ["Pink", "Blue", "White", "Red", "Yellow", "Multi-color"],
              "material": ["Cotton", "Polyester", "Denim", "Fleece"],
              "condition": ["New with Tags", "New without Tags", "Used - Like New", "Used - Good"],
              "gender": ["Boys", "Girls", "Unisex"]
            }
          },
          {
            "name": "Bags & Backpacks",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/bags.png",
            "brands": ["Gucci", "Louis Vuitton", "Kipling", "Local Designers", "Nike", "Adidas"],
            "customFields": {
              "type": ["Handbags", "Backpacks", "Laptop Bags", "Clutches", "Travel Bags", "Waist Bags"],
              "size": ["Small", "Medium", "Large", "Extra Large"],
              "color": ["Black", "Brown", "Blue", "Red", "Multi-color"],
              "material": ["Leather", "Canvas", "Synthetic", "Denim"],
              "condition": ["New", "Used - Like New", "Used - Good", "Used - Fair"],
              "features": ["Waterproof", "Anti-theft", "Multiple Pockets", "USB Charging Port"]
            }
          },
          {
            "name": "Lingerie & Nightwear",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/lingerie.png",
            "brands": ["Victoria's Secret", "La Senza", "Local Brands", "H&M", "Calvin Klein"],
            "customFields": {
              "type": ["Bras", "Panties", "Night Dresses", "Pajamas", "Shapewear", "Robes"],
              "size": ["XS", "S", "M", "L", "XL", "XXL", "Plus Size"],
              "color": ["Black", "White", "Red", "Pink", "Nude", "Multi-color"],
              "material": ["Cotton", "Silk", "Lace", "Satin", "Mesh"],
              "condition": ["New with Tags", "New without Tags", "Used - Like New"],
              "features": ["Wirefree", "Padded", "Seamless", "Adjustable"]
            }
          }
        ]
      },
      {
        "name": "Beauty & Care",
        "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/beauty.png",
        "subcategories": [
          {
            "name": "Skincare Essentials",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/skincare.png",
            "brands": ["Nivea", "CeraVe", "The Ordinary", "Local Brands", "L'Oreal", "Vaseline"],
            "customFields": {
              "type": ["Cleanser", "Moisturizer", "Sunscreen", "Toner", "Serum", "Face Mask", "Dark Spot Corrector"],
              "skinType": ["All Skin Types", "Oily", "Dry", "Combination", "Sensitive", "Acne-Prone"],
              "size": ["Travel Size", "50ml", "100ml", "200ml", "500ml", "1L+"],
              "keyIngredients": ["Hyaluronic Acid", "Vitamin C", "Retinol", "Shea Butter", "Aloe Vera", "Tea Tree Oil"],
              "condition": ["New", "Unopened", "Opened - Like New", "Used - Partial"],
              "origin": ["International", "Local Kenyan", "Organic"]
            }
          },
          {
            "name": "Makeup Kits",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/makeup.png",
            "brands": ["Maybelline", "MAC", "Fenty Beauty", "Black Opal", "Local Brands", "NYX"],
            "customFields": {
              "type": ["Foundation", "Lipstick", "Eyeshadow Palette", "Mascara", "Concealer", "Makeup Set"],
              "shadeRange": ["Fair", "Light", "Medium", "Tan", "Deep", "Dark"],
              "formulation": ["Liquid", "Cream", "Powder", "Stick", "Mineral"],
              "condition": ["New", "Swatched Only", "Lightly Used", "Used"],
              "crueltyFree": ["Yes", "No", "Vegan"],
              "coverage": ["Sheer", "Medium", "Full"]
            }
          },
          {
            "name": "Hair Products",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/hair.png",
            "brands": ["Dark & Lovely", "Cantu", "Shea Moisture", "African Pride", "Local Brands", "Olaplex"],
            "customFields": {
              "type": ["Shampoo", "Conditioner", "Hair Oil", "Relaxer", "Braiding Hair", "Wig", "Hair Growth Serum"],
              "hairType": ["Natural", "Relaxed", "Braids", "Locs", "Wavy", "Curly", "Coily"],
              "size": ["50ml", "100ml", "250ml", "500ml", "1L+"],
              "keyBenefits": ["Moisturizing", "Strengthening", "Growth", "Damage Repair", "Color Protection"],
              "condition": ["New", "Unopened", "Opened - Like New", "Used - Partial"],
              "texture": ["Cream", "Oil", "Spray", "Gel", "Butter"]
            }
          },
          {
            "name": "Fragrances",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/fragrance.png",
            "brands": ["Chanel", "Dior", "Calvin Klein", "Local Scents", "Jovan", "Victoria's Secret"],
            "customFields": {
              "type": ["Eau de Parfum", "Eau de Toilette", "Body Spray", "Perfume Oil", "Roll-On"],
              "scentFamily": ["Floral", "Woody", "Citrus", "Oriental", "Fresh", "Spicy"],
              "size": ["30ml", "50ml", "100ml", "200ml", "Travel Size"],
              "intensity": ["Light", "Moderate", "Strong", "Long-Lasting"],
              "condition": ["New", "Tested Once", "Used - Partial"],
              "gender": ["Men", "Women", "Unisex"]
            }
          },
          {
            "name": "Personal Hygiene",
            "icon": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home/category-icons/hygiene.png",
            "brands": ["Dettol", "Colgate", "Always", "Gillette", "Local Brands", "Nivea"],
            "customFields": {
              "type": ["Soap", "Deodorant", "Toothpaste", "Sanitary Pads", "Razors", "Shaving Cream", "Hand Sanitizer"],
              "size": ["Travel Size", "50ml", "100ml", "200ml", "Family Pack"],
              "formulation": ["Bar", "Liquid", "Gel", "Spray", "Roll-On"],
              "condition": ["New", "Unopened", "Opened - Unused"],
              "specialFeatures": ["Antibacterial", "Sensitive Skin", "Fragrance-Free", "Whitening"],
              "quantity": ["Single", "2-5 Pack", "6-10 Pack", "Bulk"]
            }
          }
        ]
      }
      
    ];

    // Create all categories in parallel
    const categoryPromises = categoriesData.map(async (categoryData) => {
      // Create the main category
      const createdCategory = await Category.create({
        name: categoryData.name,
        icon: categoryData.icon,
        subcategories: categoryData.subcategories.map((subcategory) => ({
          name: subcategory.name,
          icon: subcategory.icon,
          brands: subcategory.brands,
          customFields: subcategory.customFields,
        })),
      });

      // Save the category with subcategories
      await createdCategory.save();
    });

    // Wait for all categories to be created
    await Promise.all(categoryPromises);

    return new Response(JSON.stringify({ message: "Categories seeded successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return new Response(JSON.stringify({ error: "Failed to seed categories" }), {
      status: 500,
    });
  }
}
