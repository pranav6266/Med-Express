
import React, {useState} from 'react';
import TrackPackageModal from './TrackPackageModal';

function OrderDetailsModal({ order, onClose }) {
    const [showTracker, setShowTracker] = useState(false);
    if (!order) return null;


    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2>Order Details</h2>
                    <button onClick={onClose} style={styles.closeButton}>&times;</button>
                </div>
                <div style={styles.body}>
                    {/* --- NEW: Track Package Button --- */}
                    {inProgress && (
                        <button onClick={() => setShowTracker(true)} style={styles.trackButton}>
                            Track Package
                        </button>
                    )}
                    <p><strong>Order ID:</strong> <small>{order._id}</small></p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

                    <h4 style={styles.itemsHeader}>Items Purchased</h4>
                    <table style={styles.itemsTable}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Item</th>
                            <th style={styles.th}>Quantity</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.td}>{item.name}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={styles.td}>${item.price.toFixed(2)}</td>
                                <td style={styles.td}>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p style={styles.total}><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'var(--card-background)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' },
    closeButton: { background: 'none', border: 'none', color: 'var(--text-color)', fontSize: '2rem', cursor: 'pointer' },
    body: { paddingTop: '1rem' },
    itemsHeader: { marginTop: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' },
    itemsTable: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    th: { textAlign: 'left', padding: '0.5rem', backgroundColor: 'var(--input-background)' },
    td: { padding: '0.5rem', borderBottom: '1px solid var(--card-border)' },
    total: { textAlign: 'right', marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }
};

export default OrderDetailsModal;