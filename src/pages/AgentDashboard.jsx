
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import styles from './AgentDashboard.module.css';

function AgentDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');


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
            fetchAssignedOrders();
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    const activeOrders = orders.filter(o => o.status === 'Accepted' || o.status === 'Picked Up');
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

    const renderOrderCard = (order) => (
        <div key={order._id} className={styles.orderCard}>
            <div className={styles.cardHeader}>
                <span>ORDER #{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                <span className={`${styles.status} ${styles[order.status.toLowerCase().replace(' ', '')]}`}>
                    {order.status}
                </span>
            </div>

            <div className={styles.addressGrid}>
                <div className={styles.addressBlock}>
                    <strong>PICKUP FROM</strong>
                    <p>{order.fulfillmentStore?.name || 'N/A'}</p>
                    <small>{order.fulfillmentStore?.address || 'Address not available'}</small>
                </div>
                <div className={styles.addressBlock}>
                    <strong>DELIVER TO</strong>
                    <p>{order.user?.name || 'Customer'}</p>
                    <small>{order.deliveryAddress}</small>
                </div>
            </div>

            {order.status === 'Accepted' && (
                <button onClick={() => handleStatusUpdate(order._id, 'Picked Up')} className={styles.actionButton}>
                    Mark as Picked Up
                </button>
            )}
            {order.status === 'Picked Up' && (
                <button onClick={() => handleStatusUpdate(order._id, 'Delivered')} className={styles.actionButton}>
                    Mark as Delivered
                </button>
            )}
        </div>
    );

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>My Deliveries</h1>

                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'active' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('active')}>
                        Active ({activeOrders.length})
                    </button>
                    <button
                        className={activeTab === 'completed' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('completed')}>
                        Completed ({completedOrders.length})
                    </button>
                </div>

                {loading ? (
                    <p className={styles.prompt}>Loading deliveries...</p>
                ) : error ? (
                    <p className={styles.errorMessage}>{error}</p>
                ) : (
                    <div>
                        {activeTab === 'active' ?
                            (activeOrders.length > 0 ? activeOrders.map(renderOrderCard) : <p className={styles.prompt}>No active deliveries.</p>)
                            :
                            (completedOrders.length > 0 ? completedOrders.map(renderOrderCard) : <p className={styles.prompt}>No completed deliveries.</p>)
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentDashboard;