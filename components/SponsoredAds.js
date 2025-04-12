"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/SponsoredAds.css";

export default function SponsoredAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsoredAds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ads?package=Prime");
      console.log(res);     
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

  if (loading) return <p>Loading sponsored ads...</p>;
  if (!ads.length) return <p>No sponsored ads available.</p>;

  return (
    <div className="sponsored-ads">
      <h2>Sponsored Ads</h2>
      <div className="sponsored-list">
        {ads.map((ad) => (
          <div key={ad._id} className="sponsored-card">
            <div className="image-container">
              <img
                src={ad.images?.[0] || "/placeholder.jpg"}
                alt={ad.title}
              />
              <span className="prime-badge">Prime</span>
            </div>
            <div className="sponsored-info">
              <h4>{ad.title}</h4>
              <p>Ksh {ad.price.toLocaleString()}</p>
              <p className="location">
                {ad.countyId?.name || "Unknown County"},{" "}
                {ad.subcountyId?.name || "Unknown Subcounty"}
              </p>
              <Link href={`/ads/${ad._id}`}>
                <button>View</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
