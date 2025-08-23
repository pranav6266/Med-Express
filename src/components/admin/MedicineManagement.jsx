import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MedicineModal from './MedicineModal'; // The modal for adding/editing

function MedicineManagement() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    // Function to fetch all medicines from the backend
    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/admin/medicines/all', config);
            setMedicines(data);
        } catch (err) {
            setError('Failed to fetch medicines.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch medicines when the component mounts
    useEffect(() => {
        fetchMedicines();
    }, []);

    // Handler to open the modal for a new medicine
    const handleAddNew = () => {
        setSelectedMedicine(null);
        setIsModalOpen(true);
    };

    // Handler to open the modal to edit an existing medicine
    const handleEdit = (medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    // Handler for saving a new or updated medicine
    const handleSave = async (formData, imageFile) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };

            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (selectedMedicine) {
                // Update existing medicine
                await axios.put(`/api/admin/medicines/${selectedMedicine._id}`, data, config);
            } else {
                // Create new medicine
                await axios.post('/api/admin/medicines', data, config);
            }

            setIsModalOpen(false);
            fetchMedicines(); // Refresh the list
        } catch (err) {
            alert('Failed to save medicine: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    // Handler for deleting a medicine
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/admin/medicines/${id}`, config);
                fetchMedicines(); // Refresh the list
            } catch (err) {
                alert('Failed to delete medicine.');
            }
        }
    };


    if (loading) return <p>Loading medicines...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            {isModalOpen && (
                <MedicineModal
                    medicine={selectedMedicine}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
            <div style={styles.header}>
                <h3>List of All Medicines in the Catalog</h3>
                <button onClick={handleAddNew} style={styles.addButton}>+ Add New Medicine</button>
            </div>
            <table style={styles.table}>
                <thead>
                <tr>
                    {/* 1. ADD THE "IMAGE" TABLE HEADER */}
                    <th style={{...styles.th, width: '10%'}}>Image</th>
                    <th style={styles.th}>Name</th>
                    <th style={{...styles.th, width: '15%'}}>Price</th>
                    <th style={{...styles.th, width: '20%'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {medicines.map(med => (
                    <tr key={med._id}>
                        {/* 2. ADD THE TABLE CELL FOR THE IMAGE */}
                        <td style={styles.td}>
                            <img src={med.imageUrl} alt={med.name} style={styles.tableImage} />
                        </td>
                        <td style={styles.td}>{med.name}</td>
                        <td style={styles.td}>₹{med.price.toFixed(2)}</td>
                        <td style={styles.td}>
                            <button onClick={() => handleEdit(med)} style={{...styles.button, ...styles.editButton}}>Edit</button>
                            <button onClick={() => handleDelete(med._id)} style={{...styles.button, ...styles.deleteButton}}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// 3. ADD STYLES FOR THE TABLE AND IMAGE
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    addButton: {
        backgroundColor: '#28a745', // Green
        color: 'white',
        border: 'none',
        padding: '0.6rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--input-background)',
    },
    th: {
        backgroundColor: '#343a40',
        color: 'white',
        padding: '0.75rem',
        textAlign: 'left',
    },
    td: {
        padding: '0.75rem',
        borderBottom: '1px solid var(--card-border)',
        verticalAlign: 'middle',
    },
    tableImage: {
        width: '50px',
        height: '50px',
        borderRadius: '5px',
        objectFit: 'cover',
    },
    button: {
        border: 'none',
        padding: '0.5rem 1rem',
        marginRight: '0.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
    },
    editButton: {
        backgroundColor: '#007bff', // Blue
    },
    deleteButton: {
        backgroundColor: '#dc3545', // Red
    },
};

export default MedicineManagement;