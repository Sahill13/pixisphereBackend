const express = require('express');
const { 
  getStats, 
  getPendingVerifications, 
  verifyPartner, 
  getAllPartners,
  setPartnerFeatured,
  getAllReviews,
  moderateReview,
  deleteReview,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Stats routes
router.get('/stats', getStats);

// Partner verification routes
router.get('/verifications', getPendingVerifications);
router.put('/verify/:id', verifyPartner);

// Partner management routes
router.get('/partners', getAllPartners);
router.put('/partners/:id/feature', setPartnerFeatured);

// Review moderation routes
router.get('/reviews', getAllReviews);
router.put('/reviews/:id', moderateReview);
router.delete('/reviews/:id', deleteReview);

// Category management routes
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Location management routes
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;