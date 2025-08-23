// src/components/CartPanel.jsx

import React from 'react';
import { useCart } from '../context/CartContext.jsx';

function CartPanel() {
    const { cartItems, isCartOpen, removeFromCart, closeCart } = useCart();

    const totalAmount = cartItems.reduce((acc, item) => {
        if (item.medicine) {
            return acc + item.medicine.price * item.quantity;
        }
        return acc;
    }, 0);

    return (
        <>
            {/* Overlay */}
            <div style={isCartOpen ? styles.overlay : {}} onClick={closeCart}></div>

            {/* Panel */}
            <div style={{ ...styles.panel, right: isCartOpen ? '0' : '-400px' }}>
                <div style={styles.header}>
                    <h2>Your Cart</h2>
                    <button onClick={closeCart} style={styles.closeButton}>&times;</button>
                </div>
                <div style={styles.body}>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.medicine._id} style={styles.item}>
                                <img src={item.medicine.imageUrl} alt={item.medicine.name} style={styles.itemImage}/>
                                <div style={styles.itemDetails}>
                                    <p style={styles.itemName}>{item.medicine.name}</p>
                                    <p>{item.quantity} x ${item.medicine.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.medicine._id)} style={styles.removeButton}>Remove</button>
                            </div>
                        ))
                    )}
                </div>
                <div style={styles.footer}>
                    <h3>Total: ${totalAmount.toFixed(2)}</h3>
                    <button style={styles.checkoutButton} disabled={cartItems.length === 0}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    );
}

// Styling
const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 },
    panel: { position: 'fixed', top: 0, height: '100%', width: '380px', backgroundColor: 'var(--card-background)', zIndex: 1050, transition: 'right 0.3s ease-in-out', display: 'flex', flexDirection: 'column' },
    header: { padding: '1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeButton: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-color)' },
    body: { flex: 1, padding: '1rem', overflowY: 'auto' },
    item: { display: 'flex', marginBottom: '1rem', alignItems: 'center' },
    itemImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' },
    itemDetails: { flex: 1 },
    itemName: { fontWeight: 'bold', margin: '0 0 0.25rem 0' },
    removeButton: { backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' },
    footer: { padding: '1rem', borderTop: '1px solid var(--card-border)' },
    checkoutButton: { width: '100%', padding: '0.75rem', fontSize: '1rem' }
};

export default CartPanel;