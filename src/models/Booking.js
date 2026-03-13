// src/models/Booking.js
// Handles all database operations for bookings

const db = require('./db');

class Booking {

    // Generate a unique booking reference
    static generateRef() {
        const year = new Date().getFullYear();
        const num  = Math.floor(100000 + Math.random() * 900000);
        return `BK-${year}-${num}`;
    }

    // Get all bookings for a user (with event info)
    static async getByUser(userId) {
        const [rows] = await db.execute(`
            SELECT b.*, e.title, e.event_date, e.location, e.category
            FROM bookings b
            JOIN events e ON b.event_id = e.id
            WHERE b.user_id = ?
            ORDER BY e.event_date ASC
        `, [userId]);
        return rows;
    }

    // Get upcoming bookings for a user
    static async getUpcomingByUser(userId) {
        const [rows] = await db.execute(`
            SELECT b.*, e.title, e.event_date, e.location, e.category
            FROM bookings b
            JOIN events e ON b.event_id = e.id
            WHERE b.user_id = ? AND b.status = 'confirmed' AND e.event_date > NOW()
            ORDER BY e.event_date ASC
        `, [userId]);
        return rows;
    }

    // Get past bookings for a user
    static async getPastByUser(userId) {
        const [rows] = await db.execute(`
            SELECT b.*, e.title, e.event_date, e.location, e.category
            FROM bookings b
            JOIN events e ON b.event_id = e.id
            WHERE b.user_id = ? AND (b.status = 'cancelled' OR e.event_date <= NOW())
            ORDER BY e.event_date DESC
        `, [userId]);
        return rows;
    }

    // Get a single booking by ID
    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT b.*, e.title, e.event_date, e.location
            FROM bookings b
            JOIN events e ON b.event_id = e.id
            WHERE b.id = ?
        `, [id]);
        return rows[0] || null;
    }

    // Get all attendees for an event (organizer view)
    static async getByEvent(eventId) {
        const [rows] = await db.execute(`
            SELECT b.*, u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            WHERE b.event_id = ?
            ORDER BY b.booked_at DESC
        `, [eventId]);
        return rows;
    }

    // Create a new booking (uses transaction to safely update ticket count)
    static async create(userId, eventId, quantity, totalPrice) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // Lock the event row and check availability
            const [events] = await conn.execute(
                'SELECT total_capacity, tickets_sold FROM events WHERE id = ? FOR UPDATE',
                [eventId]
            );
            const event = events[0];
            if (!event || (event.total_capacity - event.tickets_sold) < quantity) {
                throw new Error('Not enough tickets available');
            }

            // Deduct tickets
            await conn.execute(
                'UPDATE events SET tickets_sold = tickets_sold + ? WHERE id = ?',
                [quantity, eventId]
            );

            // Create booking
            const ref = Booking.generateRef();
            const [result] = await conn.execute(`
                INSERT INTO bookings (user_id, event_id, quantity, total_price, booking_ref)
                VALUES (?, ?, ?, ?, ?)
            `, [userId, eventId, quantity, totalPrice, ref]);

            await conn.commit();
            return { bookingId: result.insertId, bookingRef: ref };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    // Cancel a booking
    static async cancel(bookingId, userId) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [bookings] = await conn.execute(
                'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "confirmed"',
                [bookingId, userId]
            );
            if (!bookings[0]) throw new Error('Booking not found or already cancelled');

            const booking = bookings[0];

            await conn.execute(
                'UPDATE bookings SET status = "cancelled" WHERE id = ?',
                [bookingId]
            );
            await conn.execute(
                'UPDATE events SET tickets_sold = tickets_sold - ? WHERE id = ?',
                [booking.quantity, booking.event_id]
            );

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}
.
module.exports = Booking;
