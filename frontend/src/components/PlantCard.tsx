import React from 'react';
import { Plant } from '../services/api';
import { ShoppingCart, Info, Heart } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onViewDetails?: (plant: Plant) => void;
  onAddToCart?: (plant: Plant) => void;
  onToggleFavorite?: (plant: Plant) => void;
  isFavorite?: boolean;
}

export default function PlantCard({ 
  plant, 
  onViewDetails, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}: PlantCardProps) {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const getCareColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (plant.inStock && onAddToCart) {
      onAddToCart(plant);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(plant);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(plant)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              plant.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {plant.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 left-3">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100 hover:text-red-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Care Level Badge */}
        {plant.careLevel && (
          <div className="absolute top-16 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCareColor(plant.careLevel)}`}>
              {plant.careLevel} Care
            </span>
          </div>
        )}

        {/* Overlay with Details Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(plant);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Scientific Name */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{plant.name}</h3>
          {plant.scientificName && (
            <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
          )}
        </div>

        {/* Description */}
        {plant.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plant.description}</p>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {plant.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
          {plant.categories.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{plant.categories.length - 3}
            </span>
          )}
        </div>

        {/* Care Info */}
        {(plant.sunlight || plant.watering) && (
          <div className="flex justify-between text-xs text-gray-600 mb-3">
            {plant.sunlight && (
              <div className="flex items-center space-x-1">
                <span>☀️</span>
                <span>{plant.sunlight} Light</span>
              </div>
            )}
            {plant.watering && (
              <div className="flex items-center space-x-1">
                <span>💧</span>
                <span>{plant.watering} Water</span>
              </div>
            )}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            {formatPrice(plant.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!plant.inStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              plant.inStock
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{plant.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}