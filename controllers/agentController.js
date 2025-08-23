// controllers/agentController.js

import Order from '../models/orderModel.js';

/**
 * @desc    Get orders assigned to the logged-in agent
 * @route   GET /api/agents/orders
 * @access  Private (Agent)
 */
export const getAssignedOrders = async (req, res, next) => {
    try {
        // --- KEY CHANGE ---
        // Populate related data to get store and user info for the dashboard.
        const orders = await Order.find({ agent: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('fulfillmentStore', 'name address'); // <-- ADD THIS

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update the status of an order
 * @route   PATCH /api/agents/orders/:id/status
 * @access  Private (Agent)
 */
export const updateOrderStatus = async (req, res, next) => {
    // ... (This function remains unchanged)
    const { status } = req.body;
    const allowedStatuses = ['Picked Up', 'Delivered', 'Cancelled']; // 'Accepted' is done by admin

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.agent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};
