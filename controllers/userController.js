// controllers/userController.js

import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';
import User from "../models/userModel.js";
import Store from '../models/storeModel.js';
import axios from "axios";

/**
 * @desc    Fetch all medicines available at a specific store
 * @route   GET /api/users/medicines?storeId=...
 * @access  Public
 */
export const getMedicines = async (req, res, next) => {
    try {
        const { storeId } = req.query;

        // If no storeId is provided, return an empty array
        // as the frontend needs a store to be selected first.
        if (!storeId) {
            return res.json([]);
        }

        // Find all medicines that have an inventory entry for the specified store.
        const medicinesInStore = await Medicine.find({
            'inventory.storeId': storeId
        });

        // --- Data Transformation ---
        // The query above returns the full medicine document, including the
        // entire inventory array for all stores. We will format this data
        // to be cleaner for the frontend.
        const formattedMedicines = medicinesInStore.map(med => {
            // Find the specific inventory details for the selected store.
            const storeInventory = med.inventory.find(
                (inv) => inv.storeId.toString() === storeId
            );

            // Create a new object with a simple 'stock' property instead of the whole array.
            return {
                _id: med._id,
                name: med.name,
                description: med.description,
                price: med.price,
                imageUrl: med.imageUrl,
                stock: storeInventory ? storeInventory.stock : 0, // Fallback to 0 if not found
            };
        });

        res.json(formattedMedicines);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new order from items in the cart for a pre-selected store
 * @route   POST /api/users/orders
 * @access  Private (User)
 */
export const placeOrder = async (req, res, next) => {
    // 1. Destructure all required info from the request body.
    // The fulfillmentStore is now sent directly from the frontend.
    const { orderItems, deliveryAddress, totalAmount, fulfillmentStore } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    if (!fulfillmentStore) {
        return res.status(400).json({ message: 'Store was not selected' });
    }

    try {
        // 2. Verify stock for each item AT THE SPECIFIC fulfillment store.
        for (const item of orderItems) {
            const medicine = await Medicine.findById(item.medicine);
            if (!medicine) {
                return res.status(404).json({ message: `Medicine with id ${item.medicine} not found.` });
            }

            const storeInventory = medicine.inventory.find(
                inv => inv.storeId.toString() === fulfillmentStore
            );

            // Check if the store has this medicine and if the stock is sufficient.
            if (!storeInventory || storeInventory.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sorry, '${medicine.name}' is out of stock at the selected store.`
                });
            }
        }

        // 3. If all stock checks pass, create the new order.
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            deliveryAddress,
            totalAmount,
            fulfillmentStore: fulfillmentStore // Assign the store ID from the request.
        });

        const createdOrder = await order.save();

        // 4. (Important) Clear the user's cart after the order is successfully placed.
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

/**
 * @desc    Fetch all stores to populate selection dropdown
 * @route   GET /api/users/stores
 * @access  Public
 */
export const getAllStores = async (req, res, next) => {
    try {
        // Find all documents in the Store collection
        const stores = await Store.find({});

        // Send the array of stores back as a JSON response
        res.json(stores);
    } catch (error) {
        // Pass any errors to the global error handler
        next(error);
    }
};

// Add these to controllers/userController.js

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.avatar = req.body.avatar || user.avatar;

            // Handle nested address object
            if (req.body.address) {
                user.address = { ...user.address, ...req.body.address };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                // token is not re-issued here, but could be if needed
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Add this new function to controllers/userController.js

/**
 * @desc    Change user password
 * @route   PUT /api/users/profile/changepassword
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both old and new passwords.' });
    }

    try {
        const user = await User.findById(req.user.id);

        // Check if user is found and if the old password matches
        if (user && (await user.matchPassword(oldPassword))) {
            // Set the new password. The pre-save hook in the model will hash it.
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            // If the old password does not match, return an error
            res.status(401).json({ message: 'Invalid old password' });
        }
    } catch (error) {
        next(error);
    }
};