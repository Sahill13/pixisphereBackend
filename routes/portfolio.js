const express = require('express');
const { 
  addPortfolioItem, 
  getPortfolioItems, 
  updatePortfolioItem, 
  deletePortfolioItem,
  reorderPortfolioItems
} = require('../controllers/portfolioController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and partner role
router.use(protect);
router.use(authorize('partner'));

router.post('/', addPortfolioItem);
router.get('/', getPortfolioItems);
router.put('/reorder', reorderPortfolioItems);
router.put('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);

module.exports = router;