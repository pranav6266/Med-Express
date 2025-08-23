import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import OrderDetailsModal from '../components/orders/OrderDetailsModal.jsx';
import styles from './OrderHistory.module.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

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

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'All') {
            return true;
        }
        return order.status === statusFilter;
    });

    return (
        <div>
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            <Header />
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>My Orders</h1>
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        className={styles.filterDropdown}
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
                    <p className={styles.errorMessage}>{error}</p>
                ) : (
                    <div className={styles.orderList}>
                        {filteredOrders.length === 0 ?
                            <p>You have no orders with this status.</p> :
                            filteredOrders.map((order) => (
                                <div key={order._id} className={styles.orderCard}>
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <span className={styles.orderIdLabel}>ORDER ID</span>
                                            <span className={styles.orderId}>{order._id}</span>
                                        </div>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase().replace(' ', '')]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <button onClick={() => setSelectedOrder(order)} className={styles.detailsButton}>
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

export default OrderHistory;