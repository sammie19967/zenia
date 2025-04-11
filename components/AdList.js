// components/AdList.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ads");
        const data = await res.json();
        setAds(data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <p>Loading ads...</p>;

  if (!ads.length) return <p>No ads found.</p>;

  return (
    <div className="ads-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", padding: "1rem" }}>
      {ads.map((ad) => (
        <div key={ad._id} className="ad-card" style={{ border: "1px solid #ccc", borderRadius: "10px", overflow: "hidden", padding: "0.5rem" }}>
          <div className="image-wrapper" style={{ width: "100%", height: "180px", overflow: "hidden" }}>
            <img
              src={ad.images?.[0] || "/placeholder.jpg"}
              alt={ad.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="ad-details" style={{ padding: "0.5rem" }}>
            <h3 style={{ margin: 0 }}>{ad.title}</h3>
            <p style={{ margin: "0.25rem 0" }}>Ksh {ad.price.toLocaleString()}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {ad.condition} •
              {<br></br>}
              Negotiable? : {ad.negotiable}
            </p>
            <Link href={`/ads/${ad._id}`}>
              <button style={{ marginTop: "0.5rem", padding: "0.4rem 0.6rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                View Details
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
