# Event Ticket Booking System
**SD2 Group Project — Team Members:** Ravi Teja Nekkanti | Pavan Kalyan Pittala | Lokesh Rayala | Naseem Sultana | Hussain Tahir | Badal Narotambhai khunt

---

## Tech Stack
- **Frontend:** PUG templating engine
- **Backend:** Node.js + Express.js
- **Database:** MySQL 8.0
- **Deployment:** Docker + Docker Compose
- **DB Admin:** PHPMyAdmin (via Docker)

---

## Docker Setup

Make sure Docker Desktop is running, then:

```bash
git clone https://github.com/nanichowdary55/SD2_Event_Management_System
cd SD2_Event_Management_System

docker-compose up --build
```

Then open:
- **App:** http://localhost:3000
- **PHPMyAdmin:** http://localhost:8080

The database is automatically seeded with sample data on first run.

---

---

## Test Accounts

| Role       | Email                | Password     |
|------------|----------------------|--------------|
| Organizer  | sarah@gmail.com      | 123          |
| Customer   | ali@gmail.com        | 123          |
| Customer   | emma@gmail.com       | 123          |
| Organizer  | james@gmail.com      | 123          |
| Admin      | admin@gmail.com      | 123          |

---

## Project Structure

```
├── src/
│   ├── app.js                  # Express app entry point
│   ├── controllers/
│   │   ├── authController.js   # Login, register, logout
│   │   ├── eventController.js  # CRUD for events
│   │   └── bookingController.js# Create, view, cancel bookings
│   ├── models/
│   │   ├── db.js               # MySQL connection pool
│   │   ├── Event.js            # Event model
│   │   ├── User.js             # User model
│   │   └── Booking.js          # Booking model
│   ├── routes/
│   │   └── index.js            # All application routes
│   ├── middleware/
│   │   └── auth.js             # Session-based auth guards
│   ├── views/                  # PUG templates
│   │   ├── layout.pug
│   │   ├── events/
│   │   ├── bookings/
│   │   ├── organizer/
│   │   └── auth/
│   └── public/css/style.css
├── db/
│   └── init.sql                # Schema + seed data
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Features

### Customer
- Browse and search/filter events
- View event details and ticket availability
- Book tickets (requires login)
- View booking history (upcoming / past)
- Cancel bookings

### Organizer
- Dashboard with stats (events, tickets sold, revenue)
- Create, edit, delete events
- View attendee list per event

### Architecture
- MVC pattern (Models / Controllers / PUG Views)
- Session-based authentication
- MySQL transactions for safe ticket booking
- Docker Compose for one-command deployment
