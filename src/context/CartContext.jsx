// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // State to manage which store the user has selected.
    // This is placed in the context so other components (like Checkout) can access it.
    const [selectedStore, setSelectedStore] = useState(null);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/users/cart', getConfig());
            setCartItems(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            fetchCart();
        }
    }, []);

    const addToCart = async (medicineId, quantity = 1) => {
        try {
            const { data } = await axios.post('/api/users/cart', { medicineId, quantity }, getConfig());
            setCartItems(data);
            setIsCartOpen(true);
        } catch (err) {
            alert('Error adding to cart: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const removeFromCart = async (medicineId) => {
        try {
            const { data } = await axios.delete(`/api/users/cart/${medicineId}`, getConfig());
            setCartItems(data);
        } catch (err) {
            alert('Error removing from cart: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const updateQuantity = async (medicineId, quantity) => {
        try {
            const { data } = await axios.put(`/api/users/cart/${medicineId}`, { quantity }, getConfig());
            setCartItems(data);
        } catch (err) {
            alert('Error updating quantity: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);

    // Expose the new store state and its setter function through the context
    const value = {
        cartItems,
        isCartOpen,
        loading,
        error,
        selectedStore,
        setSelectedStore,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        closeCart,
        fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};