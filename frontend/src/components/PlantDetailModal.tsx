import React from 'react';
import { Plant } from '../services/api';
import { X, ShoppingCart, Tag, Info, Sun, Droplets, Leaf, Heart, Share2, Minus, Plus } from 'lucide-react';

interface PlantDetailModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (plant: Plant, quantity: number) => void;
  onToggleFavorite?: (plant: Plant) => void;
  isFavorite?: boolean;
}

export default function PlantDetailModal({ 
  plant, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}: PlantDetailModalProps) {
  const [quantity, setQuantity] = React.useState(1);

  if (!isOpen || !plant) return null;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const getCareColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSunlightIcon = (level: string) => {
    switch (level) {
      case 'Low': return '🌙';
      case 'Medium': return '⛅';
      case 'Bright': return '☀️';
      default: return '💡';
    }
  };

  const getWateringIcon = (level: string) => {
    switch (level) {
      case 'Low': return '💧';
      case 'Medium': return '💧💧';
      case 'High': return '💧💧💧';
      default: return '💧';
    }
  };

  const handleAddToCart = () => {
    if (plant.inStock && onAddToCart) {
      onAddToCart(plant, quantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: plant.name,
          text: `Check out this ${plant.name} at Urvann!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${plant.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-600">
              {plant.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(plant)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
                {plant.scientificName && (
                  <p className="text-lg text-gray-500 italic mb-3">{plant.scientificName}</p>
                )}
                <div className="text-4xl font-bold text-emerald-600 mb-4">
                  {formatPrice(plant.price)}
                </div>
              </div>

              {/* Description */}
              {plant.description && (
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-2">
                    <Info className="h-5 w-5 mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{plant.description}</p>
                </div>
              )}

              {/* Care Information */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <Leaf className="h-5 w-5 mr-2" />
                  Care Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plant.careLevel && (
                    <div className={`p-3 rounded-lg border ${getCareColor(plant.careLevel)}`}>
                      <div className="text-sm font-medium">Care Level</div>
                      <div className="text-lg font-semibold">{plant.careLevel}</div>
                    </div>
                  )}
                  
                  {plant.sunlight && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                      <div className="text-sm font-medium flex items-center">
                        <span className="mr-1">{getSunlightIcon(plant.sunlight)}</span>
                        Sunlight
                      </div>
                      <div className="text-lg font-semibold">{plant.sunlight}</div>
                    </div>
                  )}
                  
                  {plant.watering && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
                      <div className="text-sm font-medium flex items-center">
                        <span className="mr-1">{getWateringIcon(plant.watering)}</span>
                        Watering
                      </div>
                      <div className="text-lg font-semibold">{plant.watering}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <Tag className="h-5 w-5 mr-2" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plant.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4 border-t border-gray-200">
                {plant.inStock && (
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleAddToCart}
                  disabled={!plant.inStock}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    plant.inStock
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>
                    {plant.inStock ? `Add ${quantity} to Cart` : 'Currently Out of Stock'}
                  </span>
                </button>
                
                {plant.inStock && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Free shipping on orders above ₹999
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}