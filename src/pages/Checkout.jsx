// src/pages/Checkout.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';

function Checkout() {
    const { cartItems, fetchCart, selectedStore } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: {
            flatNo: '',
            road: '',
            locality: '',
            pincode: '',
            landmark: '',
            city: 'Bangalore',
            state: 'Karnataka',
        }
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setFormData(prevData => ({
                ...prevData,
                name: userInfo.name || '',
            }));
        }

        if (!selectedStore) {
            navigate('/dashboard');
        }
    }, [selectedStore, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (Object.keys(formData.address).includes(name)) {
            setFormData(prevData => ({
                ...prevData,
                address: { ...prevData.address, [name]: value }
            }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const totalAmount = cartItems.reduce((acc, item) => {
        return acc + item.medicine.price * item.quantity;
    }, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const { name, phone, address } = formData;

        if (!name || !phone || !address.locality || !address.road || !address.pincode) {
            setError('Please fill all required fields.');
            return;
        }
        setLoading(true);
        setError('');

        const saveProfileInfo = async () => {
            console.log("Simulating: Saving updated profile info for future use...", { name, phone, address });
        };

        try {
            await saveProfileInfo();

            const optionalFlat = address.flatNo ? `${address.flatNo}, ` : '';
            const optionalLandmark = address.landmark ? ` (Landmark: ${address.landmark})` : '';
            const formattedAddress = `${optionalFlat}${address.road}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}${optionalLandmark}`;

            const orderItems = cartItems.map(item => ({
                medicine: item.medicine._id, name: item.medicine.name, quantity: item.quantity, price: item.medicine.price,
            }));

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('/api/users/orders', {
                orderItems, deliveryAddress: formattedAddress, totalAmount, fulfillmentStore: selectedStore,
            }, config);

            await fetchCart();
            navigate('/orders');

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

                    {/* --- RESTORED: Order Summary Section --- */}
                    <div style={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item.medicine._id} style={styles.item}>
                                <span style={styles.itemName}>{item.medicine.name} (x{item.quantity})</span>
                                <span style={styles.itemTotal}>
                                    {`$${(item.medicine.price * item.quantity).toFixed(2)}`}
                                </span>
                            </div>
                        ))}
                        <div style={{ ...styles.item, ...styles.totalLine }}>
                            <span style={{ fontWeight: 'bold' }}>Total</span>
                            <span style={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder} style={{ width: '100%' }}>
                        <div style={styles.sectionContainer}>
                            <h3 style={styles.sectionHeader}>Contact Information</h3>
                            <div style={styles.formGroup}>
                                <label>Full Name*</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label>Phone Number*</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
                            </div>
                        </div>

                        <div style={styles.sectionContainer}>
                            <h3 style={styles.sectionHeader}>Delivery Address</h3>
                            <div style={styles.addressGrid}>
                                <div style={{...styles.formGroup, ...styles.fullWidth}}><label>State</label><input type="text" name="state" value={formData.address.state} style={styles.input} readOnly /></div>
                                <div style={{...styles.formGroup, ...styles.fullWidth}}><label>City</label><input type="text" name="city" value={formData.address.city} style={styles.input} readOnly /></div>
                                <div style={styles.formGroup}><label>Locality*</label><input type="text" name="locality" value={formData.address.locality} onChange={handleChange} style={styles.input} required /></div>
                                <div style={styles.formGroup}><label>Road*</label><input type="text" name="road" value={formData.address.road} onChange={handleChange} style={styles.input} required /></div>
                                <div style={styles.formGroup}><label>Flat/House No. (Optional)</label><input type="text" name="flatNo" value={formData.address.flatNo} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label>Pincode*</label><input type="text" name="pincode" value={formData.address.pincode} onChange={handleChange} style={styles.input} required /></div>
                                <div style={{...styles.formGroup, ...styles.fullWidth}}><label>Landmark (Optional)</label><input type="text" name="landmark" value={formData.address.landmark} onChange={handleChange} style={styles.input} /></div>
                            </div>
                        </div>

                        <div className="form-step"><label>Payment Method</label><p style={styles.codText}>Cash on Delivery (COD)</p></div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" disabled={loading || cartItems.length === 0} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Placing Order...' : 'Place Order & Save Info'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    // Styles for Order Summary
    orderSummary: { width: '100%', marginBottom: '2rem', marginRight:"5rem", padding: '1rem', backgroundColor: 'var(--input-background)', borderRadius: '8px', border: '1px solid var(--input-border)' },
    item: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' },
    totalLine: { borderBottom: 'none', marginTop: '0.5rem' },
    itemName: { color: '#ccc' },
    itemTotal: { fontWeight: '500' },

    // Styles for Forms and Layout
    sectionContainer: { marginBottom: '2rem', textAlign: 'left' },
    sectionHeader: { marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' },
    addressGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', marginBottom: '0.5rem' },
    fullWidth: { gridColumn: '1 / -1' },
    input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-background)', color: 'var(--text-color)', fontSize: '1rem', marginTop: '0.25rem' },
    codText: { margin: 0, padding: '0.85rem', backgroundColor: 'var(--card-background)', borderRadius: '8px' },
};

export default Checkout;