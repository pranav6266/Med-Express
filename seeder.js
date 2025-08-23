// seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Data needs to be imported before models that use it
import { users, medicines, stores } from './data/dummyData.js';

// --- CORRECTED IMPORT ORDER ---
// Import parent models BEFORE models that reference them
import Store from './models/storeModel.js'; // <-- IMPORT STORE FIRST
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
        await User.deleteMany();
        await Store.deleteMany(); // Clear stores as well

        console.log('Cleared existing data.');

        // --- Step 1: Create Users ---
        const createdUsers = await User.insertMany(users);
        const agentUser = createdUsers.find(u => u.role === 'agent');
        const normalUser = createdUsers.find(u => u.role === 'user');
        console.log('Users Imported!');

        // --- Step 2: Create Stores ---
        const createdStores = await Store.insertMany(stores);
        console.log('Stores Imported!');

        // --- Step 3: Create Medicines with Store-Based Inventory ---
        const medicinesWithInventory = medicines.map(med => {
            const inventory = createdStores.map(store => ({
                storeId: store._id,
                stock: Math.floor(Math.random() * 200) + 10 // Random stock between 10 and 210
            }));
            return { ...med, inventory };
        });

        const createdMedicines = await Medicine.insertMany(medicinesWithInventory);
        console.log('Medicines with Inventory Imported!');

        // --- Step 4: Create Dummy Orders ---
        const sampleOrders = [];
        for (let i = 0; i < 20; i++) {
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

            const randomStore = createdStores[Math.floor(Math.random() * createdStores.length)];

            sampleOrders.push({
                user: normalUser._id,
                items: orderItems,
                totalAmount: totalAmount,
                deliveryAddress: '123 Test St, Bangalore, India',
                status: randomStatus,
                agent: (randomStatus !== 'Pending' && randomStatus !== 'Cancelled') ? agentUser._id : null,
                fulfillmentStore: randomStore._id,
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
        await User.deleteMany();
        await Store.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}