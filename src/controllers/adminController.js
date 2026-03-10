// src/controllers/adminController.js
// Handles all admin panel pages

const Admin = require('../models/Admin');

const adminController = {

    // GET /admin — Platform stats dashboard (US-16)
    dashboard: async (req, res) => {
        try {
            const [stats, categoryBreakdown, recentEvents] = await Promise.all([
                Admin.getPlatformStats(),
                Admin.getBookingsByCategory(),
                Admin.getAllEvents()
            ]);
            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                stats,
                categoryBreakdown,
                recentEvents: recentEvents.slice(0, 5), // show latest 5
                user: req.session.user
            });
        } catch (err) {
            console.error('adminController.dashboard error:', err);
            res.status(500).render('error', { message: 'Failed to load admin dashboard.', user: req.session.user });
        }
    },

    // GET /admin/users — Manage all users (US-15)
    users: async (req, res) => {
        try {
            const users = await Admin.getAllUsers();
            res.render('admin/users', {
                title: 'Manage Users',
                users,
                user: req.session.user
            });
        } catch (err) {
            console.error('adminController.users error:', err);
            res.status(500).render('error', { message: 'Failed to load users.', user: req.session.user });
        }
    },

    // POST /admin/users/:id/delete — Delete a user
    deleteUser: async (req, res) => {
        try {
            // Prevent admin from deleting themselves
            if (parseInt(req.params.id) === req.session.user.id) {
                return res.redirect('/admin/users');
            }
            await Admin.deleteUser(req.params.id);
            res.redirect('/admin/users');
        } catch (err) {
            console.error('adminController.deleteUser error:', err);
            res.status(500).render('error', { message: 'Failed to delete user.', user: req.session.user });
        }
    },

    // GET /admin/events — View all events
    events: async (req, res) => {
        try {
            const events = await Admin.getAllEvents();
            res.render('admin/events', {
                title: 'All Events',
                events,
                user: req.session.user
            });
        } catch (err) {
            console.error('adminController.events error:', err);
            res.status(500).render('error', { message: 'Failed to load events.', user: req.session.user });
        }
    },

    // POST /admin/events/:id/delete — Delete any event
    deleteEvent: async (req, res) => {
        try {
            await Admin.deleteEvent(req.params.id);
            res.redirect('/admin/events');
        } catch (err) {
            console.error('adminController.deleteEvent error:', err);
            res.status(500).render('error', { message: 'Failed to delete event.', user: req.session.user });
        }
    }
};

module.exports = adminController;
