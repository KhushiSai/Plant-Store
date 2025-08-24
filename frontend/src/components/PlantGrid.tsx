import React from 'react';
import { Plant } from '../services/api';
import PlantCard from './PlantCard';
import { Package, Search } from 'lucide-react';

interface PlantGridProps {
  plants: Plant[];
  loading: boolean;
  onViewDetails?: (plant: Plant) => void;
  onAddToCart?: (plant: Plant) => void;
  onToggleFavorite?: (plant: Plant) => void;
  favorites: string[];
}

export default function PlantGrid({ 
  plants, 
  loading, 
  onViewDetails, 
  onAddToCart, 
  onToggleFavorite, 
  favorites 
}: PlantGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any plants matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>
            Showing {plants.length} plant{plants.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          {plants.filter(p => p.inStock).length} in stock
        </div>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <PlantCard
            key={plant._id}
            plant={plant}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(plant._id)}
          />
        ))}
      </div>
    </div>
  );
}