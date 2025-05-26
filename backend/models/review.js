const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Partner',
    required: true
  },
  inquiry: {
    type: mongoose.Schema.ObjectId,
    ref: 'Inquiry'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per partner
ReviewSchema.index({ client: 1, partner: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);