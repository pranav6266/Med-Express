// routes/userRoutes.js

import express from 'express';
import {
    getMedicines,
    placeOrder,
    getMyOrders,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all medicines
// @route   GET /api/users/medicines
// @access  Public
router.get('/medicines', getMedicines);

// @desc    Place a new order
// @route   POST /api/users/orders
// @access  Private (User)
router.post('/orders', protect, authorize('user'), placeOrder);

// @desc    Get logged in user's orders
// @route   GET /api/users/orders/my
// @access  Private (User)
router.get('/orders/my', protect, authorize('user'), getMyOrders);

export default router;
