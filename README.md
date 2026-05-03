# Impulso-GYM

A gym member management system built end-to-end as a learning project. Includes a Node.js + Express REST API on top of PostgreSQL, plus a vanilla-JS admin panel that consumes the API from the browser.

## Tech Stack

- **Backend:** Node.js · Express
- **Database:** PostgreSQL (via `pg` connection pool)
- **Frontend (admin):** HTML · vanilla JavaScript · simple dashboard
- **Other:** dotenv (env config), cors, axios (used in the test scripts)

## Features

### REST API

All endpoints under `/api/socios`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/socios`        | List all members |
| `GET`    | `/api/socios/:id`    | Get a single member |
| `POST`   | `/api/socios`        | Create a new member (validates against `tarjetas` table) |
| `PUT`    | `/api/socios/:id`    | Update an existing member |
| `DELETE` | `/api/socios/:id`    | Delete a member |

Validation: every write checks that the supplied `id_tarjeta` (RFID card ID) actually exists in the `tarjetas` table before inserting/updating. Returns proper 400 / 404 / 500 status codes with JSON error bodies.

### Admin panel (`panel.html`)

A small single-page UI served by Express's static middleware. Lets you:

- Load the full member list with a refresh button
- See the active-members count in a metrics card
- Create a new member with inline validation (highlights invalid fields)
- Edit / delete existing members

### Test scripts

The repo ships with hand-written Node scripts that hit the API for quick smoke testing — no test framework, just `axios` calls you can run with `npm run test:post`, `test:put`, etc. There's also `TestDB.js` to verify the PostgreSQL connection is up.

## Project structure

```
.
├── .gitignore
├── README.md
└── gym-backend/
    ├── server.js              # Express app, routes inline, DB queries
    ├── db.js                  # PostgreSQL connection pool
    ├── routes/
    │   └── socios.js          # Cleaner router with full CRUD + validation
    ├── panel.html             # Admin frontend (served as static file)
    ├── package.json           # Dependencies and scripts
    ├── .env.example           # Template for required environment variables
    ├── EnvTest.js             # Quick env-var sanity check
    ├── TestDB.js              # DB connection test
    ├── TestPostSocio.js       # Smoke test — create member
    ├── TestPutSocio.js        # Smoke test — update member
    └── TestDeleteSocio.js     # Smoke test — delete member
```

## Database schema (minimum)

```sql
CREATE TABLE tarjetas (
  id_tarjeta INTEGER PRIMARY KEY
);

CREATE TABLE socios (
  id_socio   SERIAL PRIMARY KEY,
  nombre     TEXT    NOT NULL,
  apellido   TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  telefono   TEXT    NOT NULL,
  id_tarjeta INTEGER NOT NULL REFERENCES tarjetas(id_tarjeta)
);
```

## Running locally

```bash
# 1. Clone
git clone https://github.com/Valensanta7/Impulso-GYM.git
cd Impulso-GYM/gym-backend

# 2. Install dependencies
npm install

# 3. Configure your environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 4. Make sure your DB has the tables (run the SQL from "Database schema" above)

# 5. Test the connection
npm run test:db

# 6. Start the server
npm start
# → http://localhost:3000
# → Admin panel: http://localhost:3000/panel.html
```

## What I learned building this

- Designing a small but realistic REST API with proper HTTP semantics (status codes, validation, JSON error bodies)
- Connecting a Node app to PostgreSQL via a connection pool and writing parameterised queries to avoid SQL injection
- Modularising routes with `express.Router` (see `routes/socios.js` for the cleaner version)
- Serving a static admin frontend from the same Express server
- Validating foreign-key references at the application layer before letting the DB reject them
- Writing throwaway test scripts with `axios` to smoke-test endpoints without a full test framework

## Author

Valentín Santamaría — final-year Software Development student, based in Dublin.
[LinkedIn](https://www.linkedin.com/in/valentin-santamaria-dev) · [Other projects](https://github.com/Valensanta7)
