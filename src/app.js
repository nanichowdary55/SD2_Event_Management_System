// src/app.js
// Main application entry point

const express        = require('express');
const session        = require('express-session');
const methodOverride = require('method-override');
const path           = require('path');
const routes         = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── View Engine ─────────────────────────
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ───────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:            process.env.SESSION_SECRET || 'devSecret',
    resave:            false,
    saveUninitialized: false,
    cookie:            { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// ─── Routes ───────────────────────────────
app.use('/', routes);

// ─── 404 handler ──────────────────────────
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page not found.', user: req.session.user || null });
});

// ─── Start Server ──────────────────────────
app.listen(PORT, () => {
    console.log(`Event Booking System running at http://localhost:${PORT}`);
});

module.exports = pp;
