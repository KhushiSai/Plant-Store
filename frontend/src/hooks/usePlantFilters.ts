import { useState, useMemo } from 'react';
import { Plant, PlantFilters } from '../types/Plant';

export function usePlantFilters(plants: Plant[]) {
  const [filters, setFilters] = useState<PlantFilters>({
    searchTerm: '',
    selectedCategories: [],
    inStockOnly: false,
  });

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      // Search by name or categories
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = !filters.searchTerm || 
        plant.name.toLowerCase().includes(searchLower) ||
        plant.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
        (plant.scientificName && plant.scientificName.toLowerCase().includes(searchLower)) ||
        (plant.description && plant.description.toLowerCase().includes(searchLower));

      // Filter by selected categories
      const matchesCategories = filters.selectedCategories.length === 0 ||
        filters.selectedCategories.some(category => plant.categories.includes(category));

      // Filter by stock status
      const matchesStock = !filters.inStockOnly || plant.inStock;

      return matchesSearch && matchesCategories && matchesStock;
    });
  }, [plants, filters]);

  const updateSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const updateCategories = (selectedCategories: string[]) => {
    setFilters(prev => ({ ...prev, selectedCategories }));
  };

  const toggleInStockOnly = () => {
    setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategories: [],
      inStockOnly: false,
    });
  };

  return {
    filters,
    filteredPlants,
    updateSearchTerm,
    updateCategories,
    toggleInStockOnly,
    clearFilters,
  };
}