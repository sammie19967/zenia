"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import "@/styles/AdsPage.css"; // Import the CSS file
import "@/components/Navbar"; // Import global styles

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

  useEffect(() => {
    const getAds = async () => {
      setLoading(true);
      try {
        const data = await fetchAds();
        console.log("Fetched ads:", data);
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

  if (loading) {
    return (
      <div className="loading-container">
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
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search ads..."
          className="search-input"
        />
        <Search className="search-icon" size={20} />
      </div>
      
      {/* Results count */}
      <div className="results-count">
        <p>{ads.length} ads found</p>
      </div>
      
      {/* Ads Grid */}
      {ads.length === 0 ? (
        <div className="no-ads">
          <p className="no-ads-text">No ads available</p>
        </div>
      ) : (
        <div className="ads-grid">
          {ads.map((ad) => (
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