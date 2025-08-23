// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- 1. IMPORT useNavigate ---
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const avatarOptions = [ '/avatars/1.png', '/avatars/2.png', '/avatars/3.png', '/avatars/4.png', '/avatars/5.png'];
const defaultAvatar = '/avatars/default_profile_img.png';


function Profile() {
    // --- 2. INITIALIZE useNavigate ---
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

    // --- 3. CREATE A HANDLER FOR THE CLOSE BUTTON ---
    const handleClose = () => {
        navigate(-1); // Navigates to the previous page in history
    };


    if (loading) return <p>Loading profile...</p>;

    return (
        <div>
            {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}

            <Header />
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '800px' }}>
                    <h2>My Profile</h2>
                    <div style={styles.avatarSection}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Profile Picture</p>
                        <img src={formData.avatar} alt="Current Avatar" style={styles.currentAvatar} onClick={() => setShowAvatarOptions(!showAvatarOptions)} />
                        {showAvatarOptions && (
                            <div style={styles.avatarMenu}>
                                <p style={styles.menuTitle}>Change Avatar</p>
                                <div style={styles.avatarOptions}>
                                    {avatarOptions.map(av => ( <img key={av} src={av} alt="Avatar Option" style={styles.avatarOption} onClick={() => handleAvatarSelect(av)} /> ))}
                                </div>
                                {formData.avatar !== defaultAvatar && ( <button type="button" onClick={handleRemoveAvatar} style={styles.removeButton}> Remove Avatar </button> )}
                            </div>
                        )}
                    </div>
                    <div style={styles.sectionContainer}>
                        <h3 style={styles.sectionHeader}>Personal Information</h3>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} /></div>
                            <div style={styles.formGroup}><label>Email</label><input type="email" name="email" value={formData.email} style={styles.input} readOnly /></div>
                            <div style={styles.formGroup}><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} /></div>
                        </div>
                    </div>
                    <div style={styles.sectionContainer}>
                        <h3 style={styles.sectionHeader}>Default Address</h3>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}><label>Flat/House No.</label><input type="text" name="flatNo" value={formData.address.flatNo} onChange={handleChange} style={styles.input} /></div>
                            <div style={styles.formGroup}><label>Road</label><input type="text" name="road" value={formData.address.road} onChange={handleChange} style={styles.input} /></div>
                            <div style={styles.formGroup}><label>Locality</label><input type="text" name="locality" value={formData.address.locality} onChange={handleChange} style={styles.input} /></div>
                            <div style={styles.formGroup}><label>Pincode</label><input type="text" name="pincode" value={formData.address.pincode} onChange={handleChange} style={styles.input} /></div>
                        </div>
                    </div>

                    {message && <p style={{ textAlign: 'center', margin: '1rem 0' }}>{message}</p>}

                    <button type="button" onClick={() => setIsPasswordModalOpen(true)} style={styles.changePasswordButton}>
                        Change Password
                    </button>

                    {/* --- 4. ADD BUTTON GROUP FOR SAVE AND CLOSE --- */}
                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={loading} style={styles.saveButton}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={handleClose} style={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    avatarSection: { textAlign: 'center', marginBottom: '2rem', position: 'relative' },
    currentAvatar: { width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--primary-color)', objectFit: 'cover', cursor: 'pointer', marginTop: '0.5rem' },
    avatarMenu: { position: 'absolute', top: '160px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', zIndex: 10, width: 'calc(100% - 2rem)', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
    menuTitle: { margin: '0 0 1rem 0', fontWeight: 'bold' },
    avatarOptions: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' },
    avatarOption: { width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', border: '2px solid transparent', transition: 'transform 0.2s' },
    removeButton: { marginTop: '1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' },
    sectionContainer: { marginBottom: '2rem', textAlign: 'left' },
    sectionHeader: { marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-background)', color: 'var(--text-color)', fontSize: '1rem', marginTop: '0.25rem' },
    changePasswordButton: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        backgroundColor: 'transparent',
        border: '1px solid var(--primary-color)',
        color: 'var(--primary-color)',
        cursor: 'pointer'
    },
    // --- 5. ADD NEW STYLES FOR THE BUTTON GROUP ---
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        width: '100%'
    },
    saveButton: {
        flex: 1 // Allows the button to grow and fill available space
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#6c757d' // A neutral, secondary color
    }
};

export default Profile;