# Steve's Ticker Demo

A real-time React + TypeScript demo showcasing **low-latency data streaming**, **React Query caching**, and a **reducer-based state architecture** designed for scalable financial front-ends.

This project connects to the **Finnhub.io** WebSocket API to stream live equity trades (e.g. TG, AAPL, MSFT, NVDA) and demonstrates how to combine **server-side snapshots** with **push-based updates** for efficient, resilient UIs.

---

- [Steve's Ticker Demo](#steves-ticker-demo)
  - [🚀 Features](#-features)
  - [🧱 Architecture Overview](#-architecture-overview)
  - [🧩 Quick Start](#-quick-start)
    - [1️⃣ Clone \& install](#1️⃣-clone--install)
    - [2️⃣ Add your Finnhub API key](#2️⃣-add-your-finnhub-api-key)
    - [3️⃣ Run locally](#3️⃣-run-locally)
  - [📡 How It Works](#-how-it-works)

---

## 🚀 Features

- **Hybrid data model**

  - Bootstrap via REST `/quote` (React Query snapshot)
  - Merge real-time trades via WebSocket
  - Keep React Query cache warm with live updates

- **Pure reducer pattern**

  - All state transitions are pure and testable
  - Batch incoming trades per "animation frame" to prevent render storms

- **Performance by design**

  - Memoized selectors and virtualised rendering ready

- **Resilience**

  - UI remains responsive even if the socket drops — refreshes snapshot automatically on reconnect
  - Server “ping” messages handled gracefully

- **Technology stack**
  - React 19 + TypeScript
  - React Query v5 (`@tanstack/react-query`)
  - Vite build environment
  - WebSocket streaming (Finnhub API)

---

## 🧱 Architecture Overview

Each trade tick is treated as an **action**, folded through the reducer to create a new immutable state snapshot.  
React Query holds the cached state so other components remain hot without refetching.

---

## 🧩 Quick Start

### 1️⃣ Clone & install

```bash
git clone https://github.com/stevenhankin/ticker-demo.git
cd ticker-demo
npm install
```

### 2️⃣ Add your Finnhub API key

Create a .env.local file:

```bash
VITE_FINNHUB_TOKEN=YOUR_TOKEN_HERE
```

Get your free key from finnhub.io.

### 3️⃣ Run locally

```bash
npm run dev
```

Then open http://localhost:5173

---

## 📡 How It Works

Seed phase: React Query fetches a /quote snapshot for each configured symbol (e.g. AAPL, MSFT, NVDA, TG).

Connect phase: A WebSocket connection opens (wss://ws.finnhub.io?token=…).

Stream phase: Each "trade" message is batched (per animation frame) and dispatched to the reducer as an APPLY_BATCH action.

Sync phase: The same updates are merged into the React Query cache, ensuring any other view using the same key remains warm.

Render phase: The UI re-renders only once per batch, keeping 60 fps even under heavy tick flow.
