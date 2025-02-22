const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('./config/config');
const authRoutes = require('./routes/authRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

module.exports = app;