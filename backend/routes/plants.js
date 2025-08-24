const express = require('express');
const Plant = require('../models/Plant');
const router = express.Router();

// GET /api/plants - Get all plants with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      careLevel,
      sunlight,
      watering,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.categories = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }
    
    if (careLevel) {
      filter.careLevel = careLevel;
    }
    
    if (sunlight) {
      filter.sunlight = sunlight;
    }
    
    if (watering) {
      filter.watering = watering;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    let plants;
    let total;
    let totalPages;
    
    if (limit) {
      // With pagination
      const skip = (Number(page) - 1) * Number(limit);
      plants = await Plant.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean();
      
      total = await Plant.countDocuments(filter);
      totalPages = Math.ceil(total / Number(limit));
    } else {
      // Without pagination - return all plants
      plants = await Plant.find(filter)
        .sort(sort)
        .lean();
      
      total = plants.length;
      totalPages = 1;
    }

    res.json({
      success: true,
      data: plants,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: limit ? Number(limit) : total,
        hasNextPage: limit ? Number(page) < totalPages : false,
        hasPrevPage: limit ? Number(page) > 1 : false
      }
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plants',
      message: error.message
    });
  }
});

// GET /api/plants/:id - Get a single plant by ID
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plant',
      message: error.message
    });
  }
});

// POST /api/plants - Create a new plant
router.post('/', async (req, res) => {
  try {
    const plant = new Plant(req.body);
    const savedPlant = await plant.save();
    
    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      data: savedPlant
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create plant',
      message: error.message
    });
  }
});

// PUT /api/plants/:id - Update a plant
router.put('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    res.json({
      success: true,
      message: 'Plant updated successfully',
      data: plant
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update plant',
      message: error.message
    });
  }
});

// DELETE /api/plants/:id - Delete a plant
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    res.json({
      success: true,
      message: 'Plant deleted successfully',
      data: plant
    });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete plant',
      message: error.message
    });
  }
});

// PATCH /api/plants/:id/toggle-stock - Toggle stock status
router.patch('/:id/toggle-stock', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    await plant.toggleStock();
    
    res.json({
      success: true,
      message: `Stock status updated to ${plant.inStock ? 'In Stock' : 'Out of Stock'}`,
      data: plant
    });
  } catch (error) {
    console.error('Error toggling stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle stock status',
      message: error.message
    });
  }
});

// GET /api/plants/categories/:category - Get plants by category
router.get('/categories/:category', async (req, res) => {
  try {
    const plants = await Plant.findByCategory(req.params.category);
    
    res.json({
      success: true,
      data: plants,
      count: plants.length
    });
  } catch (error) {
    console.error('Error fetching plants by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plants by category',
      message: error.message
    });
  }
});

// GET /api/plants/search/:term - Search plants
router.get('/search/:term', async (req, res) => {
  try {
    const plants = await Plant.searchPlants(req.params.term);
    
    res.json({
      success: true,
      data: plants,
      count: plants.length,
      searchTerm: req.params.term
    });
  } catch (error) {
    console.error('Error searching plants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search plants',
      message: error.message
    });
  }
});

module.exports = router;
