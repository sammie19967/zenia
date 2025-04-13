"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import AdFilter from "./AdFilter";
import "@/styles/AdList.css";

export default function AdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [clickedAdId, setClickedAdId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();

  // Apply filters with debounce to prevent too many requests
  const debouncedFetchAds = useCallback(
    debounce((newFilters, resetPage = true) => {
      fetchAds(newFilters, resetPage);
    }, 300),
    []
  );

  const fetchAds = async (filters = {}, resetPage = true) => {
    try {
      const currentPage = resetPage ? 1 : page;
      if (resetPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const combinedFilters = { 
        ...filters, 
        page: currentPage, 
        limit: 20 
      };
      
      const params = new URLSearchParams();
      Object.entries(combinedFilters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const res = await fetch(`/api/ads?${params.toString()}`);
      const data = await res.json();
      
      if (resetPage) {
        setAds(data.ads || []);
        setTotalResults(data.total || 0);
      } else {
        setAds(prev => [...prev, ...(data.ads || [])]);
      }
      
      setHasMore((data.ads || []).length === 20);
      setActiveFilters(filters);
      
      if (resetPage) {
        setPage(1);
      } else {
        setPage(currentPage);
      }
      
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      fetchAds(activeFilters, false);
      return nextPage;
    });
  };

  useEffect(() => {
    fetchAds();
    
    // Set up intersection observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }
    
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, loading]);

  const handleFilterChange = (newFilters) => {
    debouncedFetchAds(newFilters);
  };

  const handleAdClick = (adId) => {
    setClickedAdId(adId);
    setLoadingModal(true);
    setTimeout(() => {
      router.push(`/ads/${adId}`);
    }, 300);
  };

  const handleWishlist = (e, adId) => {
    e.stopPropagation();
    // Add wishlist functionality here
    console.log(`Added ${adId} to wishlist`);
  };

  const handleQuickView = (e, adId) => {
    e.stopPropagation();
    // Quick view functionality can be added here
    console.log(`Quick view ${adId}`);
  };

  return (
    <div className="ecommerce-layout">
      {/* Sidebar Filter */}
      <aside className="ecommerce-sidebar">
        <AdFilter onChange={handleFilterChange} initialFilters={activeFilters} />
      </aside>
      
      {/* Main Content */}
      <main className="ecommerce-main">
        <div className="results-header">
          <div className="results-summary">
            {!loading && (
              <h2>
                <span className="result-count">{totalResults}</span> Results
                {Object.keys(activeFilters).length > 0 && " with filters"}
              </h2>
            )}
          </div>
          
          <div className="view-options">
            <button className="view-btn active">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
              </svg>
            </button>
            <button className="view-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding your perfect items...</p>
          </div>
        ) : !ads.length ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" fill="none">
                <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or browse our categories</p>
            <button onClick={() => fetchAds({})} className="reset-filters-btn">
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {ads.map((ad) => (
                <div key={ad._id} className="product-card" onClick={() => handleAdClick(ad._id)}>
                  <div className="product-actions">
                    <button 
                      className="action-btn wishlist-btn" 
                      onClick={(e) => handleWishlist(e, ad._id)}
                      aria-label="Add to wishlist"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <button 
                      className="action-btn quickview-btn" 
                      onClick={(e) => handleQuickView(e, ad._id)}
                      aria-label="Quick view"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="product-image-container">
                    <img
                      src={ad.images?.[0] || "/placeholder.jpg"}
                      alt={ad.title}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    
                    <div className="product-badges">
                      <span className={`condition-badge ${ad.condition.toLowerCase()}`}>
                        {ad.condition}
                      </span>
                      
                      {ad.featured && (
                        <span className="featured-badge">Featured</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-title">{ad.title}</h3>
                    
                    <div className="product-meta">
                      <span className="product-location">{ad.county?.name || "Location"}</span>
                      <span className="product-date">{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="product-price-row">
                      <span className="product-price">
                        Ksh {ad.price.toLocaleString()}
                      </span>
                      {ad.negotiable && (
                        <span className="negotiable-badge">Negotiable</span>
                      )}
                    </div>
                    
                    <button className="view-details-button">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div id="scroll-sentinel" className="scroll-sentinel">
              {loadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner small"></div>
                  <span>Loading more...</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Loading Modal */}
      {loadingModal && (
        <div className="loading-modal">
          <div className="loading-modal-content">
            <div className="loading-spinner"></div>
            <p>Getting product details...</p>
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