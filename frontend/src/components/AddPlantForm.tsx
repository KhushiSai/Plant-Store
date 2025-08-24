import React, { useState } from 'react';
import { Plant } from '../services/api';
import { X, Plus, Upload, Check } from 'lucide-react';

interface AddPlantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Omit<Plant, '_id' | 'createdAt' | 'updatedAt'>) => void;
  categories: string[];
}

export default function AddPlantForm({ isOpen, onClose, onAddPlant, categories }: AddPlantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categories: [] as string[],
    inStock: true,
    image: '',
    description: '',
    scientificName: '',
    careLevel: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    sunlight: 'Medium' as 'Low' | 'Medium' | 'Bright',
    watering: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const stockImages = [
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/6208071/pexels-photo-6208071.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/4751949/pexels-photo-4751949.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/4751952/pexels-photo-4751952.jpeg?auto=compress&cs=tinysrgb&w=500'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plant name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    if (!formData.image) {
      newErrors.image = 'Please select an image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPlant = {
      ...formData,
      price: parseFloat(formData.price)
    };

    onAddPlant(newPlant);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Show success message and close after delay
    setTimeout(() => {
      setSubmitSuccess(false);
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      categories: [],
      inStock: true,
      image: '',
      description: '',
      scientificName: '',
      careLevel: 'Easy',
      sunlight: 'Medium',
      watering: 'Medium'
    });
    setErrors({});
    setIsSubmitting(false);
    setSubmitSuccess(false);
    onClose();
  };

  const handleCategoryToggle = (category: string) => {
    const updated = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    setFormData({ ...formData, categories: updated });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Plant</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Plant Added Successfully!</h3>
            <p className="text-gray-600">Your new plant has been added to the catalog.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Monstera Deliciosa"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="299"
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Scientific Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scientific Name
                </label>
                <input
                  type="text"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                  placeholder="e.g., Monstera deliciosa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={formData.inStock ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                placeholder="Describe the plant's characteristics..."
              />
            </div>

            {/* Care Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Level
                </label>
                <select
                  value={formData.careLevel}
                  onChange={(e) => setFormData({ ...formData, careLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sunlight
                </label>
                <select
                  value={formData.sunlight}
                  onChange={(e) => setFormData({ ...formData, sunlight: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option value="Low">Low Light</option>
                  <option value="Medium">Medium Light</option>
                  <option value="Bright">Bright Light</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watering
                </label>
                <select
                  value={formData.watering}
                  onChange={(e) => setFormData({ ...formData, watering: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option value="Low">Low Water</option>
                  <option value="Medium">Medium Water</option>
                  <option value="High">High Water</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories * (Select multiple)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="text-red-600 text-sm mt-1">{errors.categories}</p>}
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant Image *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {stockImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      formData.image === imageUrl ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, image: imageUrl })}
                  >
                    <img
                      src={imageUrl}
                      alt={`Option ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                    {formData.image === imageUrl && (
                      <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Plant</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}