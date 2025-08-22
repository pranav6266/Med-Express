// controllers/adminController.js

import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// --- Medicine Controllers ---

export const createMedicine = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;
        const medicine = new Medicine({
            name,
            description,
            price,
            stock,
        });
        const createdMedicine = await medicine.save();
        res.status(201).json(createdMedicine);
    } catch (error) {
        next(error);
    }
};

export const updateMedicine = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            medicine.name = name || medicine.name;
            medicine.description = description || medicine.description;
            medicine.price = price || medicine.price;
            medicine.stock = stock !== undefined ? stock : medicine.stock;

            const updatedMedicine = await medicine.save();
            res.json(updatedMedicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        next(error);
    }
};


export const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            await medicine.deleteOne(); // or .remove() for older mongoose versions
            res.json({ message: 'Medicine removed' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        next(error);
    }
};


// --- Order Controllers ---

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const assignAgentToOrder = async (req, res, next) => {
    const { agentId } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const agent = await User.findById(agentId);
        if (!agent || agent.role !== 'agent') {
            return res.status(404).json({ message: 'Agent not found or user is not an agent' });
        }

        order.agent = agentId;
        order.status = 'Accepted'; // Automatically update status
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};
