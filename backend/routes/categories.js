const express = require('express');
const Plant = require('../models/Plant');
const router = express.Router();

// GET /api/categories - Get all available categories with plant counts
router.get('/', async (req, res) => {
  try {
    // Get all unique categories from plants
    const categories = await Plant.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories' } },
      { $sort: { _id: 1 } }
    ]);

    // Get plant count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Plant.countDocuments({ categories: cat._id });
        return {
          name: cat._id,
          count: count
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts,
      totalCategories: categoriesWithCounts.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/categories/popular - Get most popular categories
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularCategories = await Plant.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) }
    ]);

    res.json({
      success: true,
      data: popularCategories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular categories',
      message: error.message
    });
  }
});

// GET /api/categories/:category/stats - Get statistics for a specific category
router.get('/:category/stats', async (req, res) => {
  try {
    const { category } = req.params;

    const stats = await Plant.aggregate([
      { $match: { categories: category } },
      {
        $group: {
          _id: null,
          totalPlants: { $sum: 1 },
          inStock: { $sum: { $cond: ['$inStock', 1, 0] } },
          outOfStock: { $sum: { $cond: ['$inStock', 0, 1] } },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $avg: '$price' },
          careLevels: { $addToSet: '$careLevel' },
          sunlightLevels: { $addToSet: '$sunlight' },
          wateringLevels: { $addToSet: '$watering' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const categoryStats = stats[0];
    delete categoryStats._id;

    res.json({
      success: true,
      data: {
        category,
        ...categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category statistics',
      message: error.message
    });
  }
});

module.exports = router;
