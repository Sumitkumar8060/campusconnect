// routes/profileRoutes.js

const express = require('express');
const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    changePassword,
    updateSettings,
    deleteAccount,
    getPublicProfile,
    uploadProfilePicture,
} = require('../controllers/profileController');

const { requireAuth: authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ──────────────────────────────────────────────────────────────
// PRIVATE ROUTES — Require Active Session / Login
// ──────────────────────────────────────────────────────────────

// GET /api/profile/me - Fetch own profile, activities, listings, and reviews
router.get('/me', authMiddleware, getMyProfile);

// PUT /api/profile/me - Update profile fields and name
router.put('/me', authMiddleware, updateMyProfile);

// PUT /api/profile/me/password - Change password
router.put('/me/password', authMiddleware, changePassword);

// PUT /api/profile/me/settings - Update privacy & notification settings
router.put('/me/settings', authMiddleware, updateSettings);

// DELETE /api/profile/me - Delete account and all related records
router.delete('/me', authMiddleware, deleteAccount);

// POST /api/profile/me/photo - Upload profile image to ImageKit
router.post('/me/photo', authMiddleware, upload.single('photo'), uploadProfilePicture);

// ──────────────────────────────────────────────────────────────
// PUBLIC ROUTES — Accessible for any student
// ──────────────────────────────────────────────────────────────

// GET /api/profile/:userId - Safe public profile (placed after /me)
router.get('/:userId', getPublicProfile);

module.exports = router;
