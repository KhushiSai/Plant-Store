import React from 'react';
import { Leaf, Plus, Search, Filter, ShoppingCart, Heart, User } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  categories: string[];
  inStockOnly: boolean;
  onInStockToggle: () => void;
  onAddPlantClick: () => void;
  cartItemCount?: number;
  favoriteCount?: number;
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onProfileClick?: () => void;
}

export default function Header({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  categories,
  inStockOnly,
  onInStockToggle,
  onAddPlantClick,
  cartItemCount = 0,
  favoriteCount = 0,
  onCartClick,
  onFavoritesClick,
  onProfileClick,
}: HeaderProps) {
  const handleCategorySelect = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(updated);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Urvann</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={onFavoritesClick}
              className="relative p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <Heart className="h-6 w-6" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </button>

            {/* Add Plant Button */}
            <button
              onClick={onAddPlantClick}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Admin Feature
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="pb-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants by name or category..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Stock Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onInStockToggle}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    selectedCategories.includes(category)
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
              
              {categories.length > 8 && (
                <details className="relative">
                  <summary className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200">
                    +{categories.length - 8} more
                  </summary>
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-48">
                    <div className="grid grid-cols-2 gap-2">
                      {categories.slice(8).map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:scale-105 ${
                            selectedCategories.includes(category)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded"
                >
                  {category}
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className="ml-1 text-emerald-600 hover:text-emerald-800 hover:scale-110 transition-transform duration-200"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => onCategoryChange([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline hover:scale-105 transition-transform duration-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}