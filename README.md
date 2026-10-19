# Shipping Management API

A secure REST API for managing shipping and logistics operations — user authentication, shipment CRUD with ownership, public tracking, filtering, pagination, and sorting. Built with **Node.js, Express, MongoDB (Mongoose), and JWT**.

Inspired by real-world shipping workflows (built while working as an Odoo developer at a marine shipping & logistics company).

## Tech Stack
- **Node.js** + **Express** — server and routing
- **MongoDB** + **Mongoose** — database and modeling
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **validator** — input validation

## Features
- User registration & login with hashed passwords and JWT tokens
- Protected routes via authentication middleware
- Each user manages **only their own** shipments (ownership enforced)
- Full shipment CRUD (create, read, update, delete)
- **Public tracking** endpoint by tracking number (no login required)
- Filtering, pagination, and sorting on shipment lists
- Sensitive data (password, tokens) hidden from all responses
- Status workflow: `pending → in-transit → delivered / cancelled`

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/Shahd-Abdelrazek/shipping-management-api.git
cd shipping-management-api
npm install

# 2. Make sure MongoDB is running locally (mongodb://localhost:27017)

# 3. Start the server
npm start
```
Server runs on `http://localhost:3000`.

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | ❌ | Register a new user, returns user + token |
| POST | `/users/login` | ❌ | Log in, returns user + token |
| POST | `/users/logout` | ✅ | Log out of the current session |
| GET | `/users/me` | ✅ | Get the logged-in user's profile |

### Shipments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/shipments` | ✅ | Create a shipment |
| GET | `/shipments` | ✅ | List my shipments (supports query params) |
| GET | `/shipments/:id` | ✅ | Get one of my shipments |
| PATCH | `/shipments/:id` | ✅ | Update one of my shipments |
| DELETE | `/shipments/:id` | ✅ | Delete one of my shipments |
| GET | `/shipments/track/:trackingNumber` | ❌ | Public tracking by tracking number |

**Query params on `GET /shipments`:**
`?status=in-transit` · `?limit=10&skip=0` · `?sortBy=createdAt:desc`

## Example Requests

**Register**
```http
POST /users/register
Content-Type: application/json

{ "name": "Shahd", "email": "shahd@example.com", "password": "secret123" }
```

**Create a shipment** (send the token from register/login)
```http
POST /shipments
Authorization: Bearer <token>
Content-Type: application/json

{
  "trackingNumber": "SHP1001",
  "customer": "Nile Trading Co",
  "origin": "Alexandria",
  "destination": "Genoa",
  "weightKg": 1200,
  "status": "in-transit"
}
```

**Public tracking**
```http
GET /shipments/track/SHP1001
```

## Project Structure
```
src/
├── app.js              # Express app entry point
├── db/mongoose.js      # Database connection
├── models/
│   ├── user.js         # User model (auth, JWT, hashing)
│   └── shipment.js     # Shipment model (+ owner relationship)
├── middleware/
│   └── auth.js         # JWT authentication middleware
└── routers/
    ├── user.js         # Auth routes
    └── shipment.js     # Shipment routes
```

## Author
**Shahd Abdelrazek** — [GitHub](https://github.com/Shahd-Abdelrazek) · [LinkedIn](https://linkedin.com/in/shahd-abdelrazek725146269)
