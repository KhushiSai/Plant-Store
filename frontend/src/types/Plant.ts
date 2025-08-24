export interface Plant {
  id: string;
  name: string;
  price: number;
  categories: string[];
  inStock: boolean;
  image: string;
  description?: string;
  scientificName?: string;
  careLevel?: 'Easy' | 'Medium' | 'Hard';
  sunlight?: 'Low' | 'Medium' | 'Bright';
  watering?: 'Low' | 'Medium' | 'High';
}

export interface PlantFilters {
  searchTerm: string;
  selectedCategories: string[];
  inStockOnly: boolean;
}