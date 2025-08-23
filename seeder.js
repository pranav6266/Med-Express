// seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { users, medicines } from './data/dummyData.js';
import User from './models/userModel.js';
import Medicine from './models/medicineModel.js';
import Order from './models/orderModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await Order.deleteMany();
        await Medicine.deleteMany();


        // Insert new medicines
        const createdMedicines = await Medicine.insertMany(medicines);
        console.log('Users and Medicines Imported!');

        // --- Create Dummy Orders ---
        const sampleOrders = [];
        for (let i = 0; i < 20; i++) {
            // Get 1 to 3 random medicines for the order
            const orderItems = [];
            const numItems = Math.floor(Math.random() * 3) + 1;
            let totalAmount = 0;

            for (let j = 0; j < numItems; j++) {
                const randomMed = createdMedicines[Math.floor(Math.random() * createdMedicines.length)];
                const qty = Math.floor(Math.random() * 3) + 1;
                orderItems.push({
                    medicine: randomMed._id,
                    name: randomMed.name,
                    quantity: qty,
                    price: randomMed.price,
                });
                totalAmount += qty * randomMed.price;
            }

            const statuses = ['Pending', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            sampleOrders.push({
                user: normalUser._id,
                items: orderItems,
                totalAmount: totalAmount,
                deliveryAddress: '123 Test St, Bangalore, India',
                status: randomStatus,
                // Assign an agent only if status is not Pending or Cancelled
                agent: (randomStatus !== 'Pending' && randomStatus !== 'Cancelled') ? agentUser._id : null,
            });
        }

        await Order.insertMany(sampleOrders);
        console.log('Sample Orders Imported!');

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    await connectDB();
    try {
        await Order.deleteMany();
        await Medicine.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

// Check for command line arguments
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
