
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require('multer');

const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require('./routes/profileRoutes');
const companionsRoutes = require('./routes/companionsRoutes');

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/companions', companionsRoutes);



// This is Express's 4-argument error handler.
// Express recognises it by the 4 parameters (err, req, res, next).
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle specific Multer errors with friendly messages.
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum allowed size is 5 MB.',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Handle our custom fileFilter error (non-image file type).
    if (err && err.message === 'Only JPEG, PNG, and WebP images are allowed.') {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Generic catch-all for any other unexpected errors.
    console.error('Unhandled error:', err);
    return res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred.',
    });
});


module.exports = app;
