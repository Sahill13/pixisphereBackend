const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product'],
    required: [true, 'Please add a category']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  referenceImageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'responded', 'booked', 'closed'],
    default: 'new'
  },
  assignedPartners: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Partner'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', InquirySchema);