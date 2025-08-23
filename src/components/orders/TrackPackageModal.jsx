import React from 'react';
import modalStyles from '../Modal.module.css';
import styles from './TrackPackageModal.module.css';

// This is a mock data generator for demonstration
const getTrackingEvents = (status) => {
    const events = [{ time: "August 23, 2025, 3:00 PM", status: "Order Placed", location: "Bengaluru, KA" }];

    if (status === 'Accepted' || status === 'Picked Up' || status === 'Delivered') {
        events.push({ time: "August 23, 2025, 3:15 PM", status: "Order Accepted by Pharmacy", location: "Koramangala Store" });
    }
    if (status === 'Picked Up' || status === 'Delivered') {
        events.push({ time: "August 23, 2025, 3:40 PM", status: "Picked up by delivery agent", location: "Koramangala Store" });
    }
    if (status === 'Delivered') {
        events.push({ time: "August 23, 2025, 4:10 PM", status: "Delivered", location: "Customer Address" });
    }
    return events.reverse(); // Show most recent event first
};

function TrackPackageModal({ order, onClose }) {
    if (!order) return null;

    const trackingEvents = getTrackingEvents(order.status);

    return (
        <div className={modalStyles.modalOverlay} onClick={onClose}>
            <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={modalStyles.header}>
                    <h2>Track Package</h2>
                    <button onClick={onClose} className={modalStyles.closeButton}>&times;</button>
                </div>
                <div className={styles.body}>
                    <p><strong>Order ID:</strong> <small>{order._id}</small></p>
                    <div className={styles.timeline}>
                        {trackingEvents.map((event, index) => (
                            <div key={index} className={styles.timelineItem}>
                                <div className={styles.timelineDot}></div>
                                <div className={styles.timelineContent}>
                                    <p className={styles.eventStatus}>{event.status}</p>
                                    <p className={styles.eventLocation}>{event.location}</p>
                                    <small className={styles.eventTime}>{event.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackPackageModal;