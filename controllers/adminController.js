import Medicine from '../models/medicineModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// --- Medicine Controllers ---

export const createMedicine = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/images/default-medicine.png';

        const medicine = new Medicine({
            name,
            description,
            price,
            stock,
            imageUrl, // Save the image path
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
            if (req.file) {
                medicine.imageUrl = `/uploads/${req.file.filename}`;
            }

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
            await medicine.deleteOne();
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
        const orders = await Order.find({})
            .populate('user', 'id name')
            .populate('fulfillmentStore', 'name address')
            .populate('agent', 'name'); // <-- ADD THIS LINE

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
        order.status = 'Accepted';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all medicines (for admin purposes)
 * @route   GET /api/admin/medicines/all
 * @access  Private (Admin)
 */
export const getAllMedicinesAdmin = async (req, res, next) => {
    try {
        // Fetch all medicines without any filtering to populate admin dropdowns
        const medicines = await Medicine.find({}).sort({ name: 1 });
        res.json(medicines);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update stock for a medicine at a specific store
 * @route   PUT /api/admin/inventory
 * @access  Private (Admin)
 */
export const updateStock = async (req, res, next) => {
    const { medicineId, storeId, newStock } = req.body;

    // Basic validation
    if (!medicineId || !storeId || newStock === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Find the specific inventory item in the medicine's inventory array
        const inventoryItem = medicine.inventory.find(
            (item) => item.storeId.toString() === storeId
        );

        if (inventoryItem) {
            // If it exists, update the stock
            inventoryItem.stock = Number(newStock);
        } else {
            // If a medicine isn't assigned to a store, you can't update its stock
            return res.status(404).json({ message: 'Medicine not stocked at this store' });
        }

        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users with the 'agent' role
 * @route   GET /api/admin/agents
 * @access  Private (Admin)
 */
export const getAllAgents = async (req, res, next) => {
    try {
        // Find all users where role is 'agent' and select only their id and name
        const agents = await User.find({ role: 'agent' }).select('id name');
        res.json(agents);
    } catch (error) {
        next(error);
    }
};