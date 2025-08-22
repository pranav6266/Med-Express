// controllers/userController.js

import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';

/**
 * @desc    Fetch all medicines with optional search
 * @route   GET /api/users/medicines
 * @access  Public
 */
export const getMedicines = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i', // Case-insensitive
                },
            }
            : {};

        const medicines = await Medicine.find({ ...keyword });
        res.json(medicines);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new order
 * @route   POST /api/users/orders
 * @access  Private (User)
 */
export const placeOrder = async (req, res, next) => {
    const { orderItems, deliveryAddress, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            deliveryAddress,
            totalAmount,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/users/orders/my
 * @access  Private (User)
 */
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};
