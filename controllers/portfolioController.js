const Portfolio = require('../models/portfolio');
const Partner = require('../models/partner');

// @desc    Add portfolio item
// @route   POST /api/partner/portfolio
// @access  Private (partner)
exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, category, description, imageUrl } = req.body;

    // Find partner
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Count existing items to set display order
    const count = await Portfolio.countDocuments({ partner: partner._id });

    // Create portfolio item
    const portfolioItem = await Portfolio.create({
      partner: partner._id,
      title,
      category,
      description,
      imageUrl,
      displayOrder: count + 1
    });

    res.status(201).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all portfolio items for a partner
// @route   GET /api/partner/portfolio
// @access  Private (partner)
exports.getPortfolioItems = async (req, res) => {
  try {
    // Find partner
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Get portfolio items ordered by displayOrder
    const portfolioItems = await Portfolio.find({ partner: partner._id })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: portfolioItems.length,
      data: portfolioItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/partner/portfolio/:id
// @access  Private (partner)
exports.updatePortfolioItem = async (req, res) => {
  try {
    const { title, category, description, imageUrl, displayOrder } = req.body;

    // Find partner
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Find portfolio item
    let portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check ownership
    if (portfolioItem.partner.toString() !== partner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this portfolio item'
      });
    }

    // Update portfolio item
    portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { title, category, description, imageUrl, displayOrder },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/partner/portfolio/:id
// @access  Private (partner)
exports.deletePortfolioItem = async (req, res) => {
  try {
    // Find partner
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Find portfolio item
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check ownership
    if (portfolioItem.partner.toString() !== partner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this portfolio item'
      });
    }

    // Delete portfolio item
    await portfolioItem.remove();

    // Reorder remaining items
    const remainingItems = await Portfolio.find({ partner: partner._id })
      .sort({ displayOrder: 1 });
    
    for (let i = 0; i < remainingItems.length; i++) {
      remainingItems[i].displayOrder = i + 1;
      await remainingItems[i].save();
    }

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

// @desc    Reorder portfolio items
// @route   PUT /api/partner/portfolio/reorder
// @access  Private (partner)
exports.reorderPortfolioItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of items with id and displayOrder'
      });
    }

    // Find partner
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Update each item
    for (const item of items) {
      if (!item.id || typeof item.displayOrder !== 'number') continue;

      const portfolioItem = await Portfolio.findById(item.id);

      if (portfolioItem && portfolioItem.partner.toString() === partner._id.toString()) {
        portfolioItem.displayOrder = item.displayOrder;
        await portfolioItem.save();
      }
    }

    // Get updated items
    const updatedItems = await Portfolio.find({ partner: partner._id })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: updatedItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};