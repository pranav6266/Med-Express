// routes/adminRoutes.js

import express from 'express';
import {
    createMedicine,
    updateMedicine,
    deleteMedicine,
    assignAgentToOrder,
    getAllOrders, updateStock, getAllMedicinesAdmin, getAllAgents,
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
router.get('/agents', protect, authorize('admin'), getAllAgents);
router.post('/orders/:id/assign', protect, authorize('admin'), assignAgentToOrder);

// Route to get all medicines for admin UI
router.get('/medicines/all', protect, authorize('admin'), getAllMedicinesAdmin);

// Route to update inventory
router.put('/inventory', protect, authorize('admin'), updateStock);
export default router;
