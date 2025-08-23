// src/components/admin/MedicineModal.jsx

import React, { useState, useEffect } from 'react';

function MedicineModal({ medicine, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (medicine) {
            setFormData({
                name: medicine.name || '',
                description: medicine.description || '',
                price: medicine.price || '',
                stock: medicine.stock || '',
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
        // Pass both form data and the image file to the parent
        onSave(formData, imageFile);
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" style={styles.input} required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" style={{...styles.input, ...styles.textarea}} required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" style={styles.input} required />
                    <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" style={styles.input} required />

                    <label style={{marginBottom: '0.5rem', display: 'block'}}>Image</label>
                    <input name="image" type="file" onChange={handleFileChange} style={styles.input} />

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
    input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-background)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' },
    textarea: { minHeight: '100px', resize: 'vertical' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
    cancelButton: { backgroundColor: '#6c757d' }
};

export default MedicineModal;
