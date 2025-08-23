// src/components/CartPanel.jsx

import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

function CartPanel() {
    const { cartItems, isCartOpen, removeFromCart, updateQuantity, closeCart } = useCart();
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((acc, item) => {
        if (item.medicine) {
            return acc + item.medicine.price * item.quantity;
        }
        return acc;
    }, 0);

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            closeCart();
            navigate('/checkout');
        }
    };

    return (
        <>
            <div
                style={{
                    ...styles.overlay,
                    opacity: isCartOpen ? 1 : 0,
                    pointerEvents: isCartOpen ? 'auto' : 'none',
                }}
                onClick={closeCart}
            ></div>

            <div style={{ ...styles.panel, right: isCartOpen ? '0' : '-420px' }}>
                <div style={styles.header}>
                    <h2 style={{ margin: 0 }}>Your Cart</h2>
                    <button onClick={closeCart} style={styles.closeButton} aria-label="Close cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div style={styles.body}>
                    {cartItems.length === 0 ? (
                        <div style={styles.emptyCart}>
                            <span style={{ fontSize: '3rem' }}>🛒</span>
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.medicine._id} style={styles.item}>
                                <img src={item.medicine.imageUrl} alt={item.medicine.name} style={styles.itemImage} />
                                <div style={styles.itemDetails}>
                                    <p style={styles.itemName}>{item.medicine.name}</p>
                                    <div style={styles.quantityControl}>
                                        <button
                                            style={styles.quantityButton}
                                            onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)}
                                        >-</button>
                                        <span style={styles.quantityDisplay}>{item.quantity}</span>
                                        <button
                                            style={styles.quantityButton}
                                            onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.medicine.stock}
                                        >+</button>
                                    </div>
                                </div>
                                <div style={styles.itemActions}>
                                    <p style={styles.itemPrice}>${(item.medicine.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.medicine._id)} style={styles.removeButton} aria-label="Remove item">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={styles.footer}>
                        <div style={styles.totalSection}>
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} style={styles.checkoutButton}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// --- UPDATED STYLES ---
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040,
        transition: 'opacity 0.3s ease-in-out',
    },
    panel: {
        position: 'fixed', top: 0, height: '100%', width: '400px',
        backgroundColor: 'var(--background-start)', zIndex: 1050,
        transition: 'right 0.3s ease-in-out', display: 'flex', flexDirection: 'column',
        boxShadow: '-5px 0px 15px rgba(0,0,0,0.2)',
    },
    header: {
        padding: '1rem 1.5rem', borderBottom: '1px solid var(--card-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
    },
    closeButton: {
        background: 'var(--input-background)', border: '1px solid var(--card-border)',
        cursor: 'pointer', color: 'var(--text-color)', width: '40px', height: '40px',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'rotate(180deg)',
    },
    body: { flex: 1, padding: '1.5rem', overflowY: 'auto' },
    emptyCart: { textAlign: 'center', marginTop: '40%', color: 'var(--text-color)' },
    item: {
        display: 'flex', marginBottom: '1.5rem', alignItems: 'center',
        backgroundColor: 'var(--card-background)', padding: '1rem', borderRadius: '12px',
    },
    itemImage: {
        width: '60px', height: '60px', objectFit: 'cover',
        borderRadius: '8px', marginRight: '1rem', border: '1px solid var(--card-border)',
    },
    itemDetails: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    itemName: { fontWeight: 'bold', margin: 0, fontSize: '0.9rem' },
    quantityControl: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    quantityButton: {
        background: 'var(--input-background)', border: '1px solid var(--card-border)',
        color: 'var(--text-color)', borderRadius: '50%', width: '28px', height: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '1rem', padding: 0,
    },
    quantityDisplay: { fontWeight: 'bold', fontSize: '1.1rem' },
    itemActions: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' },
    itemPrice: { margin: 0, fontWeight: 'bold', fontSize: '1rem' },
    removeButton: {
        backgroundColor: 'transparent', color: 'var(--text-color)', border: 'none',
        fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem',
    },
    footer: {
        padding: '1.5rem', borderTop: '1px solid var(--card-border)',
        backgroundColor: 'var(--card-background)', flexShrink: 0,
    },
    totalSection: {
        display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem',
        fontWeight: 'bold', marginBottom: '1rem',
    },
    checkoutButton: {
        width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold',
    }
};

export default CartPanel;