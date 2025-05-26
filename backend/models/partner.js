const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Please add a business name']
  },
  services: [{
    type: String,
    enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product'],
    required: [true, 'Please add at least one service']
  }],
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  about: {
    type: String,
    maxlength: [500, 'About description cannot be more than 500 characters']
  },
  aadharNumber: {
    type: String,
    required: [true, 'Please add Aadhar number']
  },
  portfolioUrls: [{
    type: String
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationComment: {
    type: String
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Partner', PartnerSchema);