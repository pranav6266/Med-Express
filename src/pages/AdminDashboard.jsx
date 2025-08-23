// src/pages/AdminDashboard.jsx

import React, { useState } from 'react';
import Header from '../components/Header';
import OrderManagement from '../components/admin/OrderManagement';
import InventoryManagement from '../components/admin/InventoryManagement';
import MedicineManagement from '../components/admin/MedicineManagement'; // <-- Import the new component

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', or 'medicines'

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <OrderManagement />;
            case 'inventory':
                return <InventoryManagement />;
            case 'medicines':
                return <MedicineManagement />;
            default:
                return <OrderManagement />;
        }
    };

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'orders' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('orders')}
                    >
                        Manage Orders
                    </button>
                    <button
                        style={activeTab === 'inventory' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Manage Inventory
                    </button>
                    {/* --- NEW TAB BUTTON --- */}
                    <button
                        style={activeTab === 'medicines' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('medicines')}
                    >
                        Manage Medicines
                    </button>
                </div>

                <div style={styles.content}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

const styles = {
    // Styles are unchanged...
    container: { padding: '0 2rem' },
    title: { textAlign: 'center', marginBottom: '1rem' },
    tabs: { display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' },
    tabButton: { padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: 'var(--input-background)', border: '1px solid var(--card-border)', color: 'var(--text-color)', borderRadius: '8px' },
    activeTabButton: { padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: 'var(--primary-color)', border: '1px solid var(--primary-color)', color: 'white', borderRadius: '8px' },
    content: { backgroundColor: 'var(--card-background)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' },
};

export default AdminDashboard;