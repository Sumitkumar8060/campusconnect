const bcrypt = require("bcrypt");
const pool = require("../config/db");
const adminAuth = require("../config/firebaseAdmin");

// REGISTER
const register = async (req, res) => {
    let connection;
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate required fields
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing email
        const [existingUsers] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email.trim().toLowerCase()]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Get dedicated connection for transaction
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name.trim(), email.trim().toLowerCase(), hashedPassword]
        );

        const userId = result.insertId;

        await connection.execute(
            "INSERT INTO user_profiles (user_id) VALUES (?)",
            [userId]
        );

        await connection.commit();

        // Automatically establish Express session for the registered student
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error on register:", err);
                return res.status(201).json({
                    message: "Registration successful. Please log in.",
                    user: {
                        id: userId,
                        name: name.trim(),
                        email: email.trim().toLowerCase()
                    }
                });
            }

            req.session.user = {
                id: userId,
                name: name.trim(),
                email: email.trim().toLowerCase()
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Session save error on register:", saveErr);
                    return res.status(201).json({
                        message: "Registration successful. Please log in.",
                        user: {
                            id: userId,
                            name: name.trim(),
                            email: email.trim().toLowerCase()
                        }
                    });
                }

                return res.status(201).json({
                    message: "Registration successful",
                    user: req.session.user
                });
            });
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Register error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const [users] = await pool.execute(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email.trim().toLowerCase()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];
        if (!user.password) {
            return res.status(401).json({
                message: "This account uses Google login. Please continue with Google."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({
                    message: "Could not create session"
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Session save error:", saveErr);
                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                return res.status(200).json({
                    message: "Login successful",
                    user: req.session.user
                });
            });
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
    let connection;
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: "Google ID token is required"
            });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email, name, email_verified } = decodedToken;

        if (!email || !email_verified) {
            return res.status(401).json({
                message: "Google email is not verified"
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [users] = await connection.execute(
            `SELECT id, name, email, google_id
            FROM users
            WHERE google_id = ? OR email = ?
            LIMIT 1`,
            [uid, email.toLowerCase()]
        );

        let user;

        if (users.length > 0) {
            user = users[0];

            if (user.google_id && user.google_id !== uid) {
                await connection.rollback();
                return res.status(409).json({
                    message: "This email is linked to another Google account"
                });
            }

            if (!user.google_id) {
                await connection.execute(
                    "UPDATE users SET google_id = ? WHERE id = ?",
                    [uid, user.id]
                );
            }
        } else {
            const [result] = await connection.execute(
                `INSERT INTO users (name, email, password, google_id)
                 VALUES (?, ?, NULL, ?)`,
                [name || "Google User", email.toLowerCase(), uid]
            );

            user = {
                id: result.insertId,
                name: name || "Google User",
                email: email.toLowerCase(),
                google_id: uid
            };
        }

        await connection.execute(
            `INSERT IGNORE INTO user_profiles (user_id)
             VALUES (?)`,
            [user.id]
        );

        await connection.commit();

        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({
                    message: "Could not create session"
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Session save error:", saveErr);
                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                return res.status(200).json({
                    message: "Google login successful",
                    user: req.session.user
                });
            });
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Google login error:", error);
        return res.status(500).json({
            message: "Google login failed"
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// LOGOUT
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({
                message: "Could not log out"
            });
        }

        res.clearCookie("sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Logout successful"
        });
    });
};

// GET /api/auth/me (Current authenticated student)
const profile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.email, u.created_at, up.profile_picture
             FROM users u
             LEFT JOIN user_profiles up ON u.id = up.user_id
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        req.session.user.name = user.name;

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.profile_picture,
                profile_picture: user.profile_picture,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    logout,
    profile
};
