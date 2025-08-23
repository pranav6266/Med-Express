// models/medicineModel.js

import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // REPLACED 'stock' with a store-based inventory system
    inventory: [{
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    }],
    imageUrl: {
        type: String,
        default: '/images/default-medicine.png',
    },
}, {
    timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;