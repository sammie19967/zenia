// components/ads/SimilarAds.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './SimilarAds.module.css';

async function getSimilarAds(currentAdId, category) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ads?category=${category}&limit=4&exclude=${currentAdId}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : []; // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching similar ads:', error);
    return [];
  }
}

export default async function SimilarAds({ currentAdId, category }) {
  const similarAds = await getSimilarAds(currentAdId, category);

  if (!similarAds || similarAds.length === 0) {
    // Handle the case where no similar ads are found
    console.log('No similar ads found');
    return null; // Or you could return a "No similar ads found" message
  }

  return (
    <div className={styles.similarAds}>
      <h2 className={styles.title}>Similar Ads</h2>
      <div className={styles.grid}>
        {similarAds.map((ad) => (
          <Link key={ad._id} href={`/ads/${ad._id}`} className={styles.card}>
            <div className={styles.imageContainer}>
              {ad.images?.[0] ? (
                <Image
                  src={ad.images[0]}
                  alt={ad.title}
                  fill
                  className={styles.image}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
            <div className={styles.content}>
              <h3 className={styles.adTitle}>{ad.title}</h3>
              <p className={styles.price}>KES {ad.price?.toLocaleString() || 'Negotiable'}</p>
              <p className={styles.location}>
                {ad.location?.town}, {ad.location?.county}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}