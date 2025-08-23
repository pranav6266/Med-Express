// models/orderModel.js

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to a user with the 'agent' role
        default: null,
    },
    // --- KEY CHANGE ---
    // The fulfillmentStore is now required because the user must select
    // a store before they can place an order. The 'default: null' is removed.
    fulfillmentStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        default: 'COD',
    },
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;