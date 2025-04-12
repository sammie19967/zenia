"use client";
import { useEffect, useState } from "react";
import "@/styles/AdFilter.css"; // We'll create this CSS file

export default function AdFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [counties, setCounties] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    countyId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "latest",
  });

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

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      categoryId: "",
      countyId: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "latest",
    });
    onFilter({}); // Reset filters
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="categoryId">Category</label>
          <select 
            id="categoryId"
            name="categoryId" 
            value={filters.categoryId} 
            onChange={handleChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="countyId">County</label>
          <select 
            id="countyId"
            name="countyId" 
            value={filters.countyId} 
            onChange={handleChange}
            className="filter-select"
          >
            <option value="">All Counties</option>
            {counties.map((county) => (
              <option key={county._id} value={county._id}>{county.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price (Ksh)</label>
          <input
            id="minPrice"
            type="number"
            name="minPrice"
            placeholder="Any"
            value={filters.minPrice}
            onChange={handleChange}
            className="filter-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price (Ksh)</label>
          <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={handleChange}
            className="filter-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select 
            id="sortBy"
            name="sortBy" 
            value={filters.sortBy} 
            onChange={handleChange}
            className="filter-select"
          >
            <option value="latest">Latest</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="filter-button apply">
            Apply Filters
          </button>
          <button 
            type="button" 
            onClick={handleReset}
            className="filter-button reset"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}