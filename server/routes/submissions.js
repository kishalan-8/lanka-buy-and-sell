const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  getUserSubmissions,
  updateSubmission
} = require('../controllers/submissionController');
const { protectUser, protect} = require('../middlewares/auth');
const uploadBikeFiles = require('../middlewares/upload');

// User route
router.post('/', protectUser, uploadBikeFiles, createSubmission);
router.get('/my', protectUser, getUserSubmissions);

// Admin routes
router.get('/', protect, getSubmissions);
router.put('/:id', protect, uploadBikeFiles, updateSubmission);
router.put('/:id/approve', protect, approveSubmission);
router.put('/:id/reject', protect, rejectSubmission);
router.delete('/:id', protect, deleteSubmission);
router.put('/:id', protect, uploadBikeFiles, updateSubmission);

module.exports = router;
