// controllers/agentController.js

import Order from '../models/orderModel.js';

/**
 * @desc    Get orders assigned to the logged-in agent
 * @route   GET /api/agents/orders
 * @access  Private (Agent)
 */
export const getAssignedOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ agent: req.user._id });
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
    const { status } = req.body;
    const allowedStatuses = ['Accepted', 'Picked Up', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the agent is assigned to this order
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
