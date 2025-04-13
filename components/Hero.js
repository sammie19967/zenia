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
    <section className="zenia-hero">
      {/* Animated Bubbles Background */}
      <div className="zenia-bubbles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="zenia-bubble" />
        ))}
      </div>
      
      <div className="zenia-hero-content">
        <h1 className="zenia-hero-title">
          Welcome to <span className="zenia-brand-name">Zenia</span>
        </h1>
        <h2 className="zenia-hero-subtitle">
          Your premier marketplace for unique finds and great deals
        </h2>
        
        <div className="zenia-typewriter">
          <span className="zenia-typewriter-text">{text}</span>
          <span className="zenia-typewriter-cursor"></span>
        </div>

        <form onSubmit={handleSearch} className="zenia-search-container">
          <div className="zenia-search-bar">
            <input
              type="text"
              placeholder="Search for products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="zenia-search-input"
            />
            <button type="submit" className="zenia-search-button">
              <Search size={20} />
            </button>
          </div>
        </form>

        <div className="zenia-hero-buttons">
          <Link href="/ads" className="zenia-hero-btn-primary">
            Browse Listings <ArrowRight size={18} />
          </Link>
          <Link href="/ads/create" className="zenia-hero-btn-secondary">
            Start Selling
          </Link>
        </div>
      </div>
    </section>
  );
}