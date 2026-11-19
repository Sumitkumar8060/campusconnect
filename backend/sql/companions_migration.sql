-- Migration: Find Companions feature (activities and activity_requests)

-- 1. Create activity_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    requester_id INT NOT NULL,
    note TEXT DEFAULT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_actreq_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_actreq_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_actreq_activity (activity_id),
    INDEX idx_actreq_requester (requester_id)
);
