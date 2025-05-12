"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import "@/styles/AdsPage.css";

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
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getAds = async () => {
      setLoading(true);
      try {
        const data = await fetchAds();
        console.log("Fetched ads:", data);
        setAds(data.ads || []);
        setFilteredAds(data.ads || []);
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

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = ads.filter(ad => 
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location?.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location?.county.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  }, [searchTerm, ads]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading ads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="ads-container">
      <h1 className="page-title">Browse All Ads</h1>

      {/* Search and Filter Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search ads..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="search-icon" size={20} />
        <button className="filter-button">
          <Filter size={20} />
        </button>
      </div>

      {/* Results count */}
      <div className="results-count">
        <p>{filteredAds.length} {filteredAds.length === 1 ? 'ad' : 'ads'} found</p>
      </div>

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="no-ads">
          <p className="no-ads-text">
            {searchTerm 
              ? `No ads found matching "${searchTerm}"` 
              : "No ads available"}
          </p>
        </div>
      ) : (
        <div className="ads-grid">
          {filteredAds.map((ad) => (
            <Link href={`/ads/${ad._id}`} key={ad._id} className="ad-link">
              <div className="ad-card">
                <div className="ad-image-container">
                  {ad.images && ad.images.length > 0 ? (
                    <Image
                      src={ad.images[0]}
                      alt={ad.title}
                      fill
                      className="ad-image"
                      unoptimized
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}
                  {ad.paymentPlan !== "Free Ad" && (
                    <div className={`ad-badge ${ad.paymentPlan === "Premium Ad" ? "premium" : "featured"}`}>
                      {ad.paymentPlan === "Premium Ad" ? "Premium" : "Featured"}
                    </div>
                  )}
                </div>

                <div className="ad-content">
                  <div className="ad-header">
                    <h3 className="ad-title">{ad.title}</h3>
                    <p className="ad-price">KSh {ad.price?.toLocaleString()}</p>
                  </div>

                  <p className="ad-location">
                    {ad.location?.town}, {ad.location?.county}
                  </p>

                  <p className="ad-description">{ad.description}</p>

                  <div className="ad-footer">
                    <p className="ad-date">{new Date(ad.createdAt).toLocaleDateString()}</p>
                    <p className="ad-views">{ad.views} views</p>
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