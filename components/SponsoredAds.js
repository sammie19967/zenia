"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import "@/styles/SponsoredAds.css";

export default function SponsoredAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  const fetchSponsoredAds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ads?package=Prime");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch sponsored ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsoredAds();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= Math.ceil(ads.length / visibleCards) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? Math.ceil(ads.length / visibleCards) - 1 : prevIndex - 1
    );
  };

  // Calculate visible cards based on screen size
  const [visibleCards, setVisibleCards] = useState(6);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setVisibleCards(6);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 480) {
        setVisibleCards(3);
      } else {
        setVisibleCards(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return (
    <div className="zen-sponsored-loading">
      <div className="zen-spinner"></div>
      <p>Loading premium listings...</p>
    </div>
  );

  if (!ads.length) return (
    <div className="zen-sponsored-empty">
      <p>No sponsored ads available at the moment.</p>
      <Link href="/ads/create" className="zen-create-link">
        Become a featured seller
      </Link>
    </div>
  );

  return (
    <section className="zen-sponsored-section">
      <div className="zen-sponsored-header">
        <h2 className="zen-sponsored-title">
          <span className="zen-title-highlight">Sponsored</span> ads
        </h2>
        <div className="zen-nav-controls">
          <button 
            onClick={prevSlide} 
            className="zen-nav-button zen-prev-button"
            aria-label="Previous ads"
          >
            <ChevronLeft size={24} className="zen-nav-icon" />
          </button>
          <button 
            onClick={nextSlide} 
            className="zen-nav-button zen-next-button"
            aria-label="Next ads"
          >
            <ChevronRight size={24} className="zen-nav-icon" />
          </button>
        </div>
      </div>

      <div className="zen-sponsored-carousel">
        <div 
          ref={trackRef}
          className="zen-sponsored-track" 
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            gridTemplateColumns: `repeat(${ads.length}, calc(${100 / visibleCards}% - 16px))`
          }}
        >
          {ads.map((ad) => (
            <div key={ad._id} className="zen-sponsored-card">
              <Link href={`/ads/${ad._id}`} className="zen-card-link" aria-label={`View ${ad.title}`} />
              <div className="zen-card-media">
                <img
                  src={ad.images?.[0] || "/placeholder.jpg"}
                  alt={ad.title}
                  className="zen-product-image"
                  loading="lazy"
                />
                <div className="zen-premium-badge">
                  <span>Prime</span>
                  <div className="zen-badge-glow"></div>
                </div>
              </div>
              <div className="zen-card-content">
                <h3 className="zen-product-title">{ad.title.toLowerCase()}</h3>
                <div className="zen-product-meta">
                  <span className="zen-product-price">Ksh {ad.price.toLocaleString()}</span>
                  <span className="zen-product-location">
                    <MapPin /> {ad.countyId?.name || "Nairobi"}, {ad.subcountyId?.name || "CBD"}
                  </span>
                </div>
                <Link 
                  href={`/ads/${ad._id}`} 
                  className="zen-view-button"
                >
                  View details
                  <span className="zen-button-arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}