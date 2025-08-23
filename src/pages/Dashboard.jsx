// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import { useCart } from "../context/CartContext.jsx";

function Dashboard() {
    // Local state for this component
    const [medicines, setMedicines] = useState([]);
    const [stores, setStores] = useState([]); // State to hold the list of stores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Global state from CartContext
    const { addToCart, selectedStore, setSelectedStore } = useCart();

    // Effect to fetch all available stores when the component mounts
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const { data } = await axios.get('/api/users/stores');
                setStores(data);
            } catch (err) {
                setError('Could not fetch stores. Please try again later.');
            }
        };
        fetchStores();
    }, []);

    // Effect to fetch medicines whenever a store is selected or the search term changes
    useEffect(() => {
        // Only fetch medicines if a store has been selected
        if (!selectedStore) {
            setMedicines([]); // Clear medicines if no store is selected
            setLoading(false);
            return;
        }

        const fetchMedicines = async () => {
            try {
                setLoading(true);
                // Updated API call to fetch medicines for the specific store
                const { data } = await axios.get(`/api/users/medicines?storeId=${selectedStore}`);
                setMedicines(data);
                setError('');
            } catch (err) {
                const message = err.response?.data?.message || 'Failed to fetch medicines';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [selectedStore, searchTerm]); // Re-run this effect when selectedStore or searchTerm changes

    const handleAddToCart = (med) => {
        if (med.stock > 0) {
            addToCart(med._id, 1);
        }
    };

    // Handler for the dropdown selection
    const handleStoreChange = (e) => {
        setSelectedStore(e.target.value);
    };

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>Our Medicines</h1>

                {/* Store Selection Dropdown */}
                <select onChange={handleStoreChange} value={selectedStore || ''} style={styles.storeSelector}>
                    <option value="" disabled>-- Select a Pharmacy --</option>
                    {stores.map(store => (
                        <option key={store._id} value={store._id}>
                            {store.name} - {store.address}
                        </option>
                    ))}
                </select>

                {/* Search input is disabled until a store is selected */}
                <input
                    type="text"
                    placeholder="Search for medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    disabled={!selectedStore}
                />

                {/* Conditional Rendering Logic */}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={styles.errorMessage}>{error}</p>
                ) : !selectedStore ? (
                    <p style={styles.prompt}>Please select a store to view available medicines.</p>
                ) : medicines.length === 0 ? (
                    <p style={styles.prompt}>No medicines found at this store.</p>
                ) : (
                    <div style={styles.grid}>
                        {medicines.map((med) => (
                            <div key={med._id} style={styles.card}>
                                <img src={med.imageUrl} alt={med.name} style={styles.medImage} />
                                <h3 style={styles.medName}>{med.name}</h3>
                                <p style={styles.medDescription}>{med.description}</p>
                                <p style={styles.medPrice}>${med.price.toFixed(2)}</p>
                                <p style={styles.medStock}>
                                    {med.stock > 0 ? `In Stock: ${med.stock}` : 'Out of Stock'}
                                </p>
                                <button
                                    style={styles.button}
                                    disabled={med.stock === 0}
                                    onClick={() => handleAddToCart(med)}
                                >
                                    {med.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Styling (with new styles added)
const styles = {
    container: { padding: '0 2rem' },
    title: { textAlign: 'center', marginBottom: '1rem' },
    storeSelector: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontSize: '1rem',
    },
    searchInput: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontSize: '1rem',
    },
    prompt: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#aaa',
        padding: '2rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'var(--card-background)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
    },
    medImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    medName: { marginTop: 0, flexGrow: 1 },
    medDescription: { color: '#ccc', flexGrow: 1 },
    medPrice: { fontWeight: 'bold', fontSize: '1.2rem' },
    medStock: { color: '#aaa' },
    button: { width: '100%', padding: '0.75rem', marginTop: 'auto' },
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default Dashboard;