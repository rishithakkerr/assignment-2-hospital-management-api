const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username) {
            return response.status(400).json({ message: "Username is required" });
        }
        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return response.status(400).json({ message: "Password is required" });
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return response.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return response.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashPassword
        };
        const user = new User(newUser);
        await user.save();
        return response.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.post('/login', (request, response, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return response.status(500).json({ message: error.message });
        }
        if (!user) {
            return response.status(401).json({ message: info.message });
        }

        request.logIn(user, (error) => {
            if (error) {
                return response.status(500).json({ message: error.message });
            }
            return response.status(200).json({
                message: "Login successful",
                user: { id: user._id, username: user.username }
            });
        });
    })(request, response, next);
});

// IMPORTANT: this must come BEFORE /hospitals/:id, otherwise Express
// treats "available" as the :id value and this route never gets hit.
router.get('/hospitals/available', isAuthenticated, async (request, response) => {
    try {
        const hospitals = await Hospital.find({ availableBeds: { $gt: 0 } });
        response.status(200).json(hospitals);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get('/hospitals', isAuthenticated, async (request, response) => {
    try {
        const hospitals = await Hospital.find({});
        response.status(200).json(hospitals);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get('/hospitals/:id', isAuthenticated, async (request, response) => {
    try {
        const hospital = await Hospital.findById(request.params.id);
        if (!hospital) {
            return response.status(404).json({ message: "Hospital not found" });
        }
        response.status(200).json(hospital);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/hospitals', isAuthenticated, async (request, response) => {
    try {
        const { name, city, totalBeds, availableBeds } = request.body;

        if (!name) {
            return response.status(400).json({ message: "Name is required" });
        }
        if (!city) {
            return response.status(400).json({ message: "City is required" });
        }

        const newHospital = new Hospital({ name, city, totalBeds, availableBeds });
        await newHospital.save();
        response.status(201).json({ message: "Hospital added successfully", hospital: newHospital });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.put('/hospitals/:id', isAuthenticated, async (request, response) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!hospital) {
            return response.status(404).json({ message: "Hospital not found" });
        }
        response.status(200).json({ message: "Hospital updated successfully", hospital });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.delete('/hospitals/:id', isAuthenticated, async (request, response) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(request.params.id);
        if (!hospital) {
            return response.status(404).json({ message: "Hospital not found" });
        }
        response.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;
