// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import { useCart } from "../context/CartContext.jsx";

const categories = ["All", "Pain Relief", "Allergy", "Vitamins", "Digestive Health", "First Aid"];
const medicineKeywords = {
    "Pain Relief": ["Paracetamol", "Ibuprofen", "Aspirin", "Tylenol", "Advil", "Aleve", "Excedrin", "Midol"],
    "Allergy": ["Loratadine", "Cetirizine", "Antihistamine", "Benadryl", "Zyrtec", "Claritin"],
    "Vitamins": ["Multivitamin", "Vitamin D3", "Calcium", "Iron Supplement"],
    "Digestive Health": ["Omeprazole", "Antacid", "Gaviscon", "Pepto-Bismol", "Imodium", "Probiotic"],
    "First Aid": ["Band-Aids", "Hydrogen Peroxide", "Neosporin", "Cortizone-10"]
};

function Dashboard() {
    const [allMedicines, setAllMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredCard, setHoveredCard] = useState(null); // State to track hovered card
    const { addToCart, selectedStore, setSelectedStore } = useCart();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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

    useEffect(() => {
        if (!selectedStore) {
            setAllMedicines([]);
            setFilteredMedicines([]);
            return;
        }

        const fetchMedicines = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/users/medicines?storeId=${selectedStore}`);
                setAllMedicines(data);
                setError('');
            } catch (err) {
                const message = err.response?.data?.message || 'Failed to fetch medicines';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [selectedStore]);

    useEffect(() => {
        let medicinesToFilter = [...allMedicines];

        if (activeCategory !== 'All') {
            const keywords = medicineKeywords[activeCategory];
            medicinesToFilter = medicinesToFilter.filter(med =>
                keywords.some(keyword => med.name.includes(keyword) || med.description.includes(keyword))
            );
        }

        if (searchTerm) {
            medicinesToFilter = medicinesToFilter.filter(med =>
                med.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredMedicines(medicinesToFilter);
    }, [searchTerm, activeCategory, allMedicines]);


    const handleAddToCart = (med) => {
        if (med.stock > 0) {
            addToCart(med._id, 1);
        }
    };

    const selectedStoreDetails = stores.find(s => s._id === selectedStore);

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <div style={styles.heroSection}>
                    <h1 style={styles.title}>Welcome back, {userInfo?.name}!</h1>
                    <p style={styles.subtitle}>Your health is our priority. Get your medicines delivered fast.</p>
                </div>

                {!selectedStore ? (
                    <div style={styles.storeSelectorPrompt}>
                        <h2>Select a Pharmacy to Start Shopping</h2>
                        <select onChange={(e) => setSelectedStore(e.target.value)} defaultValue="" style={styles.storeSelector}>
                            <option value="" disabled>-- Click to choose a nearby pharmacy --</option>
                            {stores.map(store => (
                                <option key={store._id} value={store._id}>
                                    {store.name} - {store.address}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div>
                        <div style={styles.controlsContainer}>
                        <div style={styles.storeDisplay}>
                            <span>Shopping from: <strong>{selectedStoreDetails?.name}</strong></span>
                            <button onClick={() => setSelectedStore(null)} style={styles.changeStoreButton}>Change Store</button>
                        </div>

                        <input
                            type="text"
                            placeholder="Search for medicines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                        </div>
                        <div style={styles.categoryTabs}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    style={activeCategory === category ? styles.activeTab : styles.tab}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p style={styles.prompt}>Loading Medicines...</p>
                        ) : error ? (
                            <p style={styles.errorMessage}>{error}</p>
                        ) : filteredMedicines.length === 0 ? (
                            <p style={styles.prompt}>No medicines found for "{activeCategory}"{searchTerm && ` matching "${searchTerm}"`}.</p>
                        ) : (
                            <div style={styles.grid}>
                                {filteredMedicines.map((med) => (
                                    <div
                                        key={med._id}
                                        style={hoveredCard === med._id ? {...styles.card, ...styles.cardHover} : styles.card}
                                        onMouseEnter={() => setHoveredCard(med._id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {med.stock === 0 && <div style={styles.outOfStockOverlay}>Out of Stock</div>}
                                        <img src={med.imageUrl} alt={med.name} style={styles.medImage} />
                                        <div style={styles.cardContent}>
                                            <h3 style={styles.medName}>{med.name}</h3>
                                            <p style={styles.medDescription}>{med.description}</p>
                                            <div style={styles.cardFooter}>
                                                <p style={styles.medPrice}>${med.price.toFixed(2)}</p>
                                                <button
                                                    style={styles.button}
                                                    disabled={med.stock === 0}
                                                    onClick={() => handleAddToCart(med)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- REFINED STYLES ---
const styles = {
    container: { padding: '2rem' },
    heroSection: { textAlign: 'center', marginBottom: '2rem' },
    title: { margin: '0 0 0.5rem 0' },
    subtitle: { margin: 0, fontSize: '1.2rem', color: '#aaa' },
    storeSelectorPrompt: {
        backgroundColor: 'var(--card-background)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid var(--card-border)'
    },
    storeSelector: {
        width: '100%',
        maxWidth: '600px',
        padding: '0.75rem',
        marginTop: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontSize: '1rem',
    },
    storeDisplay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: 'var(--input-background)',
        borderRadius: '8px',
    },
    changeStoreButton: {
        background: 'transparent',
        border: '1px solid var(--primary-color)',
        color: 'var(--primary-color)',
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    searchInput: {
        width: '100%',
        padding: '0.85rem',
        marginBottom: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        backgroundColor: 'var(--input-background)',
        color: 'var(--text-color)',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    categoryTabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    tab: {
        padding: '0.5rem 1.25rem',
        cursor: 'pointer',
        borderRadius: '20px',
        border: '1px solid var(--card-border)',
        background: 'transparent',
        color: 'var(--text-color)',
        fontSize: '0.9rem'
    },
    activeTab: {
        padding: '0.5rem 1.25rem',
        cursor: 'pointer',
        borderRadius: '20px',
        border: '1px solid var(--primary-color)',
        background: 'var(--primary-color)',
        color: 'white',
        fontSize: '0.9rem'
    },
    prompt: { textAlign: 'center', fontSize: '1.2rem', color: '#aaa', padding: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    card: {
        backgroundColor: 'var(--card-background)',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px var(--glow-color)',
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffc107',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        zIndex: 2
    },
    medImage: {
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        borderBottom: '1px solid var(--card-border)',
    },
    controlsContainer: {
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
    },
    cardContent: { padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 },
    medName: { marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' },
    medDescription: { color: '#ccc', flexGrow: 1, fontSize: '0.9rem', marginBottom: '1rem' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
    medPrice: { fontWeight: 'bold', fontSize: '1.3rem', margin: 0 },
    button: { padding: '0.6rem 1rem', fontSize: '0.9rem' },
    errorMessage: { color: '#ff6b6b', textAlign: 'center' },
};

export default Dashboard;