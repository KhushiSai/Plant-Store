const API_BASE_URL = 'http://localhost:4000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Plant {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface PlantFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  careLevel?: string;
  sunlight?: string;
  watering?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Plants API
  async getPlants(filters: PlantFilters = {}): Promise<PaginatedResponse<Plant>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return this.request<PaginatedResponse<Plant>>(`/plants?${params.toString()}`);
  }

  async getAllPlants(): Promise<PaginatedResponse<Plant>> {
    return this.request<PaginatedResponse<Plant>>('/plants');
  }

  async getPlant(id: string): Promise<ApiResponse<Plant>> {
    return this.request<ApiResponse<Plant>>(`/plants/${id}`);
  }

  async createPlant(plantData: Omit<Plant, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Plant>> {
    return this.request<ApiResponse<Plant>>('/plants', {
      method: 'POST',
      body: JSON.stringify(plantData),
    });
  }

  async updatePlant(id: string, plantData: Partial<Plant>): Promise<ApiResponse<Plant>> {
    return this.request<ApiResponse<Plant>>(`/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plantData),
    });
  }

  async deletePlant(id: string): Promise<ApiResponse<Plant>> {
    return this.request<ApiResponse<Plant>>(`/plants/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePlantStock(id: string): Promise<ApiResponse<Plant>> {
    return this.request<ApiResponse<Plant>>(`/plants/${id}/toggle-stock`, {
      method: 'PATCH',
    });
  }

  async getPlantsByCategory(category: string): Promise<ApiResponse<Plant[]>> {
    return this.request<ApiResponse<Plant[]>>(`/plants/categories/${category}`);
  }

  async searchPlants(term: string): Promise<ApiResponse<Plant[]>> {
    return this.request<ApiResponse<Plant[]>>(`/plants/search/${term}`);
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>('/categories');
  }

  async getPopularCategories(limit: number = 10): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>(`/categories/popular?limit=${limit}`);
  }

  async getCategoryStats(category: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/categories/${category}/stats`);
  }

  // Health Check
  async getHealth(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/health');
  }

  // Helper method to check if API is available
  async isApiAvailable(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
