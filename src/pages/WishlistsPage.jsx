import React, { useState } from 'react';
import { Heart, Plus, Trash2, Edit2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './Pages.css';

export default function WishlistsPage({
  wishlists,
  activeWishlistId,
  onSelectWishlist,
  onCreateWishlist,
  onRenameWishlist,
  onDeleteWishlist,
  onRemoveItem
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [createError, setCreateError] = useState('');

  const [editingListId, setEditingListId] = useState(null);
  const [editListName, setEditListName] = useState('');
  const [editError, setEditError] = useState('');

  // Handle new wishlist creation
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setCreateError('');
    
    const error = onCreateWishlist(newListName);
    if (error) {
      setCreateError(error);
    } else {
      setNewListName('');
      setIsCreating(false);
    }
  };

  // Trigger edit mode for renaming
  const startEditing = (list) => {
    setEditingListId(list.id);
    setEditListName(list.name);
    setEditError('');
  };

  // Cancel edit mode
  const cancelEditing = () => {
    setEditingListId(null);
    setEditListName('');
    setEditError('');
  };

  // Handle renaming submission
  const handleRenameSubmit = (listId) => {
    setEditError('');
    const error = onRenameWishlist(listId, editListName);
    if (error) {
      setEditError(error);
    } else {
      setEditingListId(null);
      setEditListName('');
    }
  };

  // Handle wishlist deletion with native prompt
  const handleDeleteClick = (list) => {
    if (window.confirm(`Are you sure you want to delete the wishlist "${list.name}"?`)) {
      onDeleteWishlist(list.id);
    }
  };

  // Resolve current active wishlist
  const activeWishlist = wishlists.find(wl => wl.id === activeWishlistId) || wishlists[0];

  // Resolve and filter items from catalog (hiding deleted items)
  const resolvedItems = activeWishlist 
    ? activeWishlist.items
        .map(item => {
          const product = PRODUCTS.find(p => p.id === item.productId);
          return product ? { ...product, addedAt: item.addedAt } : null;
        })
        .filter(item => item !== null)
    : [];

  // Format timestamp helpers
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My <span className="text-gradient">Wishlists</span></h1>
          <p className="page-subtitle">Manage, rename, and review your saved collections of products.</p>
        </div>
      </div>

      <div className="wishlists-layout">
        {/* Left Sidebar - Wishlist Selection and Creation */}
        <aside className="wishlists-sidebar glass-card">
          <div className="sidebar-header">
            <h3>Your Lists</h3>
            <button 
              className={`btn btn-sm-circle ${isCreating ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => {
                setIsCreating(!isCreating);
                setCreateError('');
                setNewListName('');
              }}
              aria-label={isCreating ? "Cancel creation" : "Create new wishlist"}
            >
              {isCreating ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>

          {/* Inline creation form */}
          {isCreating && (
            <form onSubmit={handleCreateSubmit} className="inline-create-form">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter wishlist name..." 
                  value={newListName}
                  onChange={(e) => {
                    setNewListName(e.target.value);
                    setCreateError('');
                  }}
                  autoFocus
                />
                {createError && <p className="form-error"><AlertCircle size={14} /> {createError}</p>}
              </div>
              <div className="inline-form-actions">
                <button type="submit" className="btn btn-primary btn-sm">Create</button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsCreating(false);
                    setCreateError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <ul className="sidebar-list">
            {wishlists.map((list) => {
              const isEditing = editingListId === list.id;
              const isActive = activeWishlistId === list.id;

              return (
                <li 
                  key={list.id} 
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => !isEditing && onSelectWishlist(list.id)}
                >
                  {isEditing ? (
                    <div className="inline-edit-form" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="text" 
                        className="form-input edit-input" 
                        value={editListName}
                        onChange={(e) => {
                          setEditListName(e.target.value);
                          setEditError('');
                        }}
                        autoFocus
                      />
                      {editError && <p className="form-error"><AlertCircle size={12} /> {editError}</p>}
                      <div className="inline-edit-actions">
                        <button 
                          className="icon-btn success-btn" 
                          onClick={() => handleRenameSubmit(list.id)}
                          aria-label="Save name"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          className="icon-btn cancel-btn" 
                          onClick={cancelEditing}
                          aria-label="Cancel editing"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-details">
                        <span className="item-name">{list.name}</span>
                        <span className="item-count">{list.items.length} items</span>
                      </div>
                      <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="icon-btn" 
                          onClick={() => startEditing(list)}
                          aria-label={`Rename ${list.name}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="icon-btn delete" 
                          onClick={() => handleDeleteClick(list)}
                          aria-label={`Delete ${list.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right Pane - Active Wishlist Details & Items Grid */}
        <main className="wishlist-details-pane glass-card">
          {activeWishlist ? (
            <>
              <div className="pane-header">
                <div>
                  <h2 className="pane-title">{activeWishlist.name}</h2>
                  <div className="pane-meta-row">
                    <span className="pane-meta"><Calendar size={14} /> Created: {formatDate(activeWishlist.createdAt)}</span>
                    <span className="pane-meta"><Calendar size={14} /> Updated: {formatDate(activeWishlist.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {resolvedItems.length > 0 ? (
                <div className="wishlist-items-grid">
                  {resolvedItems.map((product) => (
                    <div 
                      key={product.id} 
                      className={`wishlist-item-card glass-card ${product.inStock ? '' : 'out-of-stock'}`}
                    >
                      <div className="wishlist-item-image-container">
                        <img src={product.imageUrl} alt={product.name} className="wishlist-item-image" />
                        <span className="wishlist-item-badge">{product.category}</span>
                        {!product.inStock && (
                          <span className="wishlist-item-stock-badge">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="wishlist-item-info">
                        <div className="wishlist-item-header">
                          <h3 className="wishlist-item-name">{product.name}</h3>
                          <span className="wishlist-item-price">${product.price.toFixed(2)}</span>
                        </div>
                        <p className="wishlist-item-date">Added {formatDate(product.addedAt)}</p>
                        
                        <div className="wishlist-item-footer">
                          <button 
                            className="btn btn-secondary btn-sm remove-item-btn"
                            onClick={() => onRemoveItem(activeWishlist.id, product.id)}
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pane-content-skeleton">
                  <div className="empty-wishlist-placeholder">
                    <Heart size={48} className="placeholder-icon" />
                    <h3>This Wishlist is Empty</h3>
                    <p>Go back to the Storefront to find and save products into this wishlist.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="pane-content-skeleton">
              <div className="empty-wishlist-placeholder">
                <Heart size={48} className="placeholder-icon" />
                <h3>No Wishlist Selected</h3>
                <p>Select or create a wishlist from the left menu to view its contents.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
