# V1 Specification

## Project
E-Commerce Storefront with Wishlist Merge

## Goal
Build a simple React + Vite e-commerce storefront that allows users to browse products, manage multiple wishlists, and merge two wishlists into a new wishlist.

## Product Model
- id
- name
- description
- category
- price
- image
- stock

## Wishlist Model
- id
- name
- items[]
- createdAt
- updatedAt

Wishlist Item
- productId
- addedAt

## Persistence
- Store wishlists and activeWishlistId in localStorage.

## Merge Rules
- Merge two different wishlists.
- Create a new merged wishlist.
- Keep source wishlists unchanged.
- Remove duplicate products using productId.
- Preserve the earliest addedAt timestamp.
- Sort merged items by addedAt.

## Validation
- Wishlist names must be unique.
- Names cannot be empty.
- Prevent merging the same wishlist.

## Tech Stack
- React
- Vite
- JavaScript
- localStorage
- GitHub Pages