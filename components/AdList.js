"use client";
import "@/styles/AdList.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdFilter from "./AdFilter";

export default function AdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/ads?${params.toString()}`);
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading ads...</p>
    </div>
  );
  
  if (!ads.length) return (
    <div className="empty-state">
      <p>No ads found.</p>
      <button onClick={() => fetchAds()} className="refresh-btn">
        Refresh
      </button>
    </div>
  );

  return (
    <div className="ad-list-container">
      <AdFilter onFilter={fetchAds} />

      <div className="ads-grid">
        {ads.map((ad) => (
          <div key={ad._id} className="ad-card">
            <div className="image-container">
              <img 
                src={ad.images?.[0] || "/placeholder.jpg"} 
                alt={ad.title} 
                className="ad-image"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <span className={`condition-tag ${ad.condition.toLowerCase()}`}>
                {ad.condition}
              </span>
            </div>
            
            <div className="card-body">
              <h3 className="ad-title">{ad.title}</h3>
              
              <div className="price-row">
                <span className="price">Ksh {ad.price.toLocaleString()}</span>
                <span className={`negotiable-tag ${ad.negotiable ? 'yes' : 'no'}`}>
                  {ad.negotiable ? 'Negotiable' : 'Fixed'}
                </span>
              </div>
              
              <Link href={`/ads/${ad._id}`} className="details-link">
                <button className="view-details-btn">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}