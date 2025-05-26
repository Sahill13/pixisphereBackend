const User = require('../models/user');
const Partner = require('../models/partner');
const Inquiry = require('../models/inquiry');
const Review = require('../models/review');
const Category = require('../models/category');
const Location = require('../models/location');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
exports.getStats = async (req, res) => {
  try {
    // Count total clients
    const totalClients = await User.countDocuments({ role: 'client' });
    
    // Count total partners
    const totalPartners = await Partner.countDocuments();
    
    // Count pending verifications
    const pendingVerifications = await Partner.countDocuments({ verificationStatus: 'pending' });
    
    // Count total inquiries
    const totalInquiries = await Inquiry.countDocuments();
    
    // Count new inquiries
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    
    // Count responded inquiries
    const respondedInquiries = await Inquiry.countDocuments({ status: 'responded' });
    
    // Count booked inquiries
    const bookedInquiries = await Inquiry.countDocuments({ status: 'booked' });
    
    // Count pending reviews
    const pendingReviews = await Review.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      data: {
        userStats: {
          totalClients,
          totalPartners,
          pendingVerifications
        },
        inquiryStats: {
          total: totalInquiries,
          new: newInquiries,
          responded: respondedInquiries,
          booked: bookedInquiries
        },
        reviewStats: {
          pendingReviews
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all pending partner verifications
// @route   GET /api/admin/verifications
// @access  Private (admin)
exports.getPendingVerifications = async (req, res) => {
  try {
    const partners = await Partner.find({ verificationStatus: 'pending' })
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify or reject partner
// @route   PUT /api/admin/verify/:id
// @access  Private (admin)
exports.verifyPartner = async (req, res) => {
  try {
    const { status, comment } = req.body;

    if (!status || !['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (verified or rejected)'
      });
    }

    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    // Update verification status
    partner.verificationStatus = status;
    
    if (status === 'rejected' && comment) {
      partner.verificationComment = comment;
    }
    
    if (status === 'verified') {
      partner.verifiedAt = Date.now();
      partner.verifiedBy = req.user.id;
    }
    
    await partner.save();

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all partners
// @route   GET /api/admin/partners
// @access  Private (admin)
exports.getAllPartners = async (req, res) => {
  try {
    const { status, city, service } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.verificationStatus = status;
    }
    
    if (city) {
      query.city = city;
    }
    
    if (service) {
      query.services = service;
    }
    
    const partners = await Partner.find(query)
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Set partner as featured
// @route   PUT /api/admin/partners/:id/feature
// @access  Private (admin)
exports.setPartnerFeatured = async (req, res) => {
  try {
    const { featured } = req.body;
    
    if (typeof featured !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid featured value (true or false)'
      });
    }
    
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    partner.isFeatured = featured;
    await partner.save();
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const { approved } = req.query;
    
    // Build query
    const query = {};
    
    if (approved) {
      query.isApproved = approved === 'true';
    }
    
    const reviews = await Review.find(query)
      .populate({
        path: 'client',
        select: 'name email'
      })
      .populate({
        path: 'partner',
        select: 'businessName'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve or reject review
// @route   PUT /api/admin/reviews/:id
// @access  Private (admin)
exports.moderateReview = async (req, res) => {
  try {
    const { approved, comment } = req.body;
    
    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid approved value (true or false)'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Update review
    review.isApproved = approved;
    
    if (comment) {
      review.comment = comment; // Update comment if provided
    }
    
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (admin)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.create({
      name,
      description
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    await category.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all locations
// @route   GET /api/admin/locations
// @access  Private (admin)
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ city: 1 });
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create location
// @route   POST /api/admin/locations
// @access  Private (admin)
exports.createLocation = async (req, res) => {
  try {
    const { city, state } = req.body;
    
    const location = await Location.create({
      city,
      state,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update location
// @route   PUT /api/admin/locations/:id
// @access  Private (admin)
exports.updateLocation = async (req, res) => {
  try {
    const { city, state, isActive } = req.body;
    
    let location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    location = await Location.findByIdAndUpdate(
      req.params.id,
      { city, state, isActive },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/admin/locations/:id
// @access  Private (admin)
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    await location.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    // Build query
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow changing user's password from here
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};