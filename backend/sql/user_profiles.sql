CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    profile_picture VARCHAR(500) DEFAULT NULL,
    imagekit_file_id VARCHAR(255) DEFAULT NULL,

    bio TEXT DEFAULT NULL,
    university VARCHAR(200) DEFAULT NULL,
    course VARCHAR(150) DEFAULT NULL,
    year_of_study VARCHAR(30) DEFAULT NULL,

    interests JSON DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);