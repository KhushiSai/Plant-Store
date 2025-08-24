const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: [{
    type: String,
    required: [true, 'At least one category is required'],
    enum: {
      values: [
        'Indoor', 'Outdoor', 'Succulent', 'Air Purifying', 'Flowering',
        'Herb', 'Home Decor', 'Low Maintenance', 'Hanging', 'Climbing',
        'Medicinal', 'Fragrant', 'Pet Safe', 'Large', 'Small',
        'Desktop', 'Statement Plant', 'Tropical', 'Colorful', 'Edible',
        'Cactus', 'Fast Growing', 'Annual', 'Shade Loving', 'Premium',
        'Unique', 'Rare', 'Ground Cover', 'Desert', 'Trailing',
        'Winter Blooming', 'Prayer Plant', 'Tall', 'Low Light',
        'Mediterranean', 'Elegant'
      ],
      message: 'Invalid category'
    }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: [true, 'Plant image is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image must be a valid URL'
    }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  scientificName: {
    type: String,
    trim: true
  },
  careLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  sunlight: {
    type: String,
    enum: ['Low', 'Medium', 'Bright'],
    default: 'Medium'
  },
  watering: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
plantSchema.index({ name: 'text', description: 'text' });
plantSchema.index({ categories: 1 });
plantSchema.index({ price: 1 });
plantSchema.index({ inStock: 1 });

// Virtual for formatted price
plantSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString()}`;
});

// Virtual for availability status
plantSchema.virtual('availabilityStatus').get(function() {
  return this.inStock ? 'In Stock' : 'Out of Stock';
});

// Static method to get plants by category
plantSchema.statics.findByCategory = function(category) {
  return this.find({ categories: category });
};

// Static method to get plants in stock
plantSchema.statics.findInStock = function() {
  return this.find({ inStock: true });
};

// Static method to search plants
plantSchema.statics.searchPlants = function(searchTerm) {
  return this.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { scientificName: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

// Instance method to toggle stock status
plantSchema.methods.toggleStock = function() {
  this.inStock = !this.inStock;
  return this.save();
};

// Pre-save middleware to ensure categories are unique
plantSchema.pre('save', function(next) {
  if (this.categories) {
    this.categories = [...new Set(this.categories)];
  }
  next();
});

module.exports = mongoose.model('Plant', plantSchema);
