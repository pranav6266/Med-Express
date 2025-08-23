// routes/adminRoutes.js

import express from 'express';
import {
    createMedicine,
    updateMedicine,
    deleteMedicine,
    assignAgentToOrder,
    getAllOrders,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Import uploads middleware

const router = express.Router();

// --- Medicine Management ---
router.route('/medicines')
    .post(protect, authorize('admin'), upload, createMedicine); // Apply middleware

router.route('/medicines/:id')
    .put(protect, authorize('admin'), upload, updateMedicine) // Apply middleware
    .delete(protect, authorize('admin'), deleteMedicine);

// --- Order Management ---
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.post('/orders/:id/assign', protect, authorize('admin'), assignAgentToOrder);

export default router;
