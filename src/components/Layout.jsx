import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children, activeTab, setActiveTab, wishlistCount }) {
  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} wishlistCount={wishlistCount} />
      
      <main className="content-wrapper fade-in">
        {children}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} AetherStore. Designed for visual excellence & premium wishlist merging.</p>
        </div>
      </footer>
    </div>
  );
}
