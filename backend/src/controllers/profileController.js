// controllers/profileController.js

const db = require('../config/db');
const imagekit = require('../config/imagekitConfig');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────
// HELPER: Consistent API response formatter
// ─────────────────────────────────────────────────────────────
const sendResponse = (res, statusCode, success, message, data = {}) => {
    return res.status(statusCode).json({
        success,
        message,
        ...data,
    });
};

// ─────────────────────────────────────────────────────────────
// HELPER: Fetch associated student activities, listings, reviews, and stats
// ─────────────────────────────────────────────────────────────
const getUserRelatedData = async (userId) => {
    const [activities] = await db.query(
        `SELECT
            id,
            user_id,
            title,
            category,
            date,
            location,
            companions_count AS companionsCount,
            status,
            role
        FROM activities
        WHERE user_id = ?
        ORDER BY id DESC`,
        [userId]
    );

    const [listings] = await db.query(
        `SELECT
            id,
            user_id,
            title,
            service,
            category,
            price,
            status,
            image,
            link,
            DATE_FORMAT(created_at, '%b %d, %Y') AS date
        FROM marketplace_listings
        WHERE user_id = ?
        ORDER BY id DESC`,
        [userId]
    );

    const [reviews] = await db.query(
        `SELECT
            id,
            user_id,
            reviewer_id,
            reviewer_name AS reviewerName,
            reviewer_dept AS reviewerDept,
            reviewer_avatar AS reviewerAvatar,
            rating,
            service,
            comment,
            COALESCE(date, DATE_FORMAT(created_at, '%b %d, %Y')) AS date
        FROM user_reviews
        WHERE user_id = ?
        ORDER BY id DESC`,
        [userId]
    );

    const totalPosts = listings.length + activities.length;
    const activeListings = listings.filter((l) => l.status === 'Active').length;
    const completedActivities = activities.filter((a) => a.status === 'Completed').length;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviews).toFixed(1))
        : 5.0;

    return {
        activities,
        listings,
        reviews,
        stats: {
            totalPosts,
            activeListings,
            completedActivities,
            averageRating,
            totalReviews,
        },
    };
};

// Format profile object to support both snake_case and camelCase for UI compatibility
const formatProfileResponse = (rawProfile, relatedData) => {
    let interests = rawProfile.interests;
    if (interests && typeof interests === 'string') {
        try {
            interests = JSON.parse(interests);
        } catch {
            interests = [];
        }
    }
    if (!Array.isArray(interests)) {
        interests = [];
    }

    const joinedDate = rawProfile.created_at
        ? new Date(rawProfile.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
          })
        : 'Recently';

    return {
        ...rawProfile,
        interests,
        fullName: rawProfile.name || '',
        avatar: rawProfile.profile_picture || '',
        yearOfStudy: rawProfile.year_of_study || '',
        generalLocation: rawProfile.location || '',
        studentId: `STU-${rawProfile.id}`,
        joinedDate,
        isVerified: true,
        stats: relatedData.stats,
        activities: relatedData.activities,
        listings: relatedData.listings,
        reviews: relatedData.reviews,
    };
};

// ─────────────────────────────────────────────────────────────
// API 1: GET /api/profile/me
// Fetches the complete profile of the logged-in user.
// ─────────────────────────────────────────────────────────────
const getMyProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const [rows] = await db.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.created_at,
                up.profile_picture,
                up.bio,
                up.university,
                up.course,
                up.year_of_study,
                up.interests,
                up.location,
                COALESCE(up.campus_visibility, 1)   AS campus_visibility,
                COALESCE(up.show_online_status, 1)  AS show_online_status,
                COALESCE(up.notify_messages, 1)      AS notify_messages,
                COALESCE(up.notify_errands, 1)       AS notify_errands
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'User not found.');
        }

        const relatedData = await getUserRelatedData(userId);
        const formattedProfile = formatProfileResponse(rows[0], relatedData);

        return sendResponse(res, 200, true, 'Profile fetched successfully.', {
            profile: formattedProfile,
            activities: relatedData.activities,
            listings: relatedData.listings,
            reviews: relatedData.reviews,
        });
    } catch (error) {
        console.error('getMyProfile error:', error);
        return sendResponse(res, 500, false, 'Server error while fetching profile.');
    }
};

// ─────────────────────────────────────────────────────────────
// API 2: PUT /api/profile/me
// Updates the editable fields of the logged-in user's profile.
// ─────────────────────────────────────────────────────────────
const updateMyProfile = async (req, res) => {
    let connection;
    try {
        const userId = req.session.user.id;
        const { name, fullName, bio, university, course, year_of_study, interests, location } = req.body;

        const effectiveName = (name !== undefined ? name : fullName);

        // Validation
        if (effectiveName !== undefined) {
            if (typeof effectiveName !== 'string' || !effectiveName.trim()) {
                return sendResponse(res, 400, false, 'Full name cannot be blank.');
            }
            if (effectiveName.length > 100) {
                return sendResponse(res, 400, false, 'Full name cannot exceed 100 characters.');
            }
        }

        if (university !== undefined && university && university.length > 200) {
            return sendResponse(res, 400, false, 'University name is too long (max 200 characters).');
        }
        if (course !== undefined && course && course.length > 150) {
            return sendResponse(res, 400, false, 'Course name is too long (max 150 characters).');
        }
        if (year_of_study !== undefined && year_of_study && year_of_study.length > 50) {
            return sendResponse(res, 400, false, 'Year of study is too long (max 50 characters).');
        }
        if (location !== undefined && location && location.length > 150) {
            return sendResponse(res, 400, false, 'Location is too long (max 150 characters).');
        }

        let interestsJson = undefined;
        if (interests !== undefined) {
            if (!Array.isArray(interests)) {
                return sendResponse(res, 400, false, 'Interests must be an array of strings.');
            }
            const allStrings = interests.every(
                (item) => typeof item === 'string' && item.trim().length > 0
            );
            if (!allStrings) {
                return sendResponse(res, 400, false, 'Each interest must be a non-empty string.');
            }
            interestsJson = JSON.stringify(interests);
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Update name in `users` table if provided
        if (effectiveName !== undefined) {
            const trimmedName = effectiveName.trim();
            await connection.query('UPDATE users SET name = ? WHERE id = ?', [trimmedName, userId]);
            if (req.session.user) {
                req.session.user.name = trimmedName;
            }
        }

        // 2. Update or Upsert in `user_profiles`
        const profileFields = [];
        const profileValues = [];

        if (bio !== undefined)           { profileFields.push('bio = ?');           profileValues.push(bio); }
        if (university !== undefined)    { profileFields.push('university = ?');    profileValues.push(university); }
        if (course !== undefined)        { profileFields.push('course = ?');        profileValues.push(course); }
        if (year_of_study !== undefined) { profileFields.push('year_of_study = ?'); profileValues.push(year_of_study); }
        if (interestsJson !== undefined) { profileFields.push('interests = ?');     profileValues.push(interestsJson); }
        if (location !== undefined)      { profileFields.push('location = ?');      profileValues.push(location); }

        if (profileFields.length > 0) {
            // Check if user_profiles row already exists
            const [profileExists] = await connection.query(
                'SELECT id FROM user_profiles WHERE user_id = ?',
                [userId]
            );

            if (profileExists.length > 0) {
                profileValues.push(userId);
                await connection.query(
                    `UPDATE user_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`,
                    profileValues
                );
            } else {
                const insertCols = ['user_id'];
                const insertVals = [userId];
                const insertPlaceholders = ['?'];

                if (bio !== undefined)           { insertCols.push('bio');           insertVals.push(bio);           insertPlaceholders.push('?'); }
                if (university !== undefined)    { insertCols.push('university');    insertVals.push(university);    insertPlaceholders.push('?'); }
                if (course !== undefined)        { insertCols.push('course');        insertVals.push(course);        insertPlaceholders.push('?'); }
                if (year_of_study !== undefined) { insertCols.push('year_of_study'); insertVals.push(year_of_study); insertPlaceholders.push('?'); }
                if (interestsJson !== undefined) { insertCols.push('interests');     insertVals.push(interestsJson); insertPlaceholders.push('?'); }
                if (location !== undefined)      { insertCols.push('location');      insertVals.push(location);      insertPlaceholders.push('?'); }

                await connection.query(
                    `INSERT INTO user_profiles (${insertCols.join(', ')}) VALUES (${insertPlaceholders.join(', ')})`,
                    insertVals
                );
            }
        }

        await connection.commit();

        // Fetch fresh profile
        const [updatedRows] = await db.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.created_at,
                up.profile_picture,
                up.bio,
                up.university,
                up.course,
                up.year_of_study,
                up.interests,
                up.location,
                COALESCE(up.campus_visibility, 1)   AS campus_visibility,
                COALESCE(up.show_online_status, 1)  AS show_online_status,
                COALESCE(up.notify_messages, 1)      AS notify_messages,
                COALESCE(up.notify_errands, 1)       AS notify_errands
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?`,
            [userId]
        );

        const relatedData = await getUserRelatedData(userId);
        const formattedProfile = formatProfileResponse(updatedRows[0], relatedData);

        return sendResponse(res, 200, true, 'Profile updated successfully.', {
            profile: formattedProfile,
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('updateMyProfile error:', error);
        return sendResponse(res, 500, false, 'Server error while updating profile.');
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// ─────────────────────────────────────────────────────────────
// API 3: PUT /api/profile/me/password
// Changes user password after verifying the current password
// ─────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return sendResponse(res, 400, false, 'Please provide both current and new passwords.');
        }

        if (newPassword.length < 8) {
            return sendResponse(res, 400, false, 'New password must be at least 8 characters long.');
        }

        if (currentPassword === newPassword) {
            return sendResponse(res, 400, false, 'New password must be different from your current password.');
        }

        const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'User not found.');
        }

        const user = rows[0];

        if (!user.password) {
            return sendResponse(
                res,
                400,
                false,
                'This account was registered with Google and does not use a password.'
            );
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return sendResponse(res, 400, false, 'Current password is incorrect.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        return sendResponse(res, 200, true, 'Password updated successfully.');
    } catch (error) {
        console.error('changePassword error:', error);
        return sendResponse(res, 500, false, 'Server error while updating password.');
    }
};

// ─────────────────────────────────────────────────────────────
// API 4: PUT /api/profile/me/settings
// Updates user preferences (privacy and notifications)
// ─────────────────────────────────────────────────────────────
const updateSettings = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { campus_visibility, show_online_status, notify_messages, notify_errands } = req.body;

        const fields = [];
        const values = [];

        if (campus_visibility !== undefined)  { fields.push('campus_visibility = ?');  values.push(campus_visibility ? 1 : 0); }
        if (show_online_status !== undefined) { fields.push('show_online_status = ?'); values.push(show_online_status ? 1 : 0); }
        if (notify_messages !== undefined)    { fields.push('notify_messages = ?');    values.push(notify_messages ? 1 : 0); }
        if (notify_errands !== undefined)     { fields.push('notify_errands = ?');     values.push(notify_errands ? 1 : 0); }

        if (fields.length === 0) {
            return sendResponse(res, 400, false, 'No settings provided to update.');
        }

        values.push(userId);

        await db.query(
            `UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = ?`,
            values
        );

        return sendResponse(res, 200, true, 'Settings updated successfully.', {
            settings: {
                campus_visibility,
                show_online_status,
                notify_messages,
                notify_errands,
            },
        });
    } catch (error) {
        console.error('updateSettings error:', error);
        return sendResponse(res, 500, false, 'Server error while updating settings.');
    }
};

// ─────────────────────────────────────────────────────────────
// API 5: DELETE /api/profile/me
// Safely deletes the authenticated student account and clears session
// ─────────────────────────────────────────────────────────────
const deleteAccount = async (req, res) => {
    let connection;
    try {
        const userId = req.session.user.id;
        const { password } = req.body;

        const [users] = await db.query(
            `SELECT u.password, up.imagekit_file_id
             FROM users u
             LEFT JOIN user_profiles up ON u.id = up.user_id
             WHERE u.id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return sendResponse(res, 404, false, 'User not found.');
        }

        const user = users[0];

        // If the user set a password, verify it before deleting
        if (user.password && password) {
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                return sendResponse(res, 400, false, 'Incorrect password. Account deletion aborted.');
            }
        }

        // Delete ImageKit file if present
        if (user.imagekit_file_id) {
            try {
                await imagekit.deleteFile(user.imagekit_file_id);
            } catch (ikErr) {
                console.error('Failed to delete imagekit file on account deletion:', ikErr);
            }
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Foreign keys CASCADE deletes profile, activities, listings, and reviews
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        await connection.commit();

        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error during account deletion:', err);
            }
            res.clearCookie('sid', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            return sendResponse(res, 200, true, 'Account deleted successfully.');
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('deleteAccount error:', error);
        return sendResponse(res, 500, false, 'Server error while deleting account.');
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// ─────────────────────────────────────────────────────────────
// API 6: POST /api/profile/me/photo
// Uploads a profile picture to ImageKit, deletes old file, saves new URL
// ─────────────────────────────────────────────────────────────
const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.session.user.id;

        if (!req.file) {
            return sendResponse(res, 400, false, 'No image file provided.');
        }

        const fileBase64 = req.file.buffer.toString('base64');
        const fileName = `profile_${userId}_${Date.now()}`;

        let uploadResponse;
        try {
            uploadResponse = await imagekit.upload({
                file: fileBase64,
                fileName: fileName,
                folder: '/profile-pictures',
                useUniqueFileName: true,
            });
        } catch (uploadError) {
            console.error('ImageKit upload error:', uploadError);
            return sendResponse(res, 502, false, 'Failed to upload image. Please try again.');
        }

        const newImageUrl = uploadResponse.url;
        const newImageKitFileId = uploadResponse.fileId;

        const [existingRows] = await db.query(
            'SELECT imagekit_file_id FROM user_profiles WHERE user_id = ?',
            [userId]
        );

        const oldImageKitFileId =
            existingRows.length > 0 ? existingRows[0].imagekit_file_id : null;

        await db.query(
            `INSERT INTO user_profiles (user_id, profile_picture, imagekit_file_id)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
                profile_picture = VALUES(profile_picture),
                imagekit_file_id = VALUES(imagekit_file_id)`,
            [userId, newImageUrl, newImageKitFileId]
        );

        if (oldImageKitFileId) {
            try {
                await imagekit.deleteFile(oldImageKitFileId);
            } catch (deleteError) {
                console.error('Failed to delete old ImageKit file:', deleteError);
            }
        }

        return sendResponse(res, 200, true, 'Profile picture uploaded successfully.', {
            profile_picture: newImageUrl,
            avatar: newImageUrl,
        });
    } catch (error) {
        console.error('uploadProfilePicture error:', error);
        return sendResponse(res, 500, false, 'Server error while uploading profile picture.');
    }
};

// ─────────────────────────────────────────────────────────────
// API 7: GET /api/profile/:userId
// Safely returns another student's public profile, activities, listings, and reviews
// ─────────────────────────────────────────────────────────────
const getPublicProfile = async (req, res) => {
    try {
        const targetUserId = parseInt(req.params.userId, 10);

        if (isNaN(targetUserId) || targetUserId <= 0) {
            return sendResponse(res, 400, false, 'Invalid user ID.');
        }

        // Notice: password, google_id, email, imagekit_file_id, private settings are EXCLUDED
        const [rows] = await db.query(
            `SELECT
                u.id,
                u.name,
                u.created_at,
                up.profile_picture,
                up.bio,
                up.university,
                up.course,
                up.year_of_study,
                up.interests,
                up.location,
                COALESCE(up.campus_visibility, 1) AS campus_visibility
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?`,
            [targetUserId]
        );

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'Student not found.');
        }

        const relatedData = await getUserRelatedData(targetUserId);
        const formattedProfile = formatProfileResponse(rows[0], relatedData);

        return sendResponse(res, 200, true, 'Public profile fetched successfully.', {
            profile: formattedProfile,
            activities: relatedData.activities,
            listings: relatedData.listings,
            reviews: relatedData.reviews,
        });
    } catch (error) {
        console.error('getPublicProfile error:', error);
        return sendResponse(res, 500, false, 'Server error while fetching public profile.');
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    updateSettings,
    deleteAccount,
    uploadProfilePicture,
    getPublicProfile,
};
