// src/models/Admin.js
// Platform-wide statistics and user management for admin

const db = require('./db');

class Admin {

    // Platform-wide stats (US-16)
    static async getPlatformStats() {
        const [[stats]] = await db.execute(`
            SELECT
                (SELECT COUNT(*) FROM users WHERE role = 'customer')   AS total_customers,
                (SELECT COUNT(*) FROM users WHERE role = 'organizer')  AS total_organizers,
                (SELECT COUNT(*) FROM events)                          AS total_events,
                (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS total_bookings,
                (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'confirmed') AS total_revenue
        `);
        return stats;
    }

    // Bookings per category (for stats breakdown)
    static async getBookingsByCategory() {
        const [rows] = await db.execute(`
            SELECT e.category, COUNT(b.id) AS bookings, COALESCE(SUM(b.total_price), 0) AS revenue
            FROM events e
            LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'confirmed'
            GROUP BY e.category
            ORDER BY bookings DESC
        `);
        return rows;
    }

    // All events across all organizers
    static async getAllEvents() {
        const [rows] = await db.execute(`
            SELECT e.*, u.first_name, u.last_name,
                   (e.total_capacity - e.tickets_sold) AS tickets_remaining,
                   (e.tickets_sold * e.price) AS revenue
            FROM events e
            JOIN users u ON e.organizer_id = u.id
            ORDER BY e.created_at DESC
        `);
        return rows;
    }

    // All users (US-15)
    static async getAllUsers() {
        const [rows] = await db.execute(`
            SELECT u.*,
                (SELECT COUNT(*) FROM bookings WHERE user_id = u.id AND status = 'confirmed') AS booking_count,
                (SELECT COUNT(*) FROM events WHERE organizer_id = u.id) AS event_count
            FROM users u
            ORDER BY u.created_at DESC
        `);
        return rows;
    }

    // Delete a user
    static async deleteUser(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
    }

    // Delete an event (admin override)
    static async deleteEvent(id) {
        await db.execute('DELETE FROM events WHERE id = ?', [id]);
    }
}

module.exports = Adin;
