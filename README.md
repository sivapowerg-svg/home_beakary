# SWEET CRUMBS — Home Bakery Order Management System
> *“Little moments. Freshly baked.”*

A complete, production-style full-stack Home Bakery Order Management and Customization System designed with an editorial aesthetic for boutique confectioneries and academic demonstrations.

---

## 🎂 Project Overview

**Sweet Crumbs** is an end-to-end full-stack web application built to streamline operations for a boutique home bakery. Customers can explore seasonal confections, customize cake sizing, flavors, dietary choices (eggless), color palettes, and custom plaque messages with instant live order calculations. The system provides real-time vertical timeline tracking from oven baking to doorstep delivery, alongside a dedicated **Baker Administration Dashboard** for managing orders, changing preparation statuses, and managing the bakery catalog.

---

## ✨ Key Features

### 🍰 Customer Website
1. **Freshly Baked Editorial Homepage**:
   - Hero section with warm cream and terracotta tones.
   - Editorial brand story: *"A little bakery with a lot of heart."*
   - Order timeline breakdown (01 Choose treat → 05 Delivered with love).
   - "Customer Favorites" showcase featuring live database items.
2. **Interactive Bakery Catalog & Menu**:
   - Filter by categories: Cakes, Cupcakes, Brownies, Cookies, Custom Cakes.
   - Live search by name and flavor profile.
   - Sort by price (asc / desc) and check real-time availability.
3. **Product Spotlight & Customization Engine**:
   - High-resolution imagery, flavor notes, and baker descriptions.
   - Multi-step customization:
     - Portion size selection (0.5 kg to 2.0 kg)
     - Sponge & crumb flavors (Belgian Truffle, Red Velvet, Vanilla Bean, etc.)
     - Themes & color palettes
     - Custom cake plaque message
     - Dietary switch (Standard vs. 100% Eggless with real-time fee calculation)
     - Artisanal decorations (French macarons, fresh berries & petals, gold leaf)
     - Delivery date validation (earliest tomorrow, cannot be in past)
     - Preferred time slot and doorstep address
4. **Live Sticky Order Summary & Authoritative Pricing**:
   - Real-time client preview with sticky layout.
   - **Zero Client Trust**: All pricing calculations and validations are executed on the backend API before order creation.
5. **Order Confirmation & Vertical Live Tracking**:
   - Unique order reference generator (e.g., `SC-8421`).
   - Dedicated Track Order page featuring a vertical progress timeline:
     - `Order Placed` → `Confirmed` → `Baking` → `Ready for Delivery` → `Out for Delivery` → `Delivered`.
     - Instant sync with baker dashboard updates.

### 👩‍🍳 Baker / Admin Dashboard (`/admin`)
1. **Protected Workspace**:
   - Baker authentication with simple session management.
2. **Kitchen Overview & Metrics**:
   - Real-time cards: Total Orders, Pending, Baking, Out for Delivery, Completed, Revenue.
   - Visual kitchen pipeline distribution.
3. **Orders Management**:
   - Search by order number, customer name, or phone.
   - Filter by status and delivery date.
   - Order Inspection Drawer: view customer contact, customization specs, delivery window, and fee ledger.
   - Interactive status updater: update statuses with 1 click, instantly updating customer tracking.
4. **Products Catalog Manager**:
   - Add new treats with image URL, category, base price, and baker notes.
   - Edit existing treats, change pricing, and toggle immediate availability / sold out state.
   - Delete retired bakes.
5. **Customer Directory**:
   - View patron profiles, registered locations, order counts, and latest order dates.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Freshly Baked Editorial theme: `#FDFBF7` cream, `#2B1E16` espresso, `#C85A32` terracotta, `#557A60` sage)
- **Routing**: React Router 7 (`react-router-dom`)
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif headings), Plus Jakarta Sans (Body), Caveat (Script accents)

### Backend & Database
- **Live Preview Runtime**: Express + TypeScript (`server.ts` with Vite middleware) running on Node.js v22 on port 3000 with atomic persistent file storage (`data/bakery-db.json`).
- **College Demonstration Spring Boot Project**: Ready-to-run Java 17+ Spring Boot Maven project located in `/backend`:
  - **Framework**: Spring Boot 3.2.3, Spring Web, Spring Data JPA, Hibernate, Bean Validation (`jakarta.validation`).
  - **Databases Supported**: MySQL 8.0, PostgreSQL 15, or zero-config in-memory H2.

### Architectural Diagram
```
┌──────────────────────────────────────────────┐
│          React 19 Frontend (SPA)            │
│   (Vite + TypeScript + Tailwind CSS)         │
└──────────────────────┬───────────────────────┘
                       │ REST API (JSON)
                       ▼
┌──────────────────────────────────────────────┐
│           Spring Boot Controllers            │
│  (ProductController, OrderController, etc.)  │
└──────────────────────┬───────────────────────┘
                       │ Bean Validation & DTOs
                       ▼
┌──────────────────────────────────────────────┐
│                Service Layer                 │
│  (Business rules, pricing math, order # gen) │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             JPA Repositories                 │
│    (Spring Data JPA / Hibernate ORM)         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│            Relational Database               │
│         (MySQL / PostgreSQL / H2)            │
└──────────────────────────────────────────────┘
```

---

## 🗄️ Database Entities & Schema

### 1. `Product` (`products`)
- `id`: BIGINT (Primary Key, Auto-increment)
- `name`: VARCHAR(255) NOT NULL
- `description`: TEXT NOT NULL
- `category`: VARCHAR(100) NOT NULL
- `price`: DECIMAL(10,2) NOT NULL
- `image_url`: TEXT NOT NULL
- `available`: BOOLEAN DEFAULT TRUE
- `created_at`: TIMESTAMP

### 2. `Customer` (`customers`)
- `id`: BIGINT (Primary Key, Auto-increment)
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) NOT NULL UNIQUE
- `phone`: VARCHAR(50) NOT NULL
- `address`: TEXT NOT NULL
- `city`: VARCHAR(100) NOT NULL
- `pincode`: VARCHAR(20) NOT NULL
- `created_at`: TIMESTAMP

### 3. `Order` (`orders`)
- `id`: BIGINT (Primary Key, Auto-increment)
- `order_number`: VARCHAR(50) NOT NULL UNIQUE (e.g., `SC-8421`)
- `customer_id`: BIGINT (Foreign Key referencing `customers.id`)
- `product_id`: BIGINT (Foreign Key referencing `products.id`)
- `quantity`: INT NOT NULL (> 0)
- `size`: VARCHAR(100) NOT NULL
- `flavor`: VARCHAR(150) NOT NULL
- `theme`: VARCHAR(150)
- `cake_message`: TEXT
- `eggless`: BOOLEAN DEFAULT FALSE
- `additional_decorations`: VARCHAR(255)
- `special_instructions`: TEXT
- `delivery_date`: DATE NOT NULL (cannot be in the past)
- `delivery_time`: VARCHAR(100) NOT NULL
- `delivery_address`: TEXT NOT NULL
- `subtotal`: DECIMAL(10,2) NOT NULL (calculated on server)
- `customization_charge`: DECIMAL(10,2) NOT NULL
- `delivery_charge`: DECIMAL(10,2) NOT NULL
- `total`: DECIMAL(10,2) NOT NULL
- `status`: VARCHAR(50) NOT NULL (`PENDING`, `CONFIRMED`, `BAKING`, `READY_FOR_DELIVERY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

---

## 🚀 REST API Endpoints

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all bakery products |
| `GET` | `/api/products/{id}` | Retrieve single product by ID |
| `POST` | `/api/products` | Create a new product (Admin) |
| `PUT` | `/api/products/{id}` | Update product details or availability |
| `DELETE` | `/api/products/{id}` | Remove a product |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create custom order (calculates price, validates date & stock) |
| `GET` | `/api/orders` | Retrieve all orders (Admin) |
| `GET` | `/api/orders/{id}` | Retrieve order by numeric ID |
| `GET` | `/api/orders/track/{orderNumber}` | Public tracking by order reference |
| `PUT` | `/api/orders/{id}/status` | Update order preparation status |
| `DELETE` | `/api/orders/{id}` | Cancel/delete order |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/customers` | Retrieve all registered customers & order statistics |
| `GET` | `/api/customers/{id}` | Retrieve customer profile |
| `POST` | `/api/customers` | Register or update customer details |

### Admin Auth & Stats
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Baker credentials verification |
| `GET` | `/api/admin/stats` | Pipeline metrics & revenue summary |

---

## 🔐 Admin Login Credentials
- **URL**: `/admin/login`
- **Username**: `admin` or `baker@sweetcrumbs.com`
- **Password**: `sweetcrumbs2026`

---

## 💻 How to Run the Application

### 1. Live Web Application (Node.js + Express + React on Port 3000)
The repository is set up with full-stack execution:
```bash
# Install dependencies
npm install

# Start the full-stack server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Spring Boot Backend Setup (Optional for College Java Demo)
Located in `/backend`:
```bash
cd backend

# Build with Maven
mvn clean package

# Run Spring Boot application (runs on port 8080)
mvn spring-boot:run
```
To connect MySQL, uncomment the MySQL section in `/backend/src/main/resources/application.properties` and provide your credentials. The JPA schema and initial seed data will automatically run via `schema.sql` and `data.sql`.

---

## 🔮 Future Improvements
1. Automated SMS / WhatsApp updates when order status changes to "Out for Delivery".
2. Multi-tier cake 3D previewer using Three.js.
3. Subscription boxes for weekly brownie and cookie deliveries.
