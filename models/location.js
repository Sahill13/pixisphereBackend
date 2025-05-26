const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'Please add a city name'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please add a state'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

LocationSchema.index({ city: 1, state: 1 }, { unique: true });

module.exports = mongoose.model('Location', LocationSchema);