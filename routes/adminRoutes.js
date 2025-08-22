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

const router = express.Router();

// --- Medicine Management ---
router.route('/medicines')
    .post(protect, authorize('admin'), createMedicine);

router.route('/medicines/:id')
    .put(protect, authorize('admin'), updateMedicine)
    .delete(protect, authorize('admin'), deleteMedicine);

// --- Order Management ---
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.post('/orders/:id/assign', protect, authorize('admin'), assignAgentToOrder);


export default router;
