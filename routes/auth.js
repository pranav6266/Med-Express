// routes/auth.js

import express from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', forgotPassword);

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', resetPassword);

export default router;