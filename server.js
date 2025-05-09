require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:3000', 'https://sampathresidency-palani.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }));
  
  app.options('*', cors());  

app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));