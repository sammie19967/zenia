"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ChevronDown } from "lucide-react";

// Fetch ads from the database
async function fetchAds() {
  try {
    const response = await fetch("/api/ads");
    if (!response.ok) {
      throw new Error("Failed to fetch ads");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching ads:", error);
    return { ads: [] };
  }
}

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    county: "",
    priceMin: "",
    priceMax: "",
    status: "active",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getAds = async () => {
      setLoading(true);
      try {
        const data = await fetchAds();
        setAds(data.ads || []);
        setError(null);
      } catch (err) {
        setError("Failed to load ads. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAds();
  }, []);

  const filteredAds = ads.filter((ad) => {
    // Filter by category
    if (filters.category && ad.category !== filters.category) return false;
    
    // Filter by location (county)
    if (filters.county && ad.location.county !== filters.county) return false;
    
    // Filter by price range
    if (filters.priceMin && ad.price < parseInt(filters.priceMin)) return false;
    if (filters.priceMax && ad.price > parseInt(filters.priceMax)) return false;
    
    // Filter by status
    if (filters.status && ad.status !== filters.status) return false;
    
    return true;
  });

  // Get unique categories and counties for filter options
  const categories = [...new Set(ads.map(ad => ad.category))];
  const counties = [...new Set(ads.map(ad => ad.location.county))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold">Loading ads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse All Ads</h1>
      
      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search ads..."
              className="w-full p-3 border rounded-lg pl-10"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          
          <button 
            onClick={toggleFilters}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  name="category" 
                  value={filters.category} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">County</label>
                <select 
                  name="county" 
                  value={filters.county} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Counties</option>
                  {counties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">{filteredAds.length} ads found</p>
      </div>
      
      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No ads match your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <Link href={`/ads/${ad._id}`} key={ad._id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {ad.images && ad.images.length > 0 ? (
                    <Image
                      src={ad.images[0]}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  {ad.paymentPlan !== "Free Ad" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {ad.paymentPlan === "Premium Ad" ? "Premium" : "Featured"}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1">{ad.title}</h3>
                    <p className="font-bold text-blue-600">KSh {ad.price.toLocaleString()}</p>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-1">
                    {ad.location.town}, {ad.location.county}
                  </p>
                  
                  <p className="text-gray-600 mt-2 line-clamp-2">{ad.description}</p>
                  
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <p>{new Date(ad.createdAt).toLocaleDateString()}</p>
                    <p>{ad.views} views</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}