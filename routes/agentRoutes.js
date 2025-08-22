// routes/agentRoutes.js

import express from 'express';
import {
    getAssignedOrders,
    updateOrderStatus,
} from '../controllers/agentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get orders assigned to the agent
// @route   GET /api/agents/orders
// @access  Private (Agent)
router.get('/orders', protect, authorize('agent'), getAssignedOrders);

// @desc    Update order status
// @route   PATCH /api/agents/orders/:id/status
// @access  Private (Agent)
router.patch('/orders/:id/status', protect, authorize('agent'), updateOrderStatus);

export default router;
