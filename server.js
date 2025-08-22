// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medExpress';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process with failure
    });

// --- API Routes ---
// Placeholder for future routes based on SRS document
app.get('/', (req, res) => {
    res.send('Apollo MedExpress API is running...');
});

// Future routes to be implemented in separate files:
app.use('/api/auth', authRoutes);
//   - app.use('/api/medicines', medicineRoutes);
//   - app.use('/api/cart', cartRoutes);
//   - app.use('/api/orders', orderRoutes);
//   - app.use('/api/admin', adminRoutes);



// --- Global Error Handler ---
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// --- Server Initialization ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});