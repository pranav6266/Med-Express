import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import OrderDetailsModal from '../components/orders/OrderDetailsModal.jsx';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All'); // <-- NEW: State for the filter

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
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

    // --- NEW: Filter the orders based on the selected status ---
    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'All') {
            return true; // Show all orders
        }
        return order.status === statusFilter; // Show orders matching the selected status
    });

    return (
        <div>
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            <Header />
            <div style={styles.container}>
                {/* --- NEW: Header containing the title and filter dropdown --- */}
                <div style={styles.pageHeader}>
                    <h1 style={styles.title}>My Orders</h1>
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        style={styles.filterDropdown}
                    >
                        <option value="All">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p style={styles.errorMessage}>{error}</p>
                ) : (
                    <div style={styles.orderList}>
                        {/* --- UPDATED: Map over the new 'filteredOrders' array --- */}
                        {filteredOrders.length === 0 ?
                            <p>You have no orders with this status.</p> :
                            filteredOrders.map((order) => (
                                <div key={order._id} style={styles.orderCard}>
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <span style={styles.orderIdLabel}>ORDER ID</span>
                                            <span style={styles.orderId}>{order._id}</span>
                                        </div>
                                        <span style={{...styles.status, ...styles[order.status.toLowerCase().replace(' ', '')]}}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div style={styles.cardFooter}>
                                        <button onClick={() => setSelectedOrder(order)} style={styles.detailsButton}>
                                            View Details
                                        </button>
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
    // --- NEW STYLES for the header and dropdown ---
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
    },
    title: { margin: 0 },
    filterDropdown: {
        padding: '0.5rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontSize: '1rem'
    },
    orderList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: 'auto' },
    orderCard: {
        backgroundColor: 'var(--card-background)',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
        overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--input-background)',
    },
    orderIdLabel: { fontSize: '0.8rem', color: '#aaa', display: 'block' },
    orderId: { fontWeight: 'bold' },
    cardBody: {
        padding: '1.5rem',
    },
    cardFooter: {
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--card-border)',
        textAlign: 'right'
    },
    detailsButton: {
        padding: '0.5rem 1.5rem',
        cursor: 'pointer'
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
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default OrderHistory;