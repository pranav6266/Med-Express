// src/components/admin/InventoryManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryManagement() {
    const [stores, setStores] = useState([]);
    const [medicines, setMedicines] = useState([]); // Will hold the full medicine objects
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [newStock, setNewStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Effect to fetch initial data (stores and all medicines)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const { data: storesData } = await axios.get('/api/users/stores', config);
                const { data: medicinesData } = await axios.get('/api/admin/medicines/all', config);

                setStores(storesData);
                setMedicines(medicinesData);
            } catch (error) {
                setMessage('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    // --- NEW: Effect to auto-fill the current stock ---
    // This effect runs whenever the user changes the selected store or medicine.
    useEffect(() => {
        // Ensure both a store and a medicine are selected
        if (selectedStore && selectedMedicine) {
            // Find the full object for the selected medicine from our state
            const medicineObject = medicines.find(m => m._id === selectedMedicine);

            if (medicineObject) {
                // Find the inventory details for the selected store within that medicine's inventory array
                const inventoryItem = medicineObject.inventory.find(
                    inv => inv.storeId.toString() === selectedStore
                );

                // If a stock record exists, set the input field to its value.
                // Otherwise, set it to 0, indicating it's not currently stocked there.
                setNewStock(inventoryItem ? inventoryItem.stock : 0);
            }
        } else {
            // If either dropdown is not selected, clear the input field.
            setNewStock('');
        }
    }, [selectedStore, selectedMedicine, medicines]); // Re-run whenever these dependencies change

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStore || !selectedMedicine || newStock === '') {
            setMessage('Please fill all fields');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const body = {
                storeId: selectedStore,
                medicineId: selectedMedicine,
                newStock: Number(newStock),
            };

            await axios.put('/api/admin/inventory', body, config);
            setMessage('Stock updated successfully!');
            // We don't clear the input anymore, so the admin can see the new value.
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update stock');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Manage Inventory</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} style={styles.input}>
                    <option value="">-- Select a Store --</option>
                    {stores.map(store => <option key={store._id} value={store._id}>{store.name}</option>)}
                </select>
                <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)} style={styles.input}>
                    <option value="">-- Select a Medicine --</option>
                    {medicines.map(med => <option key={med._id} value={med._id}>{med.name}</option>)}
                </select>
                <input
                    type="number"
                    placeholder="Current Stock"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    style={styles.input}
                    disabled={!selectedStore || !selectedMedicine} // Disable input until selections are made
                />
                <button type="submit" disabled={loading || !selectedStore || !selectedMedicine} style={styles.button}>
                    {loading ? 'Updating...' : 'Update Stock'}
                </button>
            </form>
            {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
        </div>
    );
}

const styles = {
    container: { padding: '1rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: 'auto' },
    input: { padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--input-border)' },
    button: { padding: '0.75rem', fontSize: '1rem', cursor: 'pointer' },
};

export default InventoryManagement;