const Partner = require('../models/partner');
const User = require('../models/user');
const Inquiry = require('../models/inquiry');

// @desc    Register as a partner (onboarding)
// @route   POST /api/partner/onboard
// @access  Private (partner)
exports.onboardPartner = async (req, res) => {
  try {
    const { businessName, services, city, about, aadharNumber, portfolioUrls } = req.body;

    // Check if partner profile already exists
    const existingPartner = await Partner.findOne({ user: req.user.id });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'Partner profile already exists'
      });
    }

    // Create partner profile
    const partner = await Partner.create({
      user: req.user.id,
      businessName,
      services,
      city,
      about,
      aadharNumber,
      portfolioUrls: portfolioUrls || [],
      verificationStatus: 'pending'
    });

    res.status(201).json({
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

// @desc    Get partner profile
// @route   GET /api/partner/profile
// @access  Private (partner)
exports.getPartnerProfile = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

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

// @desc    Update partner profile
// @route   PUT /api/partner/profile
// @access  Private (partner)
exports.updatePartnerProfile = async (req, res) => {
  try {
    const { businessName, services, city, about } = req.body;

    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    // Don't allow updating verification status or aadhar number
    const updatedPartner = await Partner.findByIdAndUpdate(
      partner._id,
      { businessName, services, city, about },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedPartner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get leads assigned to partner
// @route   GET /api/partner/leads
// @access  Private (partner)
exports.getLeads = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    if (partner.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Partner must be verified to access leads'
      });
    }

    const inquiries = await Inquiry.find({
      assignedPartners: partner._id
    }).populate({
      path: 'client',
      select: 'name email phone'
    });

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

// @desc    Respond to lead
// @route   PUT /api/partner/leads/:id
// @access  Private (partner)
exports.respondToLead = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['responded', 'booked', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (responded, booked, or closed)'
      });
    }

    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if partner is assigned to this inquiry
    if (!inquiry.assignedPartners.includes(partner._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry'
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