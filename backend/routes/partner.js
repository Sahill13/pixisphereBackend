const express = require('express');
const { 
  onboardPartner, 
  getPartnerProfile, 
  updatePartnerProfile, 
  getLeads, 
  respondToLead 
} = require('../controllers/partnerController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and partner role
router.use(protect);
router.use(authorize('partner'));

router.post('/onboard', onboardPartner);
router.get('/profile', getPartnerProfile);
router.put('/profile', updatePartnerProfile);
router.get('/leads', getLeads);
router.put('/leads/:id', respondToLead);

module.exports = router;