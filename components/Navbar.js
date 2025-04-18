"use client";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/Navbar.css";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/" className="logo-link">
          <Image 
            src="/logozenia.png" 
            alt="Zeniakenyorc Logo" 
            width={120} 
            height={60} 
            className="logo-image"
            priority
          />
          <span className="logo-text"> Zeniakenyorc</span>
        </Link>
      </div>
      <div className="navbar-center">
        <Link href="/create-ads" className="nav-link highlight">
          Post Free Ad
        </Link>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link href="/login" className="nav-button">Sign In</Link>
      </div>
    </nav>
  );
}