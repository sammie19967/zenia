// app/ad/[id]/page.jsx
import React, { Suspense } from 'react';
import { FiArrowLeft, FiShare2, FiHeart, FiMapPin, FiEye } from 'react-icons/fi';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import AdActions from '@/components/ads/AdActions';
import SimilarAds from '@/components/ads/SimilarAds';
import SafetyTips from '@/components/ads/SafetyTips';
import styles from './AdViewPage.module.css'; // CSS module import

async function getAd(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ads/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch ad');
  return res.json();
}

export default async function AdViewPage({ params }) {
  const ad = await getAd(params.id);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: ad.category, href: `/categories/${ad.category.toLowerCase()}` },
    { name: ad.title, href: `#` },
  ];

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className={styles.mainLayout}>
        {/* Main content */}
        <div className={styles.mainContent}>
          {/* Back button for mobile */}
          <div className={styles.mobileBackButton}>
            <Link href="/categories" className={styles.backLink}>
              <FiArrowLeft className={styles.backIcon} /> Back to listings
            </Link>
          </div>

          {/* Image gallery */}
          <div className={styles.imageGallery}>
            <Suspense fallback={<LoadingSpinner className={styles.loadingSpinner} />}>
              {ad.images?.length > 0 ? (
                <>
                  <div className={styles.mainImageContainer}>
                    <Image
                      src={ad.images[0]}
                      alt={ad.title}
                      fill
                      className={styles.mainImage}
                      priority
                    />
                  </div>
                  {ad.images.length > 1 && (
                    <div className={styles.thumbnailGrid}>
                      {ad.images.slice(1).map((img, index) => (
                        <div key={index} className={styles.thumbnailContainer}>
                          <Image
                            src={img}
                            alt={`${ad.title} - ${index + 2}`}
                            fill
                            className={styles.thumbnailImage}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noImagePlaceholder}>
                  <span>No images available</span>
                </div>
              )}
            </Suspense>
          </div>

          {/* Ad details */}
          <div className={styles.adDetails}>
            <div className={styles.adHeader}>
              <div>
                <h1 className={styles.adTitle}>{ad.title}</h1>
                <div className={styles.location}>
                  <FiMapPin className={styles.locationIcon} />
                  <span>
                    {ad.location.town}, {ad.location.subcounty}, {ad.location.county}
                  </span>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.iconButton}>
                  <FiShare2 size={20} />
                </button>
                <button className={styles.iconButton}>
                  <FiHeart size={20} />
                </button>
              </div>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>KES {ad.price.toLocaleString()}</span>
              {ad.negotiable && <span className={styles.negotiable}>(Negotiable)</span>}
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <FiEye className={styles.metaIcon} />
                <span>{ad.views} views</span>
              </div>
              <div className={styles.metaItem}>
                <span>
                  Posted: {new Date(ad.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.descriptionText}>{ad.description}</p>
            </div>

            {/* Custom fields */}
            {Object.keys(ad.customFields).length > 0 && (
              <div className={styles.detailsSection}>
                <h2 className={styles.sectionTitle}>Details</h2>
                <div className={styles.detailsGrid}>
                  {Object.entries(ad.customFields).map(([key, value]) => (
                    <div key={key} className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className={styles.detailValue}>
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Seller info */}
          <div className={styles.sellerCard}>
            <h3 className={styles.sellerTitle}>Seller Information</h3>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerAvatar}>
                {ad.userId?.avatar ? (
                  <Image
                    src={ad.userId.avatar}
                    alt={ad.userId.name}
                    width={50}
                    height={50}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {ad.userId?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className={styles.sellerText}>
                <p className={styles.sellerName}>{ad.userId?.name || 'Private Seller'}</p>
                {ad.userId?.rating && (
                  <div className={styles.sellerRating}>
                    <span className={styles.ratingStar}>★</span>
                    <span>{ad.userId.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact buttons */}
            <div className={styles.contactButtons}>
              <a
                href={`tel:${ad.contactInfo.phone}`}
                className={`${styles.contactButton} ${styles.phoneButton}`}
              >
                <FaPhone className={styles.contactIcon} />
                <span>{ad.contactInfo.phone}</span>
              </a>

              <a
                href={`mailto:${ad.contactInfo.email}`}
                className={`${styles.contactButton} ${styles.emailButton}`}
              >
                <FaEnvelope className={styles.contactIcon} />
                <span>{ad.contactInfo.email}</span>
              </a>

              {ad.contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${ad.contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactButton} ${styles.whatsappButton}`}
                >
                  <FaWhatsapp className={styles.contactIcon} />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>

            {/* Ad actions for owner */}
            <AdActions ad={ad} />
          </div>

          {/* Safety tips */}
          <SafetyTips />
        </div>
      </div>

      {/* Similar ads */}
      <SimilarAds currentAdId={ad._id} category={ad.category} />
    </div>
  );
}