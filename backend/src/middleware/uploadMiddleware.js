// middleware/uploadMiddleware.js

const multer = require('multer');

// ── STORAGE ───────────────────────────────────────────────────
// We use memoryStorage instead of diskStorage.
// This stores the uploaded file as a Buffer in req.file.buffer.
// Advantage: No temporary files on disk. Cleaner and faster.
const storage = multer.memoryStorage();

// ── FILE FILTER ───────────────────────────────────────────────
// This function runs before saving. It checks whether the uploaded
// file is an image type we accept.
const fileFilter = (req, file, cb) => {
    // We allow only these MIME types.
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        // null = no error, true = accept the file
        cb(null, true);
    } else {
        // null = no system error, false = reject the file
        // We pass a custom error that the controller can catch.
        cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

// ── MULTER INSTANCE ────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB maximum file size
    },
});

// ── MULTER ERROR HANDLER ───────────────────────────────────────
// Multer errors (like file too large) are a special type called
// MulterError. We wrap the middleware to catch and handle them cleanly.
//
// Usage in routes: upload.single('photo') becomes uploadSingle
// BUT for simplicity we export the raw multer instance and handle
// Multer errors in Express's global error handler (see server.js).
module.exports = upload;