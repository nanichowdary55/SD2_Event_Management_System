-- Event Ticket Booking System - Database Schema & Seed Data

CREATE DATABASE IF NOT EXISTS eventbooking;
USE eventbooking;

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('customer', 'organizer', 'admin') NOT NULL DEFAULT 'customer',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id    INT NOT NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    category        ENUM('concert', 'conference', 'sports', 'workshop', 'other') NOT NULL DEFAULT 'other',
    event_date      DATETIME NOT NULL,
    location        VARCHAR(200) NOT NULL,
    total_capacity  INT NOT NULL,
    tickets_sold    INT NOT NULL DEFAULT 0,
    price           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    image_url       VARCHAR(255) DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    event_id        INT NOT NULL,
    quantity        INT NOT NULL DEFAULT 1,
    total_price     DECIMAL(10,2) NOT NULL,
    booking_ref     VARCHAR(20) NOT NULL UNIQUE,
    status          ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
    booked_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────

-- Passwords are bcrypt hashes of '123'
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Sarah',  'David',   'sarah@gmail.com',   '$2a$10$qMGsStAEwhATAWyuLU5GG.r62S9equ738s0sP1fgWos8iBRE/MXa.', 'organizer'),
('Ali',    'Hussain',  'ali@gmail.com',     '$2a$10$qMGsStAEwhATAWyuLU5GG.r62S9equ738s0sP1fgWos8iBRE/MXa.', 'customer'),
('Emma',   'Watson',  'emma@gmail.com',    '$2a$10$qMGsStAEwhATAWyuLU5GG.r62S9equ738s0sP1fgWos8iBRE/MXa.', 'customer'),
('James',  'Miller',  'james@gmail.com',   '$2a$10$qMGsStAEwhATAWyuLU5GG.r62S9equ738s0sP1fgWos8iBRE/MXa.', 'organizer'),
('Admin',  'User',    'admin@gmail.com',   '$2a$10$qMGsStAEwhATAWyuLU5GG.r62S9equ738s0sP1fgWos8iBRE/MXa.', 'admin');

INSERT INTO events (organizer_id, title, description, category, event_date, location, total_capacity, tickets_sold, price, image_url) VALUES
(1, 'Summer Music Festival',
 'Join us for an unforgettable summer music experience featuring top artists from around the world. Multiple stages, food vendors, and interactive art installations.',
 'concert', '2026-06-15 14:00:00', 'Central Park, New York', 500, 234, 45.00, '/uploads/event1.jpg'),

(1, 'Tech Conference 2026',
 'The premier technology conference of the year. Featuring keynotes from industry leaders, hands-on workshops, and networking sessions for developers and entrepreneurs.',
 'conference', '2026-07-22 09:00:00', 'Convention Center, San Francisco', 300, 187, 120.00, '/uploads/event2.jpg'),

(1, 'Food & Wine Expo',
 'Discover the finest cuisines and wines from around the globe. Meet top chefs, attend tasting sessions, and enjoy live cooking demonstrations.',
 'other', '2026-08-10 11:00:00', 'Waterfront Plaza, Chicago', 400, 356, 35.00, '/uploads/event3.jpg'),

(4, 'NodeConf Europe 2026',
 'The definitive Node.js conference in Europe. Deep-dive technical talks, workshops, and networking with the Node.js community.',
 'conference', '2026-09-05 09:00:00', 'RDS Arena, Dublin', 600, 412, 150.00, '/uploads/event4.jpg'),

(4, 'Premier League: City vs United',
 'The biggest local derby of the season. Experience the electric atmosphere of top-flight football live at the stadium.',
 'sports', '2026-05-20 15:00:00', 'Etihad Stadium, Manchester', 55000, 54100, 65.00, '/uploads/event5.jpg'),

(1, 'Web Development Workshop',
 'A full-day hands-on workshop covering modern web development with Node.js, Express, and React. Suitable for intermediate developers.',
 'workshop', '2026-04-18 10:00:00', 'Tech Hub, London', 50, 48, 80.00, '/uploads/event6.jpg'),

(4, 'Jazz Night Live',
 'An intimate evening of live jazz featuring some of the most talented musicians in the country. Dinner and drinks available.',
 'concert', '2026-05-30 19:00:00', 'Blue Note Club, New York', 120, 95, 55.00, '/uploads/event7.jpg'),

(1, 'Startup Pitch Competition',
 'Watch emerging startups pitch their ideas to a panel of top investors. Network with founders, investors, and innovators.',
 'other', '2026-06-28 13:00:00', 'Innovation Centre, London', 200, 143, 25.00, '/uploads/event8.jpg');

INSERT INTO bookings (user_id, event_id, quantity, total_price, booking_ref, status) VALUES
(2, 1, 2, 90.00,  'BK-2026-045892', 'confirmed'),
(2, 2, 1, 120.00, 'BK-2026-045893', 'confirmed'),
(2, 3, 4, 140.00, 'BK-2026-045894', 'confirmed'),
(3, 1, 1, 45.00,  'BK-2026-045895', 'confirmed'),
(3, 4, 2, 300.00, 'BK-2026-045896', 'confirmed'),
(2, 6, 1, 80.00,  'BK-2026-045897', 'cancelled'),
(3, 5, 3, 195.00, 'BK-2026-045898', 'confirmed');
