# 🌱 Plant Store - Full Stack Application

A complete full-stack plant store application built with React frontend and Node.js backend, featuring a MongoDB database with 50+ realistic plants.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Modern UI/UX** with responsive design
- **Plant Catalog** with filtering and search
- **Plant Details** with comprehensive information
- **Shopping Cart** functionality
- **Favorites** system
- **Add New Plants** form
- **Real-time Updates** from backend API

### Backend (Node.js + Express + MongoDB)
- **MongoDB Integration** with Mongoose 
- **Advanced Filtering** and search capabilities
- **Pagination** support
- **Data Validation** and error handling
- **Security**  CORS
- **50+ Plants Database** with realistic data

## 🏗️ Project Structure

```
Plant Store 3/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js backend API
│   ├── models/              # Mongoose models
│   ├── routes/              # API route handlers
│   ├── server.js            # Main server file
│   ├── seedDatabase.js      # Database seeding script
│   ├── package.json
│   └── README.md
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🛠️ Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account or local MongoDB
- **Git** for version control

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <https://github.com/KhushiSai/Plant-Store>
cd "Plant Store "

# Install all dependencies (both in frontend and backend folder)
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGO_URI=Your _MONGO_URI
NODE_ENV=development
```

### 3. Seed the Database

```bash
# Seed the database with 50 plants
npm run seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend simultaneously
npm run dev
```

This will start:
- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:5173

## 📚 API Documentation



### Endpoints

#### Plants
- `GET /plants` - Get all plants with filtering and pagination
- `GET /plants/:id` - Get a single plant


#### Categories
- `GET /categories` - Get all categories with plant counts
- `GET /categories/popular` - Get most popular categories
- `GET /categories/:category/stats` - Get category statistics

#### Health Check
- `GET /health` - API health status

## 🗄️ Database Schema

### Plant Model
```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  categories: [String] (required),
  inStock: Boolean (default: true),
  image: String (required, URL),
  description: String (max: 500),
  scientificName: String,
  careLevel: String (Easy/Medium/Hard),
  sunlight: String (Low/Medium/Bright),
  watering: String (Low/Medium/High),
  timestamps: true
}
```

### Available Categories
- Indoor, Outdoor, Succulent, Air Purifying
- Flowering, Herb, Home Decor, Low Maintenance
- Hanging, Climbing, Medicinal, Fragrant
- Pet Safe, Large, Small, Desktop
- Statement Plant, Tropical, Colorful, Edible
- Cactus, Fast Growing, Annual, Shade Loving
- Premium



## 🧪 Testing

### API Testing
- **ThunderClient** for API endpoints
- **MongoDB Atlas** for database inspection


### Example API Calls
```bash
# Get all plants
curl http://localhost:4000/api/plants

# Search for plants
curl http://localhost:4000/api/plants?search=monstera

# Filter by category
curl http://localhost:4000/api/plants?category=Indoor

# Get plants with pagination
curl http://localhost:4000/api/plants?page=1&limit=10

# Get categories
curl http://localhost:4000/api/categories

**Happy Planting! 🌿**

