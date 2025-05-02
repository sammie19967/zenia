"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Sun, Moon } from "lucide-react";
import "@/styles/Navbar.css";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Theme loading
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  // Theme switching
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/" className="logo-link">
          <Image src="/logozenia.png" alt="Logo" width={120} height={60} className="logo-image" priority />
          <span className="logo-text">Zeniakenyorc</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link href="/create-ads" className="nav-link highlight">
          Post Free Ad
        </Link>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {status === "loading" ? null : !session?.user ? (
          <Link href="/auth" className="nav-button">
            Sign In
          </Link>
        ) : (
          <div className="profile-container">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt="Profile"
              width={32}
              height={32}
              className="profile-avatar"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link href="/profile">My Profile</Link>
                <button onClick={() => signOut()}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
