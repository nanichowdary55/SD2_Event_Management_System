// src/routes/index.js
const express           = require('express');
const router            = express.Router();
const authController    = require('../controllers/authController');
const eventController   = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const adminController   = require('../controllers/adminController');
const auth              = require('../middleware/auth');
const upload            = require('../middleware/upload');

router.get('/', (req, res) => res.redirect('/events'));

router.get('/register', authController.registerForm);
router.post('/register', authController.register);
router.get('/login',    authController.loginForm);
router.post('/login',   authController.login);
router.post('/logout',  authController.logout);

router.get('/events',     eventController.index);
router.get('/events/:id', eventController.show);

router.get('/bookings',             auth.requireLogin, bookingController.index);
router.post('/bookings',            auth.requireLogin, bookingController.create);
router.post('/bookings/:id/cancel', auth.requireLogin, bookingController.cancel);

router.get('/organizer/events',               auth.requireOrganizer, eventController.dashboard);
router.get('/organizer/events/new',           auth.requireOrganizer, eventController.newForm);
router.post('/organizer/events',              auth.requireOrganizer, upload.single('image'), eventController.create);
router.get('/organizer/events/:id/edit',      auth.requireOrganizer, eventController.editForm);
router.post('/organizer/events/:id',          auth.requireOrganizer, upload.single('image'), eventController.update);
router.post('/organizer/events/:id/delete',   auth.requireOrganizer, eventController.delete);
router.get('/organizer/events/:id/attendees', auth.requireOrganizer, eventController.attendees);

router.get('/admin',                    auth.requireAdmin, adminController.dashboard);
router.get('/admin/users',              auth.requireAdmin, adminController.users);
router.post('/admin/users/:id/delete',  auth.requireAdmin, adminController.deleteUser);
router.get('/admin/events',             auth.requireAdmin, adminController.events);
router.post('/admin/events/:id/delete', auth.requireAdmin, adminController.deleteEvent);

module.exports = router;
