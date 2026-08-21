Name: Rishi Thakker
Roll No: 150096725068 
Cohort : Sam Altman

# Hospital Management API

A RESTful API to manage hospitals and bed availability, with session-based user authentication (Node.js, Express, MongoDB/Mongoose, Passport-local).

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user (bcrypt-hashed password) |
| POST | `/login` | No | Log in via Passport local strategy, starts a session |
| GET | `/hospitals` | Yes | Get all hospitals |
| GET | `/hospitals/available` | Yes | Get hospitals with available beds (`availableBeds > 0`) |
| GET | `/hospitals/:id` | Yes | Get a single hospital by ID |
| POST | `/hospitals` | Yes | Add a new hospital |
| PUT | `/hospitals/:id` | Yes | Update a hospital |
| DELETE | `/hospitals/:id` | Yes | Delete a hospital |

Auth is session/cookie-based (not JWT) — log in once via `/login`, and the session cookie authenticates subsequent requests automatically.
