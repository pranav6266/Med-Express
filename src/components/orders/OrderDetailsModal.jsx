import React, { useState } from 'react';
import TrackPackageModal from './TrackPackageModal';
import modalStyles from '../Modal.module.css';
import styles from './OrderDetailsModal.module.css';

function OrderDetailsModal({ order, onClose }) {
    const [showTracker, setShowTracker] = useState(false);

    if (!order) return null;

    const inProgress = order.status === 'Accepted' || order.status === 'Picked Up';

    return (
        <div className={modalStyles.modalOverlay} onClick={onClose}>
            <div className={`${modalStyles.modalContent} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                <div className={modalStyles.header}>
                    <h2>Order Details</h2>
                    <button onClick={onClose} className={modalStyles.closeButton}>&times;</button>
                </div>
                <div className={styles.body}>
                    {/* This button will now only appear for 'Accepted' or 'Picked Up' orders */}
                    {inProgress && (
                        <button
                            onClick={() => setShowTracker(true)}
                            className={styles.trackButton}
                        >
                            Track Package
                        </button>
                    )}
                    <p><strong>Order ID:</strong> <small>{order._id}</small></p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong>
                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase().replace(' ', '')]}`}>
                            {order.status}
                        </span>
                    </p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

                    <h4 className={styles.itemsHeader}>Items Purchased</h4>
                    <table className={styles.itemsTable}>
                        <thead>
                        <tr>
                            <th className={styles.th}>Item</th>
                            <th className={styles.th}>Quantity</th>
                            <th className={styles.th}>Price</th>
                            <th className={styles.th}>Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td className={styles.td}>{item.name}</td>
                                <td className={styles.td}>{item.quantity}</td>
                                <td className={styles.td}>₹{item.price.toFixed(2)}</td>
                                <td className={styles.td}>₹{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p className={styles.total}><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                </div>
            </div>

            {/* This renders the tracking modal when the button is clicked */}
            {showTracker && <TrackPackageModal order={order} onClose={() => setShowTracker(false)} />}
        </div>
    );
}

export default OrderDetailsModal;