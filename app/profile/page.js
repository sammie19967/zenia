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

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>Please <Link href="/auth">sign in</Link>.</p>;

  return (
    <div className="dashboard">
      <h1>Your Profile</h1>
      <div className="profile-section">
        <Image
          src={userData?.image || "/default-avatar.png"}
          alt="Profile"
          width={80}
          height={80}
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
          type="text"
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

      <hr />
      <h2>Your Ads</h2>
      <div className="ads-section">
        {ads.length === 0 ? (
          <p>You haven't posted any ads yet.</p>
        ) : (
          ads.map((ad) => (
            <div key={ad._id} className="ad-card">
              <Image src={ad.images[0]} alt={ad.title} width={100} height={100} />
              <div>
                <h4>{ad.title}</h4>
                <p>{ad.description.slice(0, 60)}...</p>
                <Link href={`/ads/${ad._id}`}>View</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
