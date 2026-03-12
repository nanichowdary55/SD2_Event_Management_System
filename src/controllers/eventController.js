// src/controllers/eventController.js
// Handles all event-related request logic

const Event = require('../models/Event');

const eventController = {

    // GET /events — Browse all events with optional search/filter
    index: async (req, res) => {
        try {
            const { search = '', category = '', date = '' } = req.query;
            const events = await Event.getAll({ search, category, date });
            res.render('events/index', {
                title: 'Browse Events',
                events,
                search,
                category,
                date,
                user: req.session.user || null
            });
        } catch (err) {
            console.error('eventController.index error:', err);
            res.status(500).render('error', { message: 'Failed to load events.' });
        }
    },

    // GET /events/:id — View a single event's details
    show: async (req, res) => {
        try {
            const event = await Event.getById(req.params.id);
            if (!event) return res.status(404).render('error', { message: 'Event not found.' });

            res.render('events/show', {
                title: event.title,
                event,
                user: req.session.user || null
            });
        } catch (err) {
            console.error('eventController.show error:', err);
            res.status(500).render('error', { message: 'Failed to load event.' });
        }
    },

    // GET /organizer/events — Organizer dashboard
    dashboard: async (req, res) => {
        try {
            const organizerId = req.session.user.id;
            const [events, stats] = await Promise.all([
                Event.getByOrganizer(organizerId),
                Event.getOrganizerStats(organizerId)
            ]);
            res.render('organizer/dashboard', {
                title: 'Organizer Dashboard',
                events,
                stats,
                user: req.session.user
            });
        } catch (err) {
            console.error('eventController.dashboard error:', err);
            res.status(500).render('error', { message: 'Failed to load dashboard.' });
        }
    },

    // GET /organizer/events/new — Show create event form
    newForm: (req, res) => {
        res.render('organizer/new-event', {
            title: 'Create New Event',
            user: req.session.user
        });
    },

    // POST /organizer/events — Create a new event
    create: async (req, res) => {
        try {
            const { title, description, category, event_date, location, total_capacity, price } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            await Event.create({
                organizerId:   req.session.user.id,
                title, description, category,
                eventDate:     event_date,
                location,
                totalCapacity: parseInt(total_capacity),
                price:         parseFloat(price),
                imageUrl
            });
            res.redirect('/organizer/events');
        } catch (err) {
            console.error('eventController.create error:', err);
            res.status(500).render('error', { message: 'Failed to create event.' });
        }
    },

    // GET /organizer/events/:id/edit — Show edit form
    editForm: async (req, res) => {
        try {
            const event = await Event.getById(req.params.id);
            if (!event || event.organizer_id !== req.session.user.id) {
                return res.status(403).render('error', { message: 'Not authorised.' });
            }
            res.render('organizer/edit-event', {
                title: 'Edit Event',
                event,
                user: req.session.user
            });
        } catch (err) {
            console.error('eventController.editForm error:', err);
            res.status(500).render('error', { message: 'Failed to load event.' });
        }
    },

    // POST /organizer/events/:id — Update event
    update: async (req, res) => {
        try {
            const { title, description, category, event_date, location, total_capacity, price } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            await Event.update(req.params.id, {
                title, description, category,
                eventDate:     event_date,
                location,
                totalCapacity: parseInt(total_capacity),
                price:         parseFloat(price),
                imageUrl
            });
            res.redirect('/organizer/events');
        } catch (err) {
            console.error('eventController.update error:', err);
            res.status(500).render('error', { message: 'Failed to update event.' });
        }
    },

    // POST /organizer/events/:id/delete — Delete event
    delete: async (req, res) => {
        try {
            await Event.delete(req.params.id);
            res.redirect('/organizer/events');
        } catch (err) {
            console.error('eventController.delete error:', err);
            res.status(500).render('error', { message: 'Failed to delete event.' });
        }
    },

    // GET /organizer/events/:id/attendees — View attendees
    attendees: async (req, res) => {
        try {
            const Booking = require('../models/Booking');
            const event    = await Event.getById(req.params.id);
            const bookings = await Booking.getByEvent(req.params.id);
            res.render('organizer/attendees', {
                title: `Attendees - ${event.title}`,
                event,
                bookings,
                user: req.session.user
            });
        } catch (err) {
            console.error('eventController.attendees error:', err);
            res.status(500).render('error', { message: 'Failed to load attendees.' });
        }
    }
};

module.exports = eventController;
