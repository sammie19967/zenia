"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, EyeIcon, TagIcon, ClockIcon } from "@heroicons/react/24/outline";
import { BsWhatsapp, BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import { format } from "date-fns";
import Link from "next/link";

export default function AdViewPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: session } = useSession();
  
  // State variables
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarAds, setSimilarAds] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Fetch ad data
  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ads/${id}`);
        setAd(response.data);
        
        // Register view
        await axios.post(`/api/ads/${id}/view`);
        
        // Check if user has favorited this ad
        if (session?.user) {
          const favResponse = await axios.get(`/api/user/favorites`);
          const isFav = favResponse.data.some(fav => fav.adId === id);
          setIsFavorite(isFav);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ad:", err);
        setError("Failed to load the ad. It may have been removed or is no longer available.");
        setLoading(false);
      }
    };

    if (id) {
      fetchAd();
    }
  }, [id, session]);

  // Fetch similar ads
  useEffect(() => {
    const fetchSimilarAds = async () => {
      if (ad) {
        try {
          const response = await axios.get(`/api/ads/similar`, {
            params: {
              category: ad.category,
              subcategory: ad.subcategory,
              excludeId: id
            }
          });
          setSimilarAds(response.data.slice(0, 4)); // Limit to 4 similar ads
        } catch (err) {
          console.error("Error fetching similar ads:", err);
        }
      }
    };

    if (ad) {
      fetchSimilarAds();
    }
  }, [ad, id]);

  // Handle favorite toggle
  const toggleFavorite = async () => {
    if (!session?.user) {
      // Redirect to login if not logged in
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/ads/${id}`));
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/user/favorites/${id}`);
      } else {
        await axios.post(`/api/user/favorites`, { adId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorites");
    }
  };

  // Handle share
  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareTitle = ad?.title || "Check out this ad";
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("Link copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy:", err);
          alert("Failed to copy link");
        }
        break;
    }
    
    setShowShareOptions(false);
  };

  // Scroll to contact form
  const scrollToContact = () => {
    document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return "Date unavailable";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800">Ad Not Found</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No ad found
  if (!ad) {
    return null;
  }

  // Determine status badge color
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    sold: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800"
  };

  // Determine payment plan badge color
  const planColors = {
    "Free Ad": "bg-gray-100 text-gray-800",
    "Premium Ad": "bg-blue-100 text-blue-800",
    "Featured Ad": "bg-purple-100 text-purple-800"
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Ad status banner - only shown for non-active ads */}
      {ad.status !== "active" && (
        <div className="bg-yellow-50 border-b border-yellow-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {ad.status === "pending" && "This ad is currently pending approval."}
                  {ad.status === "sold" && "This item has been sold."}
                  {ad.status === "inactive" && "This ad is currently inactive."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <nav className="flex mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/ads?category=${encodeURIComponent(ad.category)}`} className="hover:text-gray-700">{ad.category}</Link>
          <span className="mx-2">/</span>
          <Link href={`/ads?category=${encodeURIComponent(ad.category)}&subcategory=${encodeURIComponent(ad.subcategory)}`} className="hover:text-gray-700">{ad.subcategory}</Link>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative h-96 w-full">
                {ad.images && ad.images.length > 0 ? (
                  <Image 
                    src={ad.images[selectedImage]} 
                    alt={ad.title}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {ad.images && ad.images.length > 1 && (
                <div className="flex p-2 overflow-x-auto">
                  {ad.images.map((image, idx) => (
                    <div 
                      key={idx}
                      className={`relative h-20 w-20 flex-shrink-0 mr-2 cursor-pointer rounded border-2 ${selectedImage === idx ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <Image 
                        src={image} 
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ad details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ad.title}</h1>
              
              <div className="flex flex-wrap items-center mb-4 gap-2">
                {/* Status badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ad.status]}`}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
                
                {/* Payment plan badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[ad.paymentPlan]}`}>
                  {ad.paymentPlan}
                </span>
                
                {/* Views counter */}
                <span className="inline-flex items-center text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  {ad.views} views
                </span>
                
                {/* Post date */}
                <span className="inline-flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Posted on {formatDate(ad.createdAt)}
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  KSh {ad.price.toLocaleString()}
                </div>
                {ad.negotiable && (
                  <span className="ml-2 bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                    Negotiable
                  </span>
                )}
              </div>
              
              {/* Key details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{ad.location.town}, {ad.location.subcounty}, {ad.location.county}</p>
                  </div>
                </div>
                
                {ad.brand && (
                  <div className="flex items-start">
                    <TagIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Brand</p>
                      <p className="text-gray-900">{ad.brand}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {ad.description}
                </div>
              </div>
              
              {/* Custom fields */}
              {Object.keys(ad.customFields || {}).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ad.customFields).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-gray-900">{String(value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Contact and seller info */}
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* Contact seller button */}
                <button
                  onClick={scrollToContact}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact Seller
                </button>
                
                {/* Action buttons */}
                <div className="flex space-x-4">
                  {/* Favorite button */}
                  <button
                    onClick={toggleFavorite}
                    className="flex-1 flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isFavorite ? (
                      <>
                        <BsHeartFill className="h-5 w-5 mr-2 text-red-500" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BsHeart className="h-5 w-5 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                  
                  {/* Share button and dropdown */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="w-full flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <BsShare className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <BsWhatsapp className="h-4 w-4 mr-2 text-green-500" />
                            WhatsApp
                          </button>
                          <button onClick={() => handleShare('facebook')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <svg className="h-4 w-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                            Facebook
                          </button>
                          <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <svg className="h-4 w-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                            Twitter
                          </button>
                          <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact seller form */}
            <div id="contact-section" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Seller</h2>
              
              {/* Seller info */}
              <div className="mb-6 space-y-3">
                {/* Phone */}
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {showContactInfo ? (
                    <a href={`tel:${ad.contactInfo.phone}`} className="text-blue-600 hover:underline">
                      {ad.contactInfo.phone}
                    </a>
                  ) : (
                    <button
                      onClick={() => setShowContactInfo(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Show phone number
                    </button>
                  )}
                </div>
                
                {/* WhatsApp */}
                {ad.contactInfo.whatsapp && (
                  <div className="flex items-center">
                    <BsWhatsapp className="h-5 w-5 text-green-500 mr-2" />
                    {showContactInfo ? (
                      <a 
                        href={`https://wa.me/${ad.contactInfo.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        WhatsApp: {ad.contactInfo.whatsapp}
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowContactInfo(true)}
                        className="text-blue-600 hover:underline"
                      >
                        Show WhatsApp
                      </button>
                    )}
                  </div>
                )}
                
                {/* Email */}
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {showContactInfo ? (
                    <a href={`mailto:${ad.contactInfo.email}`} className="text-blue-600 hover:underline">
                      {ad.contactInfo.email}
                    </a>
                  ) : (
                    <button
                      onClick={() => setShowContactInfo(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Show email
                    </button>
                  )}
                </div>
              </div>
              
              {/* Message form */}
              <form className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={`Hi, I am interested in your "${ad.title}" ad on [Your Website Name]. Is this still available?`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Safety tips */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Safety Tips</h3>
              <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                <li>Meet seller in a safe public place</li>
                <li>Check the item before you buy</li>
                <li>Pay only after inspecting the item</li>
                <li>Never send money in advance</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Similar ads section */}
        {similarAds.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarAds.map((similarAd) => (
                <div key={similarAd._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link href={`/ads/${similarAd._id}`} className="block">
                    <div className="relative h-48 w-full">
                      {similarAd.images && similarAd.images.length > 0 ? (
                        <Image 
                          src={similarAd.images[0]} 
                          alt={similarAd.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{similarAd.title}</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">KSh {similarAd.price.toLocaleString()}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        <span>{similarAd.location.town}, {similarAd.location.county}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}