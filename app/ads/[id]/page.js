// app/ads/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Heart, Share2, Flag, Phone, Mail, Clock, Shield, MapPin, Tag, MessageCircle } from "lucide-react";
import Link from "next/link";
import "@/styles/AdView.css";

export default function AdViewPage({ params }) {
  // Unwrap params with React.use()
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [similarAds, setSimilarAds] = useState([]);
  
  // For image zooming
  const [zoom, setZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Create an abort controller to cancel fetch requests if component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAd = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ads/${id}`, {
          cache: "no-store",
          signal: signal
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch ad: ${res.status}`);
        }

        const data = await res.json();
        setAd(data);
        
        // Fetch similar ads only if we have a category
        if (data.category) {
          try {
            const similarRes = await fetch(`/api/ads?category=${encodeURIComponent(data.category)}&limit=4&exclude=${id}`, {
              signal: signal
            });
            if (similarRes.ok) {
              const similarData = await similarRes.json();
              setSimilarAds(similarData);
            }
          } catch (err) {
            // Just log similar ads fetch error without failing the whole page
            console.error("Error fetching similar ads:", err);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAd();

    // Cleanup function to abort fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, [id]);

  const handleImageChange = (index) => {
    if (index >= 0 && index < (ad?.images?.length || 0)) {
      setCurrentImage(index);
    }
  };

  const nextImage = () => {
    if (ad?.images?.length > 0) {
      setCurrentImage((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad?.images?.length > 0) {
      setCurrentImage((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoom) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const toggleSaved = () => {
    setSaved(!saved);
    // In a real app, you would call an API to save/unsave the ad
  };

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: ad.title,
          text: `Check out this ad: ${ad.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Extracted loading component for cleaner code
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ad details...</p>
        </div>
      </div>
    );
  }

  // Extracted error component for cleaner code
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/ads" className="back-to-ads-btn">
            Back to All Ads
          </Link>
        </div>
      </div>
    );
  }

  if (!ad) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } catch (error) {
      return "Unknown date";
    }
  };

  // Safely handle potentially missing data
  const safeDescription = ad.description || "No description available";
  const safeImages = ad.images?.length > 0 ? ad.images : ["/placeholder.jpg"];
  const safeCondition = ad.condition || "Unknown";
  const safeSellerName = ad.sellerName || "Anonymous";
  const safeTags = ad.tags?.length > 0 ? ad.tags : ["used", "electronics", "sale"];
  
  return (
    <div className="ad-view-page">
      <Navbar />
      
      <div className="breadcrumb">
        <div className="container">
          <Link href="/ads">Ads</Link> &gt; 
          <Link href={`/ads?category=${encodeURIComponent(ad.category || '')}`}> {ad.category || 'Uncategorized'}</Link> &gt; 
          <span> {ad.title}</span>
        </div>
      </div>

      <div className="container">
        <div className="ad-view-grid">
          {/* Left column - Images and details */}
          <div className="ad-main-content">
            {/* Image gallery */}
            <div className="ad-gallery">
              <div 
                className={`main-image-container ${zoom ? 'zoomed' : ''}`} 
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
              >
                <img 
                  src={safeImages[currentImage]} 
                  alt={ad.title}
                  className="main-image"
                  style={zoom ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  } : {}}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                {safeImages.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage} aria-label="Previous image">
                      <ChevronLeft size={24} />
                    </button>
                    <button className="gallery-nav next" onClick={nextImage} aria-label="Next image">
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                <div className="image-count">
                  {currentImage + 1} / {safeImages.length}
                </div>
              </div>
              
              {safeImages.length > 1 && (
                <div className="thumbnail-container">
                  {safeImages.map((img, i) => (
                    <div 
                      key={i} 
                      className={`thumbnail ${i === currentImage ? 'active' : ''}`}
                      onClick={() => handleImageChange(i)}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${i + 1}`} 
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="ad-details">
              <div className="ad-header">
                <h1 className="ad-title">{ad.title}</h1>
                <div className="ad-meta">
                  <span className="ad-date">
                    <Clock size={16} />
                    Posted {formatDate(ad.createdAt)}
                  </span>
                  <span className="ad-location">
                    <MapPin size={16} />
                    {ad.location.county}, {ad.location.subcounty}, {ad.location.town}

                  </span>
                  <span className="ad-views">
                    <span className="views-count">{Math.floor(Math.random() * 100) + 10}</span> views
                  </span>
                </div>
              </div>

              <div className="ad-price-section">
                <div className="price-container">
                  <span className="price-label">Price</span>
                  <span className="ad-price">Ksh {ad.price?.toLocaleString() || 'N/A'}</span>
                  <span className={`negotiable-tag ${ad.negotiable ? "yes" : "no"}`}>
                    {ad.negotiable ? "Negotiable" : "Fixed Price"}
                  </span>
                </div>
                <div className="condition-container">
                  <span className="condition-label">Condition</span>
                  <span className={`condition-badge ${safeCondition.toLowerCase()}`}>
                    {safeCondition}
                  </span>
                </div>
              </div>

              <div className="ad-description">
                <h2>Description</h2>
                <div className="description-content">
                  {safeDescription.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="ad-features">
                <h2>Specifications</h2>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-label">Category</span>
                    <span className="feature-value">{ad.category || "Uncategorized"}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Brand</span>
                    <span className="feature-value">{ad.brand || "Not specified"}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Model</span>
                    <span className="feature-value">{ad.model || "Not specified"}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Package</span>
                    <span className="feature-value">{ad.package || "Standard"}</span>
                  </div>
                </div>
              </div>

              <div className="ad-tags">
                <Tag size={16} />
                {safeTags.map((tag, i) => (
                  <Link href={`/ads?tag=${encodeURIComponent(tag)}`} key={i} className="ad-tag">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Safety tips */}
            <div className="safety-tips">
              <div className="safety-header">
                <Shield size={20} />
                <h3>Safety Tips for Buyers</h3>
              </div>
              <ul className="safety-list">
                <li>Meet seller in a safe public place</li>
                <li>Check the item before you buy</li>
                <li>Pay only after inspecting the item</li>
                <li>Never send money in advance</li>
              </ul>
            </div>
            
            {/* Similar ads */}
            {similarAds.length > 0 && (
              <div className="similar-ads">
                <h2>Similar Items</h2>
                <div className="similar-ads-grid">
                  {similarAds.map((similarAd) => (
                    <Link href={`/ads/${similarAd._id}`} key={similarAd._id} className="similar-ad-card">
                      <div className="similar-ad-image">
                        <img 
                          src={similarAd.images?.[0] || "/placeholder.jpg"} 
                          alt={similarAd.title}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="similar-ad-info">
                        <h3>{similarAd.title}</h3>
                        <span className="similar-ad-price">
                          Ksh {similarAd.price?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Seller info and actions */}
          <div className="ad-sidebar">
            <div className="seller-card">
              <h2>Seller Information</h2>
              <div className="seller-info">
                <div className="seller-avatar">
                  {safeSellerName.charAt(0).toUpperCase()}
                </div>
                <div className="seller-details">
                  <h3>{safeSellerName}</h3>
                  <p className="seller-member-since">
                    Member since {ad.createdAt ? new Date(ad.createdAt).getFullYear() : 'N/A'}
                  </p>
                  <div className="seller-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`star ${star <= 4 ? 'filled' : ''}`}>★</span>
                    ))}
                    <span className="rating-count">(16 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="seller-stats">
                <div className="stat-item">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Ads</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">98%</span>
                  <span className="stat-label">Response</span>
                </div>
              </div>

              <div className="contact-actions">
                <button className="contact-button primary" onClick={toggleContact}>
                  <Phone size={18} />
                  Contact Seller
                </button>
                <button className="contact-button secondary">
                  <MessageCircle size={18} />
                  Send Message
                </button>
              </div>
              
              {showContact && (
                <div className="contact-details">
                  <div className="contact-item">
                    <Phone size={16} />
                    <a href={`tel:${ad.phoneNumber || ''}`}>{ad.phoneNumber || 'Phone number not available'}</a>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} />
                    <a href={`mailto:${ad.email || ''}`}>{ad.email || 'Email not available'}</a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="ad-actions">
              <button className={`action-button ${saved ? 'active' : ''}`} onClick={toggleSaved} aria-label={saved ? "Remove from saved" : "Save ad"}>
                <Heart size={20} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className="action-button" onClick={handleShare} aria-label="Share ad">
                <Share2 size={20} />
                Share
              </button>
              <button className="action-button report" onClick={() => setShowReportModal(true)} aria-label="Report ad">
                <Flag size={20} />
                Report
              </button>
            </div>
            
            <div className="ad-qr-code">
              <h3>Scan to view on mobile</h3>
              <div className="qr-image">
                <img src="/api/placeholder/120/120" alt="QR Code to view this ad on mobile" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Report this Ad</h2>
            <p>Please select a reason for reporting this ad:</p>
            <form className="report-form">
              {["Prohibited item", "Fraudulent", "Duplicate", "Incorrect category", "Other"].map((reason) => (
                <div className="report-option" key={reason}>
                  <input type="radio" name="reason" id={reason} value={reason} />
                  <label htmlFor={reason}>{reason}</label>
                </div>
              ))}
              <textarea placeholder="Additional details (optional)" aria-label="Additional details for report"></textarea>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="submit-btn" 
                  onClick={() => setShowReportModal(false)}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}