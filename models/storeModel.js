// models/storeModel.js

import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
}, {
    timestamps: true
});

// Create a geospatial index for efficient location-based queries
storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

export default Store;