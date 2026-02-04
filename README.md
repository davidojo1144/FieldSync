# FieldSync

**FieldSync** is an Offline-First Mobile ERP designed for field engineers operating in remote or low-connectivity environments (e.g., offshore wind farms, industrial sites). It prioritizes data integrity, local availability, and seamless synchronization when connectivity is restored.

## 🚀 Tech Stack

### Mobile (Client)
*   **Framework**: React Native (via Expo SDK 52)
*   **Language**: TypeScript
*   **Database**: WatermelonDB (SQLite adapter) - *Offline-first source of truth*
*   **Styling**: NativeWind (Tailwind CSS)
*   **Navigation**: Expo Router (File-based routing)
*   **UI Components**: Custom "Rugged Industrial" theme with Safety Orange accents

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **Sync Protocol**: Custom WatermelonDB Sync implementation

---

## ✅ Features Implemented

### 1. Offline-First Architecture
*   **Local Database**: Uses WatermelonDB to store `WorkOrders` and `ChecklistItems` locally on the device.
*   **Sync Engine**: Implemented pull/push synchronization logic to merge local changes with the PostgreSQL backend.

### 2. User Interface (Rugged Industrial Theme)
*   **Engineer Operations Dashboard**: 
    *   Real-time connectivity status (Local-First / P2P Mesh).
    *   Active Work Order list with progress visualization.
    *   "Pending Sync" alerts using Safety Orange indicators.
*   **Work Order & Repair Ticket**: 
    *   Detailed Asset Profiles (Turbine ID, Tech Specs).
    *   Interactive Repair Checklist (Persists state locally).
    *   Technical Specifications Grid.
*   **Sync & Resolution Screen**: 
    *   Visualizes P2P Mesh Network status.
    *   CRDT (Conflict-Free Replicated Data Type) Resolution Timeline.

### 3. Database Schema
Refactored from generic models to domain-specific entities:

#### **Table: `work_orders`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique UUID |
| `title` | string | e.g., "Blade Inspection" |
| `subtitle` | string | Location/Sector info |
| `status` | string | In Progress, Pending, Done |
| `priority` | string | High, Normal, Low |
| `asset_id` | string | Linked Asset Identifier |

#### **Table: `checklist_items`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique UUID |
| `work_order_id`| string | Foreign Key to WorkOrder |
| `title` | string | Task description |
| `is_completed` | boolean| Completion status |
| `requirements` | string | Specific technical requirements |

---

## 🛠️ Setup & Running

### Prerequisites
*   Node.js & npm/yarn
*   PostgreSQL (running locally or Docker)
*   Expo Go app (on physical device) or Android/iOS Simulator

### 1. Backend Setup
```bash
cd FieldSync/server

# Install dependencies
npm install

# Start PostgreSQL (Ensure your .env matches your local DB config)
# Default DB config expects a database named 'fieldsync' or similar accessible via DATABASE_URL

# Start the server
npm run start
# Server runs on http://localhost:3000
```

### 2. Mobile App Setup
```bash
cd FieldSync/mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```
*   Press `a` for Android Emulator.
*   Press `i` for iOS Simulator.
*   Scan QR code with Expo Go for physical device.

---

## 📝 Recent Changelog
*   **Feat**: Integrated 3 core UI screens (Dashboard, Ticket Details, Sync Resolution).
*   **Refactor**: Migrated database schema from `Project/Task` to `WorkOrder/ChecklistItem`.
*   **Fix**: Resolved `expo-linear-gradient` installation issues by configuring local cache.
*   **Feat**: Added "Seed Data" functionality in Dashboard to populate local DB for testing.
