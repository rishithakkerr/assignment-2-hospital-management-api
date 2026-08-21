const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://2025rishit_db_user:WEabMAS2n4hYuB2q@hospital.2wx3mwx.mongodb.net/hospitalmgmt?retryWrites=true&w=majority&appName=hospital';

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Database connected successfully");
});

db.on("disconnected", () => {
    console.log("Database disconnected");
});

db.on("error", (error) => {
    console.log("Database connection error: ", error);
});

module.exports = db;
module.exports.MONGO_URI = MONGO_URI;
