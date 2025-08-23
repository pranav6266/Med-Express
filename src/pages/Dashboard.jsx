// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import {useCart} from "../context/CartContext.jsx";

function Dashboard() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const {addToCart} = useCart();

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setLoading(true);
                // Fetch medicines, optionally with a search term
                const {data} = await axios.get(`/api/users/medicines?keyword=${searchTerm}`);
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
    }, [searchTerm]);


    const handleAddToCart = (med) => {
        if (med.stock > 0) {
            addToCart(med._id, 1); // Add 1 unit of the medicine
        }

        return (
            <div>
                <Header/>
                <div style={styles.container}>
                    <h1 style={styles.title}>Our Medicines</h1>
                    <input
                        type="text"
                        placeholder="Search for medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={styles.errorMessage}>{error}</p>
                    ) : (
                        <div style={styles.grid}>
                            {medicines.map((med) => (
                                <div key={med._id} style={styles.card}>
                                    <h3 style={styles.medName}>{med.name}</h3>
                                    <img src={med.imageUrl} alt={med.name} style={styles.medImage}/>
                                    <p style={styles.medDescription}>{med.description}</p>
                                    <p style={styles.medPrice}>${med.price.toFixed(2)}</p>
                                    <p style={styles.medStock}>
                                        {med.stock > 0 ? `In Stock: ${med.stock}` : 'Out of Stock'}
                                    </p>
                                    <button style={styles.button} disabled={med.stock === 0}
                                            onClick={() => handleAddToCart(med)}>
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

// Styling
    // Correct code for the styles object in Dashboard.jsx
    const styles = {
        container: { padding: '0 2rem' },
        title: { textAlign: 'center', marginBottom: '2rem' },
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
        },
        medName: { marginTop: 0 },
        medImage: {
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '1rem',
        },
        medDescription: { color: '#ccc' },
        medPrice: { fontWeight: 'bold', fontSize: '1.2rem' },
        medStock: { color: '#aaa' },
        button: { width: '100%', padding: '0.75rem' },
        errorMessage: { color: '#ff6b6b', textAlign: 'center' },
    };
}

export default Dashboard;
