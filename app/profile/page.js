"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/Dashboard.css"; // Optional: custom styles
import Link from "next/link";

export default function ProfileDashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      const data = await res.json();
      setUserData(data.user);
      setAds(data.ads || []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (status === "loading" || loading) return <div className="loading">Loading...</div>;
  if (!session) return <div className="empty-state">Please <Link href="/auth">sign in</Link>.</div>;

  return (
    <div className="dashboard">
      <h1>Your Profile</h1>
      <div className="profile-section">
        <Image
          src={userData?.image || "/default-avatar.jpg"}
          alt="Profile"
          width={120}
          height={120}
          className="profile-image"
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData?.name || ""}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={userData?.phoneNumber || ""}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData?.email || ""}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={userData?.location || ""}
          onChange={handleInputChange}
        />
        <button onClick={handleUpdate}>Update Profile</button>
      </div>

      <div className="ads-section">
        <h2>Your Ads</h2>
        {ads.length === 0 ? (
          <div className="empty-state">
            <p>You haven&apos;t posted any ads yet.</p>
            <Link href="/ads/create" className="create-ad-link">Create Your First Ad</Link>
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad._id} className="ad-card">
              <Image 
                src={ad.images[0]} 
                alt={ad.title} 
                width={150} 
                height={150} 
                objectFit="cover"
              />
              <div className="ad-content">
                <h4>{ad.title}</h4>
                <p>{ad.description.slice(0, 100)}...</p>
                <Link href={`/ads/${ad._id}`}>View Details</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
