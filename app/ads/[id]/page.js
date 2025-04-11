// app/ads/[id]/page.jsx
import Image from "next/image";

export default async function AdViewPage({ params }) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ads/${id}`, {
    cache: "no-store", // ensures fresh fetch on every request
  });

  if (!res.ok) {
    return <div>Error fetching ad.</div>;
  }

  const ad = await res.json();

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{ad.title}</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {ad.images?.map((img, i) => (
          <div key={i} style={{ width: "200px", height: "150px", overflow: "hidden", borderRadius: "10px", border: "1px solid #ccc" }}>
            <img src={img} alt={`ad-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <p><strong>Description:</strong> {ad.description}</p>
        <p><strong>Price:</strong> Ksh {ad.price.toLocaleString()}</p>
        <p><strong>Condition:</strong> {ad.condition}</p>
        <p><strong>Negotiable:</strong> {ad.negotiable}</p>
        <p><strong>Seller:</strong> {ad.sellerName}</p>
        <p><strong>Phone:</strong> {ad.phoneNumber}</p>
        <p><strong>Email:</strong> {ad.email}</p>
        <p><strong>Package:</strong> {ad.package}</p>
        <p><strong>Created At:</strong> {new Date(ad.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
