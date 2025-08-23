import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './CartPanel.module.css';

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
                className={styles.overlay}
                style={{
                    opacity: isCartOpen ? 1 : 0,
                    pointerEvents: isCartOpen ? 'auto' : 'none',
                }}
                onClick={closeCart}
            ></div>

            <div className={styles.panel} style={{ right: isCartOpen ? '0' : '-420px' }}>
                <div className={styles.header}>
                    <h2 style={{ margin: 0 }}>Your Cart</h2>
                    <button onClick={closeCart} className={styles.closeButton} aria-label="Close cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.body}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <span style={{ fontSize: '3rem' }}>🛒</span>
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.medicine._id} className={styles.item}>
                                <img src={item.medicine.imageUrl} alt={item.medicine.name} className={styles.itemImage} />
                                <div className={styles.itemDetails}>
                                    <p className={styles.itemName}>{item.medicine.name}</p>
                                    <div className={styles.quantityControl}>
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)}
                                        >-</button>
                                        <span className={styles.quantityDisplay}>{item.quantity}</span>
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.medicine.stock}
                                        >+</button>
                                    </div>
                                </div>
                                <div className={styles.itemActions}>
                                    <p className={styles.itemPrice}>₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.medicine._id)} className={styles.removeButton} aria-label="Remove item">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalSection}>
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} className={styles.checkoutButton}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartPanel;