const Inquiry = require('../models/inquiry');
const leadService = require('../services/leadService');

// @desc    Create a new inquiry
// @route   POST /api/inquiry
// @access  Private (client)
exports.createInquiry = async (req, res) => {
  try {
    const { category, date, budget, city, description, referenceImageUrl } = req.body;

    // Create inquiry
    const inquiry = await Inquiry.create({
      client: req.user.id,
      category,
      date,
      budget,
      city,
      description,
      referenceImageUrl,
      status: 'new'
    });

    // Match and assign leads to relevant partners
    const matchedPartners = await leadService.matchAndAssignLeads(inquiry);

    res.status(201).json({
      success: true,
      data: inquiry,
      matchedPartnersCount: matchedPartners.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all inquiries for a client
// @route   GET /api/inquiry
// @access  Private (client)
exports.getClientInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ client: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get a single inquiry
// @route   GET /api/inquiry/:id
// @access  Private (client)
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check ownership
    if (inquiry.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiry/:id
// @access  Private (client)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'responded', 'booked', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }

    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check ownership
    if (inquiry.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiry/:id
// @access  Private (client)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check ownership
    if (inquiry.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this inquiry'
      });
    }

    await inquiry.remove();

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