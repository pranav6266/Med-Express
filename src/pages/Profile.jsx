// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import formStyles from './AuthForm.module.css'; // For container and card
import styles from './Profile.module.css'; // For component-specific styles

const avatarOptions = [ '/avatars/1.png', '/avatars/2.png', '/avatars/3.png', '/avatars/4.png', '/avatars/5.png'];
const defaultAvatar = '/avatars/default_profile_img.png';

function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', avatar: '', address: { flatNo: '', road: '', locality: '', pincode: '' } });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/users/profile', config);

                const profileAddress = data.address || {};
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    avatar: data.avatar || defaultAvatar,
                    address: {
                        flatNo: profileAddress.flatNo || '',
                        road: profileAddress.road || '',
                        locality: profileAddress.locality || '',
                        pincode: profileAddress.pincode || ''
                    }
                });
            } catch (error) {
                setMessage('Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (Object.keys(formData.address).includes(name)) {
            setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarSelect = (avatarUrl) => {
        setFormData(prev => ({ ...prev, avatar: avatarUrl }));
        setShowAvatarOptions(false);
    };

    const handleRemoveAvatar = () => {
        setFormData(prev => ({ ...prev, avatar: defaultAvatar }));
        setShowAvatarOptions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${currentUserInfo.token}` } };
            const { data: updatedUser } = await axios.put('/api/users/profile', formData, config);
            const newUpdatedUserInfo = { ...currentUserInfo, name: updatedUser.name, avatar: updatedUser.avatar };
            localStorage.setItem('userInfo', JSON.stringify(newUpdatedUserInfo));
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        navigate(-1); // Navigates to the previous page in history
    };


    if (loading) return <p>Loading profile...</p>;

    return (
        <div>
            {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}

            <Header />
            <div className={formStyles.formContainer}>
                <form onSubmit={handleSubmit} className={formStyles.formCard} style={{ maxWidth: '800px' }}>
                    <h2>My Profile</h2>

                    <div className={styles.avatarSection}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Profile Picture</p>
                        <img src={formData.avatar} alt="Current Avatar" className={styles.currentAvatar} onClick={() => setShowAvatarOptions(!showAvatarOptions)} />
                        {showAvatarOptions && (
                            <div className={styles.avatarMenu}>
                                <p className={styles.menuTitle}>Change Avatar</p>
                                <div className={styles.avatarOptions}>
                                    {avatarOptions.map(av => ( <img key={av} src={av} alt="Avatar Option" className={styles.avatarOption} onClick={() => handleAvatarSelect(av)} /> ))}
                                </div>
                                {formData.avatar !== defaultAvatar && ( <button type="button" onClick={handleRemoveAvatar} className={styles.removeButton}> Remove Avatar </button> )}
                            </div>
                        )}
                    </div>

                    <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionHeader}>Personal Information</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Email</label><input type="email" name="email" value={formData.email} className={styles.input} readOnly /></div>
                            <div className={styles.formGroup}><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} /></div>
                        </div>
                    </div>

                    <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionHeader}>Default Address</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Flat/House No.</label><input type="text" name="flatNo" value={formData.address.flatNo} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Road</label><input type="text" name="road" value={formData.address.road} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Locality</label><input type="text" name="locality" value={formData.address.locality} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Pincode</label><input type="text" name="pincode" value={formData.address.pincode} onChange={handleChange} className={styles.input} /></div>
                        </div>
                    </div>

                    {message && <p style={{ textAlign: 'center', margin: '1rem 0' }}>{message}</p>}

                    <button type="button" onClick={() => setIsPasswordModalOpen(true)} className={styles.changePasswordButton}>
                        Change Password
                    </button>

                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={loading} className={styles.saveButton}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={handleClose} className={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;