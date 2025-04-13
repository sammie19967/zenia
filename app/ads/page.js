"use client";
import "@/styles/AdLayout.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdFilter from "@/components/AdFilter";
import Navbar from "@/components/Navbar";

export default function AdLayout() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [clickedAdId, setClickedAdId] = useState(null);
  const router = useRouter();

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

  const handleAdClick = (adId) => {
    setClickedAdId(adId);
    setLoadingModal(true);
    // Navigate after a small delay to show the loading modal
    setTimeout(() => {
      router.push(`/ads/${adId}`);
    }, 300);
  };

  return (
    <div className="ad-layout">
      <Navbar/>
    <div className="ad-layout-container">
      {/* Sidebar Filter */}
      
      <div className="sidebar-container">
        <AdFilter onFilter={fetchAds} />
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading ads...</p>
          </div>
        ) : !ads.length ? (
          <div className="empty-state">
            <p>No ads found.</p>
            <button onClick={() => fetchAds()} className="refresh-btn">
              Refresh
            </button>
          </div>
        ) : (
          <div className="ads-grid">
            {ads.map((ad) => (
              <div key={ad._id} className="ad-card">
                <div
                  className="image-container clickable"
                  onClick={() => handleAdClick(ad._id)}
                >
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
                  <h3
                    className="ad-title clickable"
                    onClick={() => handleAdClick(ad._id)}
                  >
                    {ad.title}
                  </h3>
                  
                  <div className="price-row">
                    <span className="price">Ksh {ad.price.toLocaleString()}</span>
                    <span className={`negotiable-tag ${ad.negotiable ? 'yes' : 'no'}`}>
                      {ad.negotiable ? 'Negotiable' : 'Fixed'}
                    </span>
                  </div>
                  
                  <button
                    className="view-details-btn"
                    onClick={() => handleAdClick(ad._id)}
                  >
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

      {/* Loading Modal */}
      {loadingModal && (
        <div className="loading-modal">
          <div className="loading-modal-content">
            <div className="loading-spinner"></div>
            <p>Loading ad details...</p>
            <div className="ad-preview">
              {clickedAdId && ads.find(ad => ad._id === clickedAdId) && (
                <>
                  <h4>{ads.find(ad => ad._id === clickedAdId).title}</h4>
                  <span className="price">Ksh {ads.find(ad => ad._id === clickedAdId).price.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}