const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Partner',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  category: {
    type: String,
    enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product'],
    required: [true, 'Please add a category']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);