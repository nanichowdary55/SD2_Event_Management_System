// src/controllers/bookingController.js
// Handles booking creation, viewing, and cancellation

const Booking = require('../models/Booking');
const Event   = require('../models/Event');

const bookingController = {

    // GET /bookings — My bookings page
    index: async (req, res) => {
        try {
            const userId = req.session.user.id;
            const tab    = req.query.tab || 'upcoming';

            const [upcoming, past] = await Promise.all([
                Booking.getUpcomingByUser(userId),
                Booking.getPastByUser(userId)
            ]);

            res.render('bookings/index', {
                title:    'My Bookings',
                upcoming,
                past,
                activeTab: tab,
                user:     req.session.user
            });
        } catch (err) {
            console.error('bookingController.index error:', err);
            res.status(500).render('error', { message: 'Failed to load bookings.' });
        }
    },

    // POST /bookings — Create a new booking
    create: async (req, res) => {
        try {
            const { event_id, quantity } = req.body;
            const qty   = parseInt(quantity);
            const event = await Event.getById(event_id);

            if (!event) return res.status(404).render('error', { message: 'Event not found.' });

            const totalPrice = (event.price * qty).toFixed(2);
            const { bookingId, bookingRef } = await Booking.create(
                req.session.user.id, event_id, qty, totalPrice
            );

            const booking = await Booking.getById(bookingId);
            res.render('bookings/confirmation', {
                title:   'Booking Confirmed!',
                booking,
                event,
                user:    req.session.user
            });
        } catch (err) {
            console.error('bookingController.create error:', err);
            res.redirect(`/events/${req.body.event_id}?error=booking_failed`);
        }
    },

    // POST /bookings/:id/cancel — Cancel a booking
    cancel: async (req, res) => {
        try {
            await Booking.cancel(req.params.id, req.session.user.id);
            res.redirect('/bookings?tab=upcoming');
        } catch (err) {
            console.error('bookingController.cancel error:', err);
            res.redirect('/bookings?error=cancel_failed');
        }
    }
};

module.exports = bookingController;
