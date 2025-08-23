// controllers/userController.js

import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';
import User from "../models/userModel.js";
import axios from "axios";

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
 * @desc    Create a new order and clear the user's cart
 * @route   POST /api/users/orders
 * @access  Private (User)
 */
export const placeOrder = async (req, res, next) => {
    const { orderItems, deliveryAddress, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        // 1. Convert user's address to coordinates
        const { latitude, longitude } = await getCoordsFromAddress(deliveryAddress);

        // 2. Find the nearest store using a geospatial query
        const nearestStore = await Store.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude] // [longitude, latitude] format
                    }
                }
            }
        });

        if (!nearestStore) {
            return res.status(404).json({ message: 'Could not find a store near you.' });
        }

        // 3. Verify stock for each item at the nearest store
        for (const item of orderItems) {
            const medicine = await Medicine.findById(item.medicine);
            const storeInventory = medicine.inventory.find(
                inv => inv.storeId.toString() === nearestStore._id.toString()
            );

            if (!storeInventory || storeInventory.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sorry, '${medicine.name}' is out of stock at your nearest store (${nearestStore.name}).`
                });
            }
        }

        // 4. If all checks pass, create the order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            deliveryAddress,
            totalAmount,
            fulfillmentStore: nearestStore._id // Assign the nearest store
        });

        const createdOrder = await order.save();
        await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

        res.status(201).json(createdOrder);

    } catch (error) {
        next(error);
    }
};

// in controllers/adminController.js
export const getAllOrders = async (req, res, next) => {
    try {
        // Populate user and the new fulfillmentStore field
        const orders = await Order.find({})
            .populate('user', 'id name')
            .populate('fulfillmentStore', 'name address'); // Add this line
        res.json(orders);
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
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
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

        const existingItemIndex = user.cart.findIndex(
            (item) => item.medicine.toString() === medicineId
        );

        const newQuantity = existingItemIndex > -1
            ? user.cart[existingItemIndex].quantity + quantity
            : quantity;

        if (medicine.stock < newQuantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            user.cart.push({ medicine: medicineId, quantity });
        }

        const updatedUser = await user.save();
        await updatedUser.populate('cart.medicine');
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
 * @desc    Update cart item quantity
 * @route   PUT /api/users/cart/:medicineId
 * @access  Private (User)
 */
export const updateCartItemQuantity = async (req, res, next) => {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        if (quantity > medicine.stock) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        const itemIndex = user.cart.findIndex(item => item.medicine.toString() === medicineId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                user.cart[itemIndex].quantity = quantity;
            } else {
                user.cart.splice(itemIndex, 1);
            }
            const updatedUser = await user.save();
            await updatedUser.populate('cart.medicine');
            res.status(200).json(updatedUser.cart);
        } else {
            return res.status(404).json({ message: "Item not found in cart" });
        }
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

const getCoordsFromAddress = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        }
        throw new Error('Address could not be geocoded.');
    } catch (error) {
        console.error('Geocoding error:', error.message);
        throw new Error('Failed to find coordinates for the address.');
    }
};