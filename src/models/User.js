// src/models/User.js
// Handles all database operations for users

const db     = require('./db');
const bcrypt = require('bcryptjs');

class User {

    // Find user by email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );
        return rows[0] || null;
    }

    // Find user by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?', [id]
        );
        return rows[0] || null;
    }

    // Create a new user
    static async create({ firstName, lastName, email, password, role }) {
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.execute(`
            INSERT INTO users (first_name, last_name, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        `, [firstName, lastName, email, hashed, role]);
        return result.insertId;
    }

    // Validate password
    static async verifyPassword(plainText, hash) {
        return bcrypt.compare(plainText, hash);
    }

    // Get all users (admin)
    static async getAll() {
        const [rows] = await db.execute(
            'SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }
}

module.exports = User;
