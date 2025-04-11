"use client";

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

  if (loading) return <p>Loading ads...</p>;
  if (!ads.length) return <p>No ads found.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <AdFilter onFilter={fetchAds} />

      <div className="ads-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {ads.map((ad) => (
          <div key={ad._id} className="ad-card" style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "0.5rem" }}>
            <img src={ad.images?.[0] || "/placeholder.jpg"} alt={ad.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <div>
              <h3>{ad.title}</h3>
              <p>Ksh {ad.price.toLocaleString()}</p>
              <p>{ad.condition} • Negotiable? {ad.negotiable}</p>
              <Link href={`/ads/${ad._id}`}>
                <button style={{ marginTop: "0.5rem" }}>View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
