import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import WishlistsPage from './pages/WishlistsPage';
import MergePage from './pages/MergePage';

const LOCAL_STORAGE_KEY = 'aetherstore_wishlist_data';

// Helper to load state from localStorage with fallback defaults
const loadInitialState = () => {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      // Validate schema format before returning
      if (Array.isArray(parsed.wishlists) && parsed.wishlists.length > 0 && parsed.activeWishlistId) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse localStorage wishlist data. Restoring defaults.', err);
  }

  // Fallback defaults if empty or corrupted
  const defaultId = 'wishlist-' + Date.now();
  const defaultWishlist = {
    id: defaultId,
    name: 'My Wishlist',
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return {
    wishlists: [defaultWishlist],
    activeWishlistId: defaultId
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [wishlists, setWishlists] = useState(() => loadInitialState().wishlists);
  const [activeWishlistId, setActiveWishlistId] = useState(() => loadInitialState().activeWishlistId);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      wishlists,
      activeWishlistId
    }));
  }, [wishlists, activeWishlistId]);

  // Add product reference to active wishlist (duplication deduplicated, moves to top)
  const handleAddToWishlist = (productId) => {
    setWishlists(prev => prev.map(wl => {
      if (wl.id !== activeWishlistId) return wl;

      const alreadyExists = wl.items.some(item => item.productId === productId);
      let newItems;
      
      if (alreadyExists) {
        // Move item to the top and update addedAt timestamp
        newItems = [
          { productId, addedAt: new Date().toISOString() },
          ...wl.items.filter(item => item.productId !== productId)
        ];
      } else {
        // Add new item to the top
        newItems = [
          { productId, addedAt: new Date().toISOString() },
          ...wl.items
        ];
      }

      return {
        ...wl,
        items: newItems,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Create a new empty wishlist with naming validation checks
  const handleCreateWishlist = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return 'Wishlist name is required.';
    }

    const nameExists = wishlists.some(wl => wl.name.toLowerCase() === trimmedName.toLowerCase());
    if (nameExists) {
      return 'A wishlist with this name already exists (case-insensitive).';
    }

    const newId = 'wishlist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const newWishlist = {
      id: newId,
      name: trimmedName,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWishlists(prev => [...prev, newWishlist]);
    setActiveWishlistId(newId);
    return null; // indicates success
  };

  // Rename an existing wishlist with naming validation checks
  const handleRenameWishlist = (wishlistId, newName) => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      return 'Wishlist name is required.';
    }

    const nameExists = wishlists.some(wl => 
      wl.id !== wishlistId && wl.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameExists) {
      return 'A wishlist with this name already exists (case-insensitive).';
    }

    setWishlists(prev => prev.map(wl => {
      if (wl.id !== wishlistId) return wl;
      return {
        ...wl,
        name: trimmedName,
        updatedAt: new Date().toISOString()
      };
    }));

    return null; // indicates success
  };

  // Delete a wishlist and adjust the active wishlist reference
  const handleDeleteWishlist = (wishlistId) => {
    const updatedWishlists = wishlists.filter(wl => wl.id !== wishlistId);
    
    if (updatedWishlists.length === 0) {
      // Recreate default wishlist if the last one was deleted
      const defaultId = 'wishlist-' + Date.now();
      const defaultWishlist = {
        id: defaultId,
        name: 'My Wishlist',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWishlists([defaultWishlist]);
      setActiveWishlistId(defaultId);
    } else {
      setWishlists(updatedWishlists);
      if (activeWishlistId === wishlistId) {
        setActiveWishlistId(updatedWishlists[0].id);
      }
    }
  };

  // Remove a product reference from a wishlist
  const handleRemoveItem = (wishlistId, productId) => {
    setWishlists(prev => prev.map(wl => {
      if (wl.id !== wishlistId) return wl;
      return {
        ...wl,
        items: wl.items.filter(item => item.productId !== productId),
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Merge two wishlists into a new one, keeping the EARLIEST addedAt timestamp for duplicates
  const handleMergeWishlists = (sourceAId, sourceBId, mergedName) => {
    const trimmedName = mergedName.trim();
    if (!trimmedName) {
      return 'Wishlist name is required.';
    }

    const nameExists = wishlists.some(wl => wl.name.toLowerCase() === trimmedName.toLowerCase());
    if (nameExists) {
      return 'A wishlist with this name already exists (case-insensitive).';
    }

    const wlA = wishlists.find(wl => wl.id === sourceAId);
    const wlB = wishlists.find(wl => wl.id === sourceBId);

    if (!wlA || !wlB) {
      return 'One or both of the source wishlists could not be found.';
    }
    if (sourceAId === sourceBId) {
      return 'Please select two different wishlists to merge.';
    }

    // Merge using Map for O(1) deduplication
    const mergedMap = new Map();

    wlA.items.forEach(item => {
      mergedMap.set(item.productId, item.addedAt);
    });

    wlB.items.forEach(item => {
      if (mergedMap.has(item.productId)) {
        // Resolve duplicate: KEEP EARLIEST addedAt
        const timeA = new Date(mergedMap.get(item.productId)).getTime();
        const timeB = new Date(item.addedAt).getTime();
        if (timeB < timeA) {
          mergedMap.set(item.productId, item.addedAt);
        }
      } else {
        mergedMap.set(item.productId, item.addedAt);
      }
    });

    const mergedItems = Array.from(mergedMap.entries()).map(([productId, addedAt]) => ({
      productId,
      addedAt
    }));

    // Sort chronologically descending (most recent first)
    mergedItems.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    const newId = 'wishlist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const newWishlist = {
      id: newId,
      name: trimmedName,
      items: mergedItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWishlists(prev => [...prev, newWishlist]);
    setActiveWishlistId(newId);
    return null; // success
  };

  // Find active wishlist details
  const activeWishlist = wishlists.find(wl => wl.id === activeWishlistId) || wishlists[0] || { items: [] };
  const wishlistCount = activeWishlist.items.length;

  const renderActivePage = () => {
    switch (activeTab) {
      case 'catalog':
        return <CatalogPage onAddToWishlist={handleAddToWishlist} />;
      case 'wishlists':
        return (
          <WishlistsPage 
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            onSelectWishlist={setActiveWishlistId}
            onCreateWishlist={handleCreateWishlist}
            onRenameWishlist={handleRenameWishlist}
            onDeleteWishlist={handleDeleteWishlist}
            onRemoveItem={handleRemoveItem}
          />
        );
      case 'merge':
        return (
          <MergePage 
            wishlists={wishlists} 
            onMergeWishlists={handleMergeWishlists} 
            onNavigate={setActiveTab} 
          />
        );
      default:
        return <CatalogPage onAddToWishlist={handleAddToWishlist} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} wishlistCount={wishlistCount}>
      {renderActivePage()}
    </Layout>
  );
}
