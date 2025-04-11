"use client";

import { useEffect, useState } from "react";

export default function AdFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [counties, setCounties] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    countyId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "latest", // or "views"
  });

  useEffect(() => {
    const fetchOptions = async () => {
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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
      <select name="categoryId" value={filters.categoryId} onChange={handleChange}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <select name="countyId" value={filters.countyId} onChange={handleChange}>
        <option value="">All Counties</option>
        {counties.map((county) => (
          <option key={county._id} value={county._id}>{county.name}</option>
        ))}
      </select>

      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
        <option value="latest">Latest</option>
        <option value="views">Most Viewed</option>
      </select>

      <button type="submit">Apply Filters</button>
    </form>
  );
}
