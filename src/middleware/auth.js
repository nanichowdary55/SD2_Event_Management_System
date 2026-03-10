// src/middleware/auth.js
// Route protection middleware

const auth = {

    // Require any logged-in user
    requireLogin: (req, res, next) => {
        if (!req.session.user) return res.redirect('/login');
        next();
    },

    // Require organizer role
    requireOrganizer: (req, res, next) => {
        if (!req.session.user) return res.redirect('/login');
        if (req.session.user.role !== 'organizer' && req.session.user.role !== 'admin') {
            return res.status(403).render('error', { message: 'Access denied. Organizers only.', user: req.session.user });
        }
        next();
    },

    // Require admin role
    requireAdmin: (req, res, next) => {
        if (!req.session.user) return res.redirect('/login');
        if (req.session.user.role !== 'admin') {
            return res.status(403).render('error', { message: 'Access denied. Admins only.', user: req.session.user });
        }
        next();
    }
};

module.exports = auth;
