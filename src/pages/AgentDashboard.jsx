// src/pages/AgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function AgentDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssignedOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
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
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.patch(`/api/agents/orders/${orderId}/status`, { status: newStatus }, config);
            // Refresh the orders list to show the updated status
            fetchAssignedOrders();
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>My Assigned Deliveries</h1>
                {loading ? (
                    <p>Loading deliveries...</p>
                ) : error ? (
                    <p style={styles.errorMessage}>{error}</p>
                ) : (
                    <div style={styles.orderList}>
                        {orders.length === 0 ? <p>You have no assigned orders.</p> :
                            orders.map((order) => (
                                <div key={order._id} style={styles.orderCard}>
                                    <div style={styles.cardHeader}>
                                        <span>Order ID: {order._id}</span>
                                        <span style={{...styles.status, ...styles[order.status.toLowerCase().replace(' ', '')]}}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p><strong>Customer Address:</strong> {order.deliveryAddress}</p>
                                    <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                                    <div style={styles.actionButtons}>
                                        <button onClick={() => handleStatusUpdate(order._id, 'Picked Up')} style={styles.button}>Picked Up</button>
                                        <button onClick={() => handleStatusUpdate(order._id, 'Delivered')} style={styles.button}>Delivered</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '0 2rem' },
    title: { textAlign: 'center', marginBottom: '2rem' },
    orderList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    orderCard: {
        backgroundColor: 'var(--card-background)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    status: {
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        color: 'white',
        fontSize: '0.9rem'
    },
    pending: { backgroundColor: '#f0ad4e' },
    accepted: { backgroundColor: '#5bc0de' },
    pickedup: { backgroundColor: '#337ab7' },
    delivered: { backgroundColor: '#5cb85c' },
    cancelled: { backgroundColor: '#d9534f' },
    actionButtons: {
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
    },
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default AgentDashboard;
