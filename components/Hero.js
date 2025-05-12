"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import '@/styles/Hero.css';

export default function Hero() {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const phrases = ["DISCOVER", "EXPLORE", "CONNECT"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const typeWriter = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setText(currentPhrase.substring(0, text.length - 1));
        setTypingSpeed(100);
      } else {
        setText(currentPhrase.substring(0, text.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
      }
    };

    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, currentPhraseIndex, isDeleting, typingSpeed]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="zen-hero">
      <div className="zen-hero-overlay"></div>
      
      <div className="zen-hero-content">
        <div className="zen-hero-text">
          <h1 className="zen-hero-title">
            Your Gateway to <span className="zen-highlight">Quality</span> Finds
          </h1>
          <div className="zen-typewriter-container">
            <span className="zen-typewriter-text">{text}</span>
            <span className="zen-typewriter-cursor">|</span>
            <span className="zen-typewriter-subtext">with Zenia Marketplace</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="zen-search-container">
          <div className="zen-search-bar">
            <Search size={18} className="zen-search-icon" />
            <input
              type="text"
              placeholder="Search products, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="zen-search-input"
            />
            <button type="submit" className="zen-search-button">
              Search
            </button>
          </div>
        </form>

        <div className="zen-hero-cta">
          <Link href="/ads" className="zen-cta-primary">
            Browse Listings
            <ArrowRight size={16} className="zen-cta-icon" />
          </Link>
          <Link href="/create-ads" className="zen-cta-secondary">
            Start Selling
          </Link>
        </div>
      </div>
    </section>
  );
}