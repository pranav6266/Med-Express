// src/pages/Checkout.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';
import formStyles from './AuthForm.module.css'; // For container and card
import styles from './Checkout.module.css'; // For component-specific styles

function Checkout() {
    const { cartItems, fetchCart, selectedStore } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', phone: '', address: { flatNo: '', road: '', locality: '', pincode: '', landmark: '', city: 'Bangalore', state: 'Karnataka' }});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfileInfo = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data: profile } = await axios.get('/api/users/profile', config);

                const profileAddress = profile.address || {};
                setFormData(prev => ({
                    ...prev,
                    name: profile.name || '',
                    phone: profile.phone || '',
                    address: {
                        ...prev.address,
                        flatNo: profileAddress.flatNo || '',
                        road: profileAddress.road || '',
                        locality: profileAddress.locality || '',
                        pincode: profileAddress.pincode || '',
                    }
                }));
            } catch (err) {
                console.error("Failed to fetch profile for pre-fill");
            }
        };
        loadProfileInfo();
    }, []);

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

        try {
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

            await fetchCart(); // Clear the cart
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
            <div className={formStyles.formContainer}>
                <div className={formStyles.formCard} style={{ maxWidth: '700px' }}>
                    <h2>Checkout</h2>

                    <div className={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item.medicine._id} className={styles.item}>
                                <span className={styles.itemName}>{item.medicine.name} (x{item.quantity})</span>
                                <span className={styles.itemTotal}>
                                    ₹{(item.medicine.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className={`${styles.item} ${styles.totalLine}`}>
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder} style={{ width: '100%' }}>
                        <div className={styles.sectionContainer}>
                            <h3 className={styles.sectionHeader}>Contact Information</h3>
                            <div className={styles.formGroup}>
                                <label>Full Name*</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone Number*</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} required />
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <h3 className={styles.sectionHeader}>Delivery Address</h3>
                            <div className={styles.addressGrid}>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>State</label><input type="text" name="state" value={formData.address.state} className={styles.input} readOnly /></div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>City</label><input type="text" name="city" value={formData.address.city} className={styles.input} readOnly /></div>
                                <div className={styles.formGroup}><label>Locality*</label><input type="text" name="locality" value={formData.address.locality} onChange={handleChange} className={styles.input} required /></div>
                                <div className={styles.formGroup}><label>Road*</label><input type="text" name="road" value={formData.address.road} onChange={handleChange} className={styles.input} required /></div>
                                <div className={styles.formGroup}><label>Flat/House No.</label><input type="text" name="flatNo" value={formData.address.flatNo} onChange={handleChange} className={styles.input} /></div>
                                <div className={styles.formGroup}><label>Pincode*</label><input type="text" name="pincode" value={formData.address.pincode} onChange={handleChange} className={styles.input} required /></div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Landmark</label><input type="text" name="landmark" value={formData.address.landmark} onChange={handleChange} className={styles.input} /></div>
                            </div>
                        </div>

                        <div className={formStyles.formStep}><label>Payment Method</label><p className={styles.codText}>Cash on Delivery (COD)</p></div>
                        {error && <p className={formStyles.errorMessage}>{error}</p>}
                        <button type="submit" disabled={loading || cartItems.length === 0} className={styles.placeOrderButton}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Checkout;