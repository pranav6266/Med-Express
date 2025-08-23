// src/components/admin/OrderManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAgents, setSelectedAgents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Define the columns for our Kanban board
    const orderColumns = ['Pending', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled'];

    const fetchData = async () => {
        try {
            setLoading(true); // Set loading true at the start of fetch
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const { data: ordersData } = await axios.get('/api/admin/orders', config);
            const { data: agentsData } = await axios.get('/api/admin/agents', config);

            setOrders(ordersData);
            setAgents(agentsData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAgentSelect = (orderId, agentId) => {
        setSelectedAgents(prev => ({
            ...prev,
            [orderId]: agentId,
        }));
    };

    const handleAssignAgent = async (orderId) => {
        const agentId = selectedAgents[orderId];
        if (!agentId) {
            alert("Please select an agent from the dropdown first.");
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`/api/admin/orders/${orderId}/assign`, { agentId }, config);
            fetchData(); // Refresh all data to move the card to the next column
        } catch (err) {
            alert('Failed to assign agent: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: '#ff6b6b' }}>{error}</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Order Fulfillment Board</h2>
            <div style={styles.boardContainer}>
                {/* Map over the columns to create each status lane */}
                {orderColumns.map(status => (
                    <div key={status} style={styles.column}>
                        <h3 style={styles.columnTitle}>{status} ({orders.filter(o => o.status === status).length})</h3>
                        <div style={styles.cardContainer}>
                            {/* Filter and map orders that belong to the current column */}
                            {orders
                                .filter(order => order.status === status)
                                .map(order => (
                                    <div key={order._id} style={styles.orderCard}>
                                        <p><strong>Order ID:</strong> <small>{order._id}</small></p>
                                        <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                                        <p><strong>Store:</strong> {order.fulfillmentStore?.name || 'N/A'}</p>

                                        {/* Show assigned agent only if the order is not pending */}
                                        {order.status !== 'Pending' && (
                                            <p><strong>Agent:</strong> {order.agent?.name || 'N/A'}</p>
                                        )}

                                        {/* The assignment UI only shows in the 'Pending' column */}
                                        {order.status === 'Pending' && (
                                            <div style={styles.assignContainer}>
                                                <select
                                                    style={styles.select}
                                                    value={selectedAgents[order._id] || ''}
                                                    onChange={(e) => handleAgentSelect(order._id, e.target.value)}
                                                >
                                                    <option value="" disabled>-- Select Agent --</option>
                                                    {agents.map(agent => (
                                                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleAssignAgent(order._id)} style={styles.assignButton}>Assign</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    boardContainer: {
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto', // Allows horizontal scrolling if columns overflow
        paddingBottom: '1rem'
    },
    column: {
        flex: '1',
        minWidth: '300px',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column'
    },
    columnTitle: {
        textAlign: 'center',
        padding: '0.75rem',
        borderBottom: '2px solid var(--card-border)'
    },
    cardContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        padding: '0.5rem',
        maxHeight: '70vh'
    },
    orderCard: {
        backgroundColor: 'var(--input-background)',
        padding: '1rem',
        border: '1px solid var(--card-border)',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    },
    assignContainer: {
        marginTop: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    select: {
        width: '100%',
        padding: '0.5rem',
        borderRadius: '4px',
    },
    assignButton: {
        width: '100%',
        padding: '0.5rem'
    }
};

export default OrderManagement;