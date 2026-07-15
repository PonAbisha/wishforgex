import React, { useState } from 'react';
import { Search, Filter, Plus, Check, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './Pages.css';

export default function CatalogPage({ onAddToWishlist }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [addedProductIds, setAddedProductIds] = useState(new Set());

  // Filter products based on search term & category selection
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === '' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleAddClick = (product) => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
    
    // Trigger visual toast confirmation
    setToastMessage(`Saved "${product.name}" to active wishlist.`);
    
    // Add micro-animation checkmark state for this specific product
    setAddedProductIds(prev => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });
    
    // Reset checkmark icon and hide toast after 2.5s
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    
    setTimeout(() => {
      setAddedProductIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  // Get unique list of categories for filter dropdown
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));

  return (
    <div className="page-container">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="toast-notification glass-panel">
          <Check size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Explore our <span className="text-gradient">Catalog</span></h1>
          <p className="page-subtitle">Add items to your wishlists and merge them to curate the perfect collection.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-filters-bar glass-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by product name or description..." 
            className="form-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <Filter size={18} className="filter-icon" />
          <select 
            className="form-select" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const isAdded = addedProductIds.has(product.id);
            return (
              <div 
                key={product.id} 
                className={`product-card ${product.inStock ? '' : 'out-of-stock'}`}
              >
                <div className="product-image-container">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-image"
                    loading="lazy"
                  />
                  <span className="product-badge-category">{product.category}</span>
                  {!product.inStock && (
                    <span className="product-badge-stock">Out of Stock</span>
                  )}
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  
                  <div className="product-card-footer">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
                    </span>
                    <button 
                      className={`btn ${isAdded ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => handleAddClick(product)}
                      aria-label={`Save ${product.name} to wishlist`}
                    >
                      {isAdded ? <Check size={16} /> : <Plus size={16} />}
                      <span>{isAdded ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-catalog-fallback glass-card">
          <AlertCircle size={40} className="fallback-icon" />
          <h3>No products match your search</h3>
          <p>Try adjusting your keywords or category filters to explore other items.</p>
        </div>
      )}
    </div>
  );
}
