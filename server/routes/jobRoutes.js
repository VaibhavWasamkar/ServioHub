const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  updateJob,
  completeJobWithRating
} = require('../controllers/jobController');

const auth = require('../middleware/auth');

// ✅ Create a job (only for logged-in users: customers)
router.post('/', auth, createJob);

// ✅ Get all jobs (publicly accessible or can be secured)
router.get('/', getJobs);

// ✅ Update a job (e.g., assign technician, mark as done)
router.patch('/:id', auth, updateJob);

// PATCH /api/jobs/:id/complete
router.patch('/:id/complete', auth, completeJobWithRating);

module.exports = router;
