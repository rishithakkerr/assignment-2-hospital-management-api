const express = require('express');
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
const cors = require('cors');
const db = require('./config/db');
const passport = require('./config/passport');
const logger = require('./middleware/requestLogger');
const router = require('./router/router');

const app = express();

// Render sits behind a proxy - needed so secure cookies work correctly
app.set('trust proxy', 1);

// Allow your Netlify frontend (a different origin) to send requests
// with cookies attached (credentials: 'include' on the frontend).
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());
app.use(logger);

const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
    secret: "hospitalSecretKey",
    resave: false,
    saveUninitialized: false,
    // MemoryStore (the default) loses all sessions on every restart/deploy
    // and leaks memory - not viable on Render. Store sessions in Atlas instead.
    store: MongoStore.create({
        mongoUrl: db.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: isProduction,        // requires HTTPS - true on Render
        sameSite: isProduction ? 'none' : 'lax' // 'none' needed cross-site (Netlify -> Render)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (request, response) => {
    response.send("Welcome to Hospital APIs");
});

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
