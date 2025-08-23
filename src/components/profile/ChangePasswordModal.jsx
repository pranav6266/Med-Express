import React, { useState } from 'react';
import axios from 'axios';
import modalStyles from '../Modal.module.css';
import styles from './ChangePasswordModal.module.css';

function ChangePasswordModal({ onClose }) {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('New passwords do not match.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setMessage('New password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const body = { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword };
            const { data } = await axios.put('/api/users/profile/changepassword', body, config);
            setMessage(data.message);
            // Close modal after a short delay on success
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={modalStyles.modalOverlay}>
            <div className={modalStyles.modalContent}>
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Old Password</label>
                        <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className={styles.input} required />
                    </div>
                    {message && <p style={{textAlign: 'center', margin: '1rem 0'}}>{message}</p>}
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Password'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;