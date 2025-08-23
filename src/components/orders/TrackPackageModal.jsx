import React from 'react';

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
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2>Track Package</h2>
                    <button onClick={onClose} style={styles.closeButton}>&times;</button>
                </div>
                <div style={styles.body}>
                    <p><strong>Order ID:</strong> <small>{order._id}</small></p>
                    <div style={styles.timeline}>
                        {trackingEvents.map((event, index) => (
                            <div key={index} style={styles.timelineItem}>
                                <div style={styles.timelineDot}></div>
                                <div style={styles.timelineContent}>
                                    <p style={styles.eventStatus}>{event.status}</p>
                                    <p style={styles.eventLocation}>{event.location}</p>
                                    <small style={styles.eventTime}>{event.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 },
    modalContent: { backgroundColor: 'var(--card-background)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' },
    closeButton: { background: 'none', border: 'none', color: 'var(--text-color)', fontSize: '2rem', cursor: 'pointer' },
    body: { paddingTop: '1rem' },
    timeline: { borderLeft: '2px solid var(--primary-color)', padding: '1rem 0 1rem 1.5rem', position: 'relative' },
    timelineItem: { position: 'relative', marginBottom: '1.5rem' },
    timelineDot: { position: 'absolute', left: '-22px', top: '5px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', border: '3px solid var(--card-background)' },
    timelineContent: {},
    eventStatus: { margin: 0, fontWeight: 'bold' },
    eventLocation: { margin: '0.25rem 0' },
    eventTime: { color: '#aaa' }
};

export default TrackPackageModal;