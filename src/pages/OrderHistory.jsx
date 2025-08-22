// src/pages/OrderHistory.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/users/orders/my', config);
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>My Orders</h1>
                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p style={styles.errorMessage}>{error}</p>
                ) : (
                    <div style={styles.orderList}>
                        {orders.length === 0 ? <p>You have no orders.</p> :
                            orders.map((order) => (
                                <div key={order._id} style={styles.orderCard}>
                                    <div style={styles.cardHeader}>
                                        <span>Order ID: {order._id}</span>
                                        <span style={{...styles.status, ...styles[order.status.toLowerCase()]}}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                                    <p><strong>Address:</strong> {order.deliveryAddress}</p>
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
    delivered: { backgroundColor: '#5cb85c' },
    cancelled: { backgroundColor: '#d9534f' },
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default OrderHistory;
