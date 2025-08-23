// src/components/admin/MedicineModal.jsx

import React, { useState, useEffect } from 'react';

function MedicineModal({ medicine, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (medicine) {
            setFormData({
                name: medicine.name || '',
                description: medicine.description || '',
                price: medicine.price || '',
            });
        }
    }, [medicine]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, imageFile);
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* --- NEW: Added labels and structure for clarity --- */}
                    <div style={styles.formGroup}>
                        <label htmlFor="med-name" style={styles.label}>Name</label>
                        <input id="med-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Paracetamol 500mg" style={styles.input} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="med-description" style={styles.label}>Description</label>
                        <textarea id="med-description" name="description" value={formData.description} onChange={handleChange} placeholder="e.g., For fever and pain relief" style={{...styles.input, ...styles.textarea}} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="med-price" style={styles.label}>Price (₹)</label>
                        <input id="med-price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="e.g., 1.50" style={styles.input} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="med-image" style={styles.label}>Image</label>
                        <input id="med-image" name="image" type="file" onChange={handleFileChange} style={styles.input} />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'var(--card-background)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' },
    // --- NEW STYLES ---
    formGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' },
    // --- UPDATED STYLE ---
    input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-background)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' },
    textarea: { minHeight: '100px', resize: 'vertical' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
    cancelButton: { backgroundColor: '#6c757d' }
};

export default MedicineModal;