import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, GitMerge, Sun, Moon } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, wishlistCount = 0 }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Initial theme set
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="navbar-header glass-panel">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setActiveTab('catalog')}>
          <ShoppingBag className="brand-icon" />
          <span className="brand-text">
            AETHER<span className="text-gradient">STORE</span>
          </span>
        </div>

        <nav className="navbar-links">
          <button 
            className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <ShoppingBag size={18} />
            <span>Storefront</span>
          </button>
          
          <button 
            className={`nav-btn ${activeTab === 'wishlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlists')}
          >
            <Heart size={18} />
            <span>My Wishlists</span>
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </button>
          
          <button 
            className={`nav-btn ${activeTab === 'merge' ? 'active' : ''}`}
            onClick={() => setActiveTab('merge')}
          >
            <GitMerge size={18} />
            <span>Merge Center</span>
          </button>
        </nav>

        <div className="navbar-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
