"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Search, Filter, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import "@/styles/AdFilter.css";

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
    const newActiveFilters = [];
    
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
      subcategoryId: "",
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
        subcategoryId: "",
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

  const getCategoryImage = (category) => {
    return category.imageUrl || "/api/placeholder/60/60";
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ad-filter-container">
      <div className="ad-filter-header">
        <div className="ad-filter-header-inner">
          <h2 className="ad-filter-title">Product Listings</h2>
          
          <button 
            onClick={toggleFilters}
            className="ad-filter-mobile-toggle"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
        
        <div className="ad-filter-search-container">
          <div className="ad-filter-search-icon">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="ad-filter-search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button 
              className="ad-filter-clear-search"
              onClick={() => setSearchTerm("")}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <div className="ad-filter-active-container">
            <span className="ad-filter-active-label">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <div 
                key={index} 
                className="ad-filter-active-tag"
              >
                {filter.label}
                <button 
                  className="ad-filter-remove-tag"
                  onClick={() => removeFilter(filter.type, filter.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={handleReset}
              className="ad-filter-clear-all"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="ad-filter-main">
        {/* Filter Sidebar */}
        <div className={`ad-filter-sidebar ${isFilterOpen ? 'ad-filter-sidebar-mobile' : 'hidden'} ad-filter-sidebar-desktop`}>
          <div className="ad-filter-sidebar-header">
            <h3 className="ad-filter-sidebar-title">
              <Sliders size={18} />
              Filters
            </h3>
            <button
              onClick={handleReset}
              className="ad-filter-reset-all"
            >
              Reset all
            </button>
          </div>
          
          {/* Categories Section */}
          <div className="ad-filter-section">
            <div 
              className="ad-filter-section-header"
              onClick={() => toggleSection('categories')}
            >
              <h4 className="ad-filter-section-title">Categories</h4>
              {expandedSections.categories ? (
                <ChevronUp size={16} className="ad-filter-section-toggle" />
              ) : (
                <ChevronDown size={16} className="ad-filter-section-toggle" />
              )}
            </div>
            
            {expandedSections.categories && (
              <div className="ad-filter-section-content">
                {filteredCategories.map((category) => (
                  <div 
                    key={category._id}
                    className={`ad-filter-category ${filters.categoryId === category._id ? 'ad-filter-category--active' : ''}`}
                    onClick={() => handleCategorySelect(category._id)}
                  >
                    <img 
                      src={getCategoryImage(category)} 
                      alt={category.name}
                      className="ad-filter-category-image"
                    />
                    <span className="ad-filter-category-name">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Subcategories Section */}
          {filters.categoryId && subcategories.length > 0 && (
            <div className="ad-filter-section">
              <h4 className="ad-filter-section-title">Subcategories</h4>
              <div className="ad-filter-section-content">
                {subcategories.map((subcategory) => (
                  <div 
                    key={subcategory._id}
                    className={`ad-filter-subcategory ${filters.subcategoryId === subcategory._id ? 'ad-filter-subcategory--active' : ''}`}
                    onClick={() => handleSubcategorySelect(subcategory._id)}
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Location Section */}
          <div className="ad-filter-section">
            <div 
              className="ad-filter-section-header"
              onClick={() => toggleSection('location')}
            >
              <h4 className="ad-filter-section-title">Location</h4>
              {expandedSections.location ? (
                <ChevronUp size={16} className="ad-filter-section-toggle" />
              ) : (
                <ChevronDown size={16} className="ad-filter-section-toggle" />
              )}
            </div>
            
            {expandedSections.location && (
              <div className="ad-filter-section-content ad-filter-location-list">
                {counties.map((county) => (
                  <div 
                    key={county._id}
                    className={`ad-filter-location ${filters.countyId === county._id ? 'ad-filter-location--active' : ''}`}
                    onClick={() => handleCountySelect(county._id)}
                  >
                    {county.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price Range Section */}
          <div className="ad-filter-section">
            <div 
              className="ad-filter-section-header"
              onClick={() => toggleSection('price')}
            >
              <h4 className="ad-filter-section-title">Price Range</h4>
              {expandedSections.price ? (
                <ChevronUp size={16} className="ad-filter-section-toggle" />
              ) : (
                <ChevronDown size={16} className="ad-filter-section-toggle" />
              )}
            </div>
            
            {expandedSections.price && (
              <div className="ad-filter-section-content">
                <div className="ad-filter-price-inputs">
                  <div className="ad-filter-price-group">
                    <label className="ad-filter-price-label">Min (Ksh)</label>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={handleChange}
                      min="0"
                      className="ad-filter-price-input"
                    />
                  </div>
                  <div className="ad-filter-price-group">
                    <label className="ad-filter-price-label">Max (Ksh)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      min="0"
                      className="ad-filter-price-input"
                    />
                  </div>
                </div>
                
                <div className="ad-filter-price-presets">
                  <button 
                    className="ad-filter-price-preset"
                    onClick={() => setFilters(prev => ({...prev, minPrice: "0", maxPrice: "1000"}))}
                  >
                    Under 1,000
                  </button>
                  <button 
                    className="ad-filter-price-preset"
                    onClick={() => setFilters(prev => ({...prev, minPrice: "1000", maxPrice: "5000"}))}
                  >
                    1,000 - 5,000
                  </button>
                  <button 
                    className="ad-filter-price-preset"
                    onClick={() => setFilters(prev => ({...prev, minPrice: "5000", maxPrice: "10000"}))}
                  >
                    5,000 - 10,000
                  </button>
                  <button 
                    className="ad-filter-price-preset"
                    onClick={() => setFilters(prev => ({...prev, minPrice: "10000", maxPrice: ""}))}
                  >
                    Over 10,000
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sort By Section */}
          <div className="ad-filter-section">
            <div 
              className="ad-filter-section-header"
              onClick={() => toggleSection('sort')}
            >
              <h4 className="ad-filter-section-title">Sort By</h4>
              {expandedSections.sort ? (
                <ChevronUp size={16} className="ad-filter-section-toggle" />
              ) : (
                <ChevronDown size={16} className="ad-filter-section-toggle" />
              )}
            </div>
            
            {expandedSections.sort && (
              <div className="ad-filter-section-content">
                <select 
                  name="sortBy" 
                  value={filters.sortBy} 
                  onChange={handleChange}
                  className="ad-filter-sort-select"
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
          
          <button
            onClick={handleSubmit}
            className="ad-filter-apply-btn"
          >
            Apply Filters
          </button>
        </div>
        
        
      </div>
    </div>
  );
}