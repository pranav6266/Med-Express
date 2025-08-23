// src/pages/Checkout.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';

function Checkout() {
    const { cartItems, fetchCart } = useCart(); // Assuming fetchCart can refresh/clear the cart
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((acc, item) => {
        return acc + item.medicine.price * item.quantity;
    }, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!deliveryAddress) {
            setError('Please enter a delivery address.');
            return;
        }
        setLoading(true);
        setError('');

        const orderItems = cartItems.map(item => ({
            medicine: item.medicine._id,
            name: item.medicine.name,
            quantity: item.quantity,
            price: item.medicine.price,
        }));

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/users/orders', {
                orderItems,
                deliveryAddress,
                totalAmount
            }, config);

            // Refresh cart (which should now be empty)
            await fetchCart();
            navigate('/orders'); // Redirect to order history

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to place order.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                <div className="form-card" style={{ maxWidth: '700px' }}>
                    <h2>Checkout</h2>
                    <div style={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item.medicine._id} style={styles.item}>
                                <span style={styles.itemName}>{item.medicine.name} (x{item.quantity})</span>
                                <span style={styles.itemTotal}>${(item.medicine.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{ ...styles.item, ...styles.totalLine }}>
                            <span style={{ fontWeight: 'bold' }}>Total</span>
                            <span style={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <form onSubmit={handlePlaceOrder} style={{ width: '100%' }}>
                        <div className="form-step">
                            <label htmlFor="address">Delivery Address</label>
                            <textarea
                                id="address"
                                rows="3"
                                style={styles.textarea}
                                placeholder="Enter your full delivery address"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-step">
                            <label>Payment Method</label>
                            <p style={styles.codText}>Cash on Delivery (COD)</p>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" disabled={loading || cartItems.length === 0} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    orderSummary: {
        width: '100%',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--input-background)',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--card-border)',
    },
    totalLine: {
        borderBottom: 'none',
        marginTop: '0.5rem',
    },
    itemName: {
        color: '#ccc',
    },
    itemTotal: {
        fontWeight: '500',
    },
    textarea: {
        padding: '0.85rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontFamily: 'inherit',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        resize: 'vertical',
    },
    codText: {
        margin: 0,
        padding: '0.85rem',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
    }
};

export default Checkout;