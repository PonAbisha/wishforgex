# WishForgeX

A React-based e-commerce storefront with multi-wishlist management, non-destructive wishlist merging, and localStorage persistence.

## Overview

WishForgeX lets users create and manage multiple independent wishlists while shopping, rather than being restricted to a single default list. A key feature is its **non-destructive merge logic** — when two wishlists are combined, items from both are preserved instead of one overwriting the other, which prevents accidental data loss for returning users.

## Features

- **Multi-wishlist management** — create, rename, and switch between multiple independent wishlists
- **Non-destructive merging** — combine two wishlists without losing items from either
- **Client-side persistence** — wishlist state is saved via `localStorage`, so it survives page reloads and browser restarts without needing a backend
- **Responsive storefront UI** — browse and add products to any wishlist

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** CSS
- **State/Persistence:** React state + browser localStorage
- **Linting:** Oxlint

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/PonAbisha/wishforgex.git
cd wishforgex
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build for production

```bash
npm run build
```

## Project Structure

```
wishforgex/
├── public/         # Static assets
├── src/            # Application source code
│   ├── components/ # React components
│   ├── ...
├── index.html
├── vite.config.js
└── package.json
```

## Live Demo

_(Add your deployed link here once hosted — e.g. Vercel or Netlify)_

## Future Improvements

- Backend integration for cross-device wishlist sync
- User authentication
- Shareable wishlist links

## License

This project is open source and available for personal/educational use.