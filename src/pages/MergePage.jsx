import React, { useState } from 'react';
import { GitMerge, AlertCircle, HelpCircle } from 'lucide-react';
import './Pages.css';

export default function MergePage({ wishlists, onMergeWishlists, onNavigate }) {
  const [sourceAId, setSourceAId] = useState('');
  const [sourceBId, setSourceBId] = useState('');
  const [mergedName, setMergedName] = useState('');
  const [error, setError] = useState('');

  const handleMergeSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Pre-validations
    if (!sourceAId || !sourceBId) {
      setError('Please select both a first and second wishlist to merge.');
      return;
    }
    if (sourceAId === sourceBId) {
      setError('Please select two different wishlists to merge.');
      return;
    }
    if (!mergedName.trim()) {
      setError('A name for the merged wishlist is required.');
      return;
    }

    // Call the parent state merge handler
    const validationError = onMergeWishlists(sourceAId, sourceBId, mergedName);
    
    if (validationError) {
      setError(validationError);
    } else {
      // Clear local form states and navigate to the list details page
      setSourceAId('');
      setSourceBId('');
      setMergedName('');
      setError('');
      if (onNavigate) {
        onNavigate('wishlists');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Merge <span className="text-gradient">Center</span></h1>
          <p className="page-subtitle">Combine items from two wishlists into a brand-new list without losing your original data.</p>
        </div>
      </div>

      <form onSubmit={handleMergeSubmit} className="merge-container glass-card">
        <div className="merge-form-header">
          <GitMerge size={28} className="merge-header-icon" />
          <h2>Configure Merge</h2>
        </div>

        {error && (
          <div className="form-error-banner glass-panel">
            <AlertCircle size={18} className="error-banner-icon" />
            <span>{error}</span>
          </div>
        )}

        <div className="merge-steps-grid">
          {/* Step 1: Select Wishlist A */}
          <div className="form-group">
            <label className="form-label" htmlFor="source-a-select">1. Select First Wishlist</label>
            <select 
              id="source-a-select"
              className="form-select" 
              value={sourceAId}
              onChange={(e) => {
                setSourceAId(e.target.value);
                setError('');
              }}
            >
              <option value="" disabled>Choose a wishlist...</option>
              {wishlists.map((wl) => (
                <option key={wl.id} value={wl.id}>
                  {wl.name} ({wl.items.length} items)
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Wishlist B */}
          <div className="form-group">
            <label className="form-label" htmlFor="source-b-select">2. Select Second Wishlist</label>
            <select 
              id="source-b-select"
              className="form-select" 
              value={sourceBId}
              onChange={(e) => {
                setSourceBId(e.target.value);
                setError('');
              }}
            >
              <option value="" disabled>Choose a wishlist...</option>
              {wishlists.map((wl) => (
                <option 
                  key={wl.id} 
                  value={wl.id}
                  disabled={wl.id === sourceAId} // Prevent selecting duplicate source
                >
                  {wl.name} ({wl.items.length} items)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 3: Destination Name */}
        <div className="form-group destination-name-group">
          <label className="form-label" htmlFor="merged-name-input">3. Merged Wishlist Name</label>
          <input 
            id="merged-name-input"
            type="text" 
            className="form-input" 
            placeholder="e.g., Combined Tech & Gifts" 
            value={mergedName}
            onChange={(e) => {
              setMergedName(e.target.value);
              setError('');
            }}
          />
          <small className="form-hint">Must be a unique, non-empty name (case-insensitive).</small>
        </div>

        {/* Merge Safety Info Banner */}
        <div className="info-banner">
          <HelpCircle size={20} className="info-icon" />
          <div className="info-text">
            <h4>Non-Destructive Merge</h4>
            <p>Both source wishlists remain completely unmodified. Overlapping items keep their <strong>earliest</strong> addition date to preserve your original interest history.</p>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={wishlists.length < 2}
          >
            <GitMerge size={18} />
            <span>Create Merged Wishlist</span>
          </button>
        </div>
      </form>
    </div>
  );
}
