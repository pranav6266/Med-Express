import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import { useCart } from "../context/CartContext.jsx";
import styles from './Dashboard.module.css'; // Import the CSS Module

const categories = ["All", "Pain Relief", "Allergy", "Vitamins", "Digestive Health", "First Aid"];
const medicineKeywords = {
    "Pain Relief": ["Paracetamol", "Ibuprofen", "Aspirin", "Tylenol", "Advil", "Aleve", "Excedrin", "Midol"],
    "Allergy": ["Loratadine", "Cetirizine", "Antihistamine", "Benadryl", "Zyrtec", "Claritin"],
    "Vitamins": ["Multivitamin", "Vitamin D3", "Calcium", "Iron Supplement"],
    "Digestive Health": ["Omeprazole", "Antacid", "Gaviscon", "Pepto-Bismol", "Imodium", "Probiotic"],
    "First Aid": ["Band-Aids", "Hydrogen Peroxide", "Neosporin", "Cortizone-10"]
};

function Dashboard() {
    // ... (All state and logic hooks remain the same)
    const [allMedicines, setAllMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { addToCart, selectedStore, setSelectedStore } = useCart();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // ... (All useEffect hooks and handlers remain the same)
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
            <div className={styles.container}>
                <div className={styles.heroSection}>
                    <h1 className={styles.title}>Welcome back, {userInfo?.name}!</h1>
                    <p className={styles.subtitle}>Your health is our priority. Get your medicines delivered fast.</p>
                </div>

                {!selectedStore ? (
                    <div className={styles.storeSelectorPrompt}>
                        <h2>Select a Pharmacy to Start Shopping</h2>
                        <select onChange={(e) => setSelectedStore(e.target.value)} defaultValue="" className={styles.storeSelector}>
                            <option value="" disabled>-- Click to choose a nearby pharmacy --</option>
                            {stores.map(store => (
                                <option key={store._id} value={store._id}>
                                    {store.name} - {store.address}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className={styles.contentFadeIn}>
                        <div className={styles.controlsContainer}>
                            <div className={styles.storeDisplay}>
                                <span>Shopping from: <strong>{selectedStoreDetails?.name}</strong></span>
                                <button onClick={() => setSelectedStore(null)} className={styles.changeStoreButton}>Change</button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search for medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.categoryTabs}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={activeCategory === category ? styles.activeTab : styles.tab}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p className={styles.prompt}>Loading Medicines...</p>
                        ) : error ? (
                            <p className={styles.errorMessage}>{error}</p>
                        ) : filteredMedicines.length === 0 ? (
                            <p className={styles.prompt}>No medicines found.</p>
                        ) : (
                            <div className={styles.grid}>
                                {filteredMedicines.map((med) => (
                                    <div key={med._id} className={styles.card}>
                                        {med.stock === 0 && <div className={styles.outOfStockOverlay}>Out of Stock</div>}
                                        <img src={med.imageUrl} alt={med.name} className={styles.medImage} />
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.medName}>{med.name}</h3>
                                            <p className={styles.medDescription}>{med.description}</p>
                                            <div className={styles.cardFooter}>
                                                <p className={styles.medPrice}>${med.price.toFixed(2)}</p>
                                                <button
                                                    className={styles.addToCartButton}
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

export default Dashboard;