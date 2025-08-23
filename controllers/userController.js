// controllers/userController.js

import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';
import User from "../models/userModel.js";

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


/**
 * @desc    Add an item to the user's cart
 * @route   POST /api/users/cart
 * @access  Private (User)
 */
export const addToCart = async (req, res, next) => {
    const { medicineId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        if (medicine.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        const existingItemIndex = user.cart.findIndex(
            (item) => item.medicine.toString() === medicineId
        );

        if (existingItemIndex > -1) {
            // Item already in cart, update quantity
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            user.cart.push({ medicine: medicineId, quantity });
        }

        const updatedUser = await user.save();
        await updatedUser.populate('cart.medicine'); // Populate medicine details
        res.status(200).json(updatedUser.cart);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get the user's cart
 * @route   GET /api/users/cart
 * @access  Private (User)
 */
export const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.medicine');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.cart);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/users/cart/:medicineId
 * @access  Private (User)
 */
export const removeFromCart = async (req, res, next) => {
    const { medicineId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        user.cart = user.cart.filter(
            (item) => item.medicine.toString() !== medicineId
        );

        const updatedUser = await user.save();
        await updatedUser.populate('cart.medicine');
        res.status(200).json(updatedUser.cart);
    } catch (error) {
        next(error);
    }
};