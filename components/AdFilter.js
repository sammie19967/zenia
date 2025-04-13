"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Search, Filter, ChevronDown, ChevronUp, Sliders } from "lucide-react";

export default function AdFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [counties, setCounties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    price: true,
    sort: true
  });
  const [filters, setFilters] = useState({
    categoryId: "",
    subcategoryId: "",
    countyId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "latest",
  });
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, countyRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/counties"),
        ]);

        const [catData, countyData] = await Promise.all([
          catRes.json(),
          countyRes.json(),
        ]);

        setCategories(catData);
        setCounties(countyData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Fetch subcategories when a category is selected
    if (filters.categoryId) {
      const fetchSubcategories = async () => {
        try {
          const res = await fetch(`/api/subcategories?categoryId=${filters.categoryId}`);
          const data = await res.json();
          setSubcategories(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [filters.categoryId]);

  useEffect(() => {
    // Update active filters display
    const newActiveFilters = [];
    
    // Add category filter
    if (filters.categoryId) {
      const category = categories.find(cat => cat._id === filters.categoryId);
      if (category) {
        newActiveFilters.push({
          type: 'category',
          id: filters.categoryId,
          label: category.name
        });
      }
    }
    
    // Add subcategory filter
    if (filters.subcategoryId) {
      const subcategory = subcategories.find(subcat => subcat._id === filters.subcategoryId);
      if (subcategory) {
        newActiveFilters.push({
          type: 'subcategory',
          id: filters.subcategoryId,
          label: subcategory.name
        });
      }
    }
    
    // Add county filter
    if (filters.countyId) {
      const county = counties.find(c => c._id === filters.countyId);
      if (county) {
        newActiveFilters.push({
          type: 'county',
          id: filters.countyId,
          label: county.name
        });
      }
    }
    
    // Add price filter
    if (filters.minPrice || filters.maxPrice) {
      let priceLabel = "Price: ";
      if (filters.minPrice && filters.maxPrice) {
        priceLabel += `Ksh ${filters.minPrice} - ${filters.maxPrice}`;
      } else if (filters.minPrice) {
        priceLabel += `Min Ksh ${filters.minPrice}`;
      } else if (filters.maxPrice) {
        priceLabel += `Max Ksh ${filters.maxPrice}`;
      }
      
      newActiveFilters.push({
        type: 'price',
        id: 'price-range',
        label: priceLabel
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters, categories, subcategories, counties]);
  
  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId,
      subcategoryId: "", // Reset subcategory when category changes
    }));
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setFilters(prev => ({
      ...prev,
      subcategoryId: prev.subcategoryId === subcategoryId ? "" : subcategoryId,
    }));
  };

  const handleCountySelect = (countyId) => {
    setFilters(prev => ({
      ...prev,
      countyId: prev.countyId === countyId ? "" : countyId,
    }));
  };

  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({...filters, searchTerm});
  };

  const handleReset = () => {
    setFilters({
      categoryId: "",
      subcategoryId: "",
      countyId: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "latest",
    });
    setSearchTerm("");
    onFilter({});
  };

  const removeFilter = (type, id) => {
    if (type === 'category') {
      setFilters(prev => ({
        ...prev,
        categoryId: "",
        subcategoryId: "", // Reset subcategory when category is removed
      }));
    } else if (type === 'subcategory') {
      setFilters(prev => ({
        ...prev,
        subcategoryId: "",
      }));
    } else if (type === 'county') {
      setFilters(prev => ({
        ...prev,
        countyId: "",
      }));
    } else if (type === 'price') {
      setFilters(prev => ({
        ...prev,
        minPrice: "",
        maxPrice: "",
      }));
    }
    
    // Apply the updated filters
    onFilter({...filters, [type]: ""});
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Get category image URL or use placeholder
  const getCategoryImage = (category) => {
    return category.imageUrl || "/api/placeholder/60/60";
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white">
      <div className="sticky top-0 z-10 bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Product Listings</h2>
          
          <button 
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-gray-100 p-2 rounded"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded"
                >
                  {filter.label}
                  <button 
                    className="ml-1.5 inline-flex items-center"
                    onClick={() => removeFilter(filter.type, filter.id)}
                  >
                    <X size={14} className="text-blue-800" />
                  </button>
                </div>
              ))}
              <button 
                onClick={handleReset}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Filter Sidebar */}
        <div className={`lg:w-64 transition-all ${isFilterOpen ? 'block' : 'hidden'} lg:block bg-white`}>
          <div className="sticky top-32">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Sliders size={18} className="mr-2" />
                Filters
              </h3>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reset all
              </button>
            </div>
            
            {/* Categories Section */}
            <div className="mb-6 border-b pb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('categories')}
              >
                <h4 className="font-medium">Categories</h4>
                {expandedSections.categories ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
              
              {expandedSections.categories && (
                <div className="space-y-2">
                  {filteredCategories.map((category) => (
                    <div 
                      key={category._id}
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        filters.categoryId === category._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleCategorySelect(category._id)}
                    >
                      <div className="w-8 h-8 mr-2 flex-shrink-0">
                        <Image 
                          src={getCategoryImage(category)} 
                          alt={category.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Subcategories Section */}
            {filters.categoryId && subcategories.length > 0 && (
              <div className="mb-6 border-b pb-4">
                <h4 className="font-medium mb-3">Subcategories</h4>
                <div className="space-y-2 ml-4">
                  {subcategories.map((subcategory) => (
                    <div 
                      key={subcategory._id}
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        filters.subcategoryId === subcategory._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleSubcategorySelect(subcategory._id)}
                    >
                      <span className="text-sm">{subcategory.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Location Section */}
            <div className="mb-6 border-b pb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('location')}
              >
                <h4 className="font-medium">Location</h4>
                {expandedSections.location ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
              
              {expandedSections.location && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {counties.map((county) => (
                    <div 
                      key={county._id}
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        filters.countyId === county._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleCountySelect(county._id)}
                    >
                      <span className="text-sm">{county.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Range Section */}
            <div className="mb-6 border-b pb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('price')}
              >
                <h4 className="font-medium">Price Range</h4>
                {expandedSections.price ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
              
              {expandedSections.price && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min (Ksh)</label>
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={handleChange}
                        min="0"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max (Ksh)</label>
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Any"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        min="0"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Price Range Presets */}
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      className="text-xs border border-gray-200 rounded p-1 hover:bg-gray-50"
                      onClick={() => setFilters(prev => ({...prev, minPrice: "0", maxPrice: "1000"}))}
                    >
                      Under 1,000
                    </button>
                    <button 
                      className="text-xs border border-gray-200 rounded p-1 hover:bg-gray-50"
                      onClick={() => setFilters(prev => ({...prev, minPrice: "1000", maxPrice: "5000"}))}
                    >
                      1,000 - 5,000
                    </button>
                    <button 
                      className="text-xs border border-gray-200 rounded p-1 hover:bg-gray-50"
                      onClick={() => setFilters(prev => ({...prev, minPrice: "5000", maxPrice: "10000"}))}
                    >
                      5,000 - 10,000
                    </button>
                    <button 
                      className="text-xs border border-gray-200 rounded p-1 hover:bg-gray-50"
                      onClick={() => setFilters(prev => ({...prev, minPrice: "10000", maxPrice: ""}))}
                    >
                      Over 10,000
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort By Section */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => toggleSection('sort')}
              >
                <h4 className="font-medium">Sort By</h4>
                {expandedSections.sort ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
              
              {expandedSections.sort && (
                <div className="space-y-2">
                  <select 
                    name="sortBy" 
                    value={filters.sortBy} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                    <option value="views">Most Viewed</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              )}
            </div>
            
            {/* Apply Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
        
        {/* This is where your product listing would go */}
        <div className="flex-1 min-h-screen bg-gray-50 rounded border border-gray-200 p-6">
          <div className="text-center text-gray-500">
            <p>Your product listings will appear here</p>
            <p className="text-sm mt-2">Based on your selected filters</p>
          </div>
        </div>
      </div>
    </div>
  );
}