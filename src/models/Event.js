// src/models/Event.js
// Handles all database operations for events

const db = require('./db');

class Event {

    // Get all events with optional search/filter
    static async getAll({ search = '', category = '', date = '' } = {}) {
        let sql = `
            SELECT e.*, u.first_name, u.last_name,
                   (e.total_capacity - e.tickets_sold) AS tickets_remaining
            FROM events e
            JOIN users u ON e.organizer_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            sql += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (category) {
            sql += ' AND e.category = ?';
            params.push(category);
        }
        if (date) {
            sql += ' AND DATE(e.event_date) = ?';
            params.push(date);
        }

        sql += ' ORDER BY e.event_date ASC';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    // Get a single event by ID
    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT e.*, u.first_name, u.last_name,
                   (e.total_capacity - e.tickets_sold) AS tickets_remaining
            FROM events e
            JOIN users u ON e.organizer_id = u.id
            WHERE e.id = ?
        `, [id]);
        return rows[0] || null;
    }

    // Get all events by organizer
    static async getByOrganizer(organizerId) {
        const [rows] = await db.execute(`
            SELECT e.*,
                   (e.total_capacity - e.tickets_sold) AS tickets_remaining,
                   (e.tickets_sold * e.price) AS revenue
            FROM events e
            WHERE e.organizer_id = ?
            ORDER BY e.event_date ASC
        `, [organizerId]);
        return rows;
    }

    // Create a new event
    static async create({ organizerId, title, description, category, eventDate, location, totalCapacity, price, imageUrl = null }) {
        const [result] = await db.execute(`
            INSERT INTO events (organizer_id, title, description, category, event_date, location, total_capacity, price, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [organizerId, title, description, category, eventDate, location, totalCapacity, price, imageUrl]);
        return result.insertId;
    }

    // Update an event
    static async update(id, { title, description, category, eventDate, location, totalCapacity, price, imageUrl }) {
        // Only update image if a new one was uploaded
        if (imageUrl) {
            await db.execute(`
                UPDATE events
                SET title = ?, description = ?, category = ?, event_date = ?,
                    location = ?, total_capacity = ?, price = ?, image_url = ?
                WHERE id = ?
            `, [title, description, category, eventDate, location, totalCapacity, price, imageUrl, id]);
        } else {
            await db.execute(`
                UPDATE events
                SET title = ?, description = ?, category = ?, event_date = ?,
                    location = ?, total_capacity = ?, price = ?
                WHERE id = ?
            `, [title, description, category, eventDate, location, totalCapacity, price, id]);
        }
    }

    // Delete an event
    static async delete(id) {
        await db.execute('DELETE FROM events WHERE id = ?', [id]);
    }

    // Get organizer dashboard stats
    static async getOrganizerStats(organizerId) {
        const [rows] = await db.execute(`
            SELECT
                COUNT(*)                    AS total_events,
                COALESCE(SUM(tickets_sold), 0) AS total_tickets_sold,
                COALESCE(SUM(tickets_sold * price), 0) AS total_revenue
            FROM events
            WHERE organizer_id = ?
        `, [organizerId]);
        return rows[0];
    }
}

module.exports = Event;
