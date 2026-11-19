-- Migration: activities, marketplace_listings, user_reviews, and user_profiles settings

-- 1. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    companions_count INT DEFAULT 0,
    status ENUM('Upcoming', 'Active', 'Completed') DEFAULT 'Active',
    role VARCHAR(100) DEFAULT 'Created by you',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_activities_user_id (user_id)
);

-- 2. Marketplace Listings Table
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    service VARCHAR(100) DEFAULT 'Student Marketplace',
    category VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    status ENUM('Active', 'In Progress', 'Completed') DEFAULT 'Active',
    image VARCHAR(500) DEFAULT NULL,
    link VARCHAR(255) DEFAULT '/marketplace',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_listings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_listings_user_id (user_id)
);

-- 3. User Reviews Table
CREATE TABLE IF NOT EXISTS user_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reviewer_id INT DEFAULT NULL,
    reviewer_name VARCHAR(150) NOT NULL,
    reviewer_dept VARCHAR(150) DEFAULT NULL,
    reviewer_avatar VARCHAR(500) DEFAULT NULL,
    rating TINYINT NOT NULL DEFAULT 5,
    service VARCHAR(100) DEFAULT 'CampusConnect',
    comment TEXT NOT NULL,
    date VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_reviews_user_id (user_id)
);
