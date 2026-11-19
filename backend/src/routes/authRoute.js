
const express = require("express");
const router = express.Router();

const {
    register,
    login,
    googleLogin,
    logout,
    profile
} = require("../controllers/authController");

// const { requireAuth } = require("../middleware/authMiddleware");
const { requireAuth: authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, profile);

module.exports = router;
