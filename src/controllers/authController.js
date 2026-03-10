// src/controllers/authController.js
// Handles registration, login, and logout

const User = require('../models/User');

const authController = {

    // GET /register
    registerForm: (req, res) => {
        res.render('auth/register', { title: 'Register', user: null, error: null });
    },

    // POST /register
    register: async (req, res) => {
        try {
            const { first_name, last_name, email, password, confirm_password, role } = req.body;

            if (password !== confirm_password) {
                return res.render('auth/register', {
                    title: 'Register', user: null,
                    error: 'Passwords do not match.'
                });
            }

            const existing = await User.findByEmail(email);
            if (existing) {
                return res.render('auth/register', {
                    title: 'Register', user: null,
                    error: 'An account with this email already exists.'
                });
            }

            await User.create({ firstName: first_name, lastName: last_name, email, password, role });
            res.redirect('/login');
        } catch (err) {
            console.error('authController.register error:', err);
            res.render('auth/register', { title: 'Register', user: null, error: 'Registration failed. Please try again.' });
        }
    },

    // GET /login
    loginForm: (req, res) => {
        res.render('auth/login', { title: 'Login', user: null, error: null });
    },

    // POST /login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user || !(await User.verifyPassword(password, user.password))) {
                return res.render('auth/login', {
                    title: 'Login', user: null,
                    error: 'Invalid email or password.'
                });
            }

            // Store user in session (never store password)
            req.session.user = {
                id:         user.id,
                firstName:  user.first_name,
                lastName:   user.last_name,
                email:      user.email,
                role:       user.role
            };

            // Redirect based on role
            if (user.role === 'organizer') return res.redirect('/organizer/events');
            res.redirect('/events');
        } catch (err) {
            console.error('authController.login error:', err);
            res.render('auth/login', { title: 'Login', user: null, error: 'Login failed. Please try again.' });
        }
    },

    // POST /logout
    logout: (req, res) => {
        req.session.destroy(() => res.redirect('/'));
    }
};

module.exports = authController;
