// src/pages/AgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function AgentDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'

    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/agents/orders', config);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch assigned orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.patch(`/api/agents/orders/${orderId}/status`, { status: newStatus }, config);
            fetchAssignedOrders(); // Refresh the list to reflect the change
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    // Filter orders into two groups for the different tabs
    const activeOrders = orders.filter(o => o.status === 'Accepted' || o.status === 'Picked Up');
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

    const renderOrderCard = (order) => (
        <div key={order._id} style={styles.orderCard}>
            <div style={styles.cardHeader}>
                <span>Order ID: <small>{order._id}</small></span>
                <span style={{...styles.status, ...styles[order.status.toLowerCase().replace(' ', '')]}}>
                    {order.status}
                </span>
            </div>

            {/* Pickup and Delivery address are now clearly separated */}
            <div style={styles.addressBlock}>
                <strong>PICKUP FROM:</strong>
                <p>{order.fulfillmentStore?.name || 'N/A'}</p>
                <small>{order.fulfillmentStore?.address || 'Address not available'}</small>
            </div>

            <div style={styles.addressBlock}>
                <strong>DELIVER TO:</strong>
                <p>{order.user?.name || 'Customer'}</p>
                <small>{order.deliveryAddress}</small>
            </div>

            {/* Context-aware action button: only shows the next logical step */}
            <div style={styles.actionButtons}>
                {order.status === 'Accepted' && (
                    <button onClick={() => handleStatusUpdate(order._id, 'Picked Up')} style={styles.actionButton}>
                        Mark as Picked Up
                    </button>
                )}
                {order.status === 'Picked Up' && (
                    <button onClick={() => handleStatusUpdate(order._id, 'Delivered')} style={styles.actionButton}>
                        Mark as Delivered
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>My Deliveries</h1>

                {/* Tab switcher UI */}
                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'active' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('active')}>
                        Active ({activeOrders.length})
                    </button>
                    <button
                        style={activeTab === 'completed' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('completed')}>
                        Completed ({completedOrders.length})
                    </button>
                </div>

                {loading ? (
                    <p>Loading deliveries...</p>
                ) : error ? (
                    <p style={styles.errorMessage}>{error}</p>
                ) : (
                    <div>
                        {activeTab === 'active' ? (
                            activeOrders.length > 0 ? activeOrders.map(renderOrderCard) : <p>No active deliveries.</p>
                        ) : (
                            completedOrders.length > 0 ? completedOrders.map(renderOrderCard) : <p>No completed deliveries.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '0 2rem' },
    title: { textAlign: 'center', marginBottom: '1rem' },
    tabs: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' },
    tabButton: { padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: 'var(--input-background)', border: '1px solid var(--card-border)', color: 'var(--text-color)', borderRadius: '8px' },
    activeTabButton: { padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: 'var(--primary-color)', border: '1px solid var(--primary-color)', color: 'white', borderRadius: '8px' },
    orderCard: { backgroundColor: 'var(--card-background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '1rem' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold' },
    addressBlock: { marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '3px solid var(--primary-color)' },
    status: { padding: '0.25rem 0.75rem', borderRadius: '12px', color: 'white', fontSize: '0.9rem' },
    accepted: { backgroundColor: '#5bc0de' },
    pickedup: { backgroundColor: '#337ab7' },
    delivered: { backgroundColor: '#5cb85c' },
    cancelled: { backgroundColor: '#d9534f' },
    actionButtons: { marginTop: '1.5rem', display: 'flex' },
    actionButton: { width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold' },
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default AgentDashboard;