const express = require('express');
const { 
  createInquiry, 
  getClientInquiries, 
  getInquiry, 
  updateInquiryStatus, 
  deleteInquiry 
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and client role
router.use(protect);
router.use(authorize('client'));

router.post('/', createInquiry);
router.get('/', getClientInquiries);
router.get('/:id', getInquiry);
router.put('/:id', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;