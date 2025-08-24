import React, { useState, useEffect } from 'react';
import { Plant, Category, apiService } from './services/api';
import { usePlantFilters } from './hooks/usePlantFilters';
import Header from './components/Header';
import PlantGrid from './components/PlantGrid';
import AddPlantForm from './components/AddPlantForm';
import PlantDetailModal from './components/PlantDetailModal';

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [cart, setCart] = useState<{ plant: Plant; quantity: number }[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  const {
    filters,
    filteredPlants,
    updateSearchTerm,
    updateCategories,
    toggleInStockOnly,
  } = usePlantFilters(plants);

  // Fetch plants and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plantsResponse, categoriesResponse] = await Promise.all([
          apiService.getAllPlants(),
          apiService.getCategories()
        ]);
        
        if (plantsResponse.success) {
          setPlants(plantsResponse.data);
        }
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.map(cat => cat.name));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setShowNotification({
          message: 'Failed to load plants. Please check your connection.',
          type: 'info'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPlant = async (newPlantData: Omit<Plant, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiService.createPlant(newPlantData);
      if (response.success) {
        setPlants(prevPlants => [response.data, ...prevPlants]);
        setShowNotification({
          message: `${response.data.name} added successfully!`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      setShowNotification({
        message: 'Failed to add plant. Please try again.',
        type: 'info'
      });
    }
  };

  const handleAddToCart = (plant: Plant, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.plant._id === plant._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.plant._id === plant._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { plant, quantity }];
    });
    
    setShowNotification({
      message: `${plant.name} added to cart!`,
      type: 'success'
    });
    
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleToggleFavorite = (plant: Plant) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(plant._id);
      const newFavorites = isFavorite
        ? prevFavorites.filter(id => id !== plant._id)
        : [...prevFavorites, plant._id];
      
      setShowNotification({
        message: isFavorite 
          ? `${plant.name} removed from favorites` 
          : `${plant.name} added to favorites!`,
        type: 'info'
      });
      
      setTimeout(() => setShowNotification(null), 3000);
      return newFavorites;
    });
  };

  const handleCartClick = () => {
    alert(`Cart has ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`);
  };

  const handleFavoritesClick = () => {
    alert(`You have ${favorites.length} favorite plants`);
  };

  const handleProfileClick = () => {
    alert('Profile page coming soon!');
  };

  const handleViewDetails = (plant: Plant) => {
    setSelectedPlant(plant);
  };

  const handleCloseDetails = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            showNotification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {showNotification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        selectedCategories={filters.selectedCategories}
        onCategoryChange={updateCategories}
        categories={categories}
        inStockOnly={filters.inStockOnly}
        onInStockToggle={toggleInStockOnly}
        onAddPlantClick={() => setIsAddFormOpen(true)}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoriteCount={favorites.length}
        onCartClick={handleCartClick}
        onFavoritesClick={handleFavoritesClick}
        onProfileClick={handleProfileClick}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlantGrid
          plants={filteredPlants}
          loading={loading}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      </main>

      {/* Add Plant Form Modal */}
      <AddPlantForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAddPlant={handleAddPlant}
        categories={categories}
      />

      {/* Plant Detail Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        isOpen={!!selectedPlant}
        onClose={handleCloseDetails}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedPlant ? favorites.includes(selectedPlant._id) : false}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 Urvann Mini Plant Store</p>
            <p className="text-sm">Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;