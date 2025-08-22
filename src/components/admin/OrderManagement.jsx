// src/components/admin/OrderManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // Fetch all orders
            const { data: ordersData } = await axios.get('/api/admin/orders', config);
            setOrders(ordersData);

            // This is a placeholder for fetching agents. In a real app, you'd have an endpoint for this.
            // For now, we'll simulate it.
            // const { data: agentsData } = await axios.get('/api/admin/agents', config);
            // setAgents(agentsData);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignAgent = async (orderId, agentId) => {
        // In a real app, agentId would come from a dropdown.
        // For now, prompt for it.
        const promptedAgentId = prompt("Enter Agent ID to assign:");
        if (!promptedAgentId) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`/api/admin/orders/${orderId}/assign`, { agentId: promptedAgentId }, config);
            fetchData(); // Refresh data
        } catch (err) {
            alert('Failed to assign agent: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: '#ff6b6b' }}>{error}</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>All Customer Orders</h2>
            {orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Customer:</strong> {order.user.name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Assigned Agent:</strong> {order.agent || 'Not Assigned'}</p>
                    {order.status === 'Pending' && (
                        <button onClick={() => handleAssignAgent(order._id)}>Assign Agent</button>
                    )}
                </div>
            ))}
        </div>
    );
}

const styles = {
    orderCard: {
        padding: '1rem',
        border: '1px solid var(--card-border)',
        borderRadius: '8px',
        marginBottom: '1rem',
    }
}

export default OrderManagement;
