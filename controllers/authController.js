// controllers/authController.js

import crypto from 'crypto';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// --- User Registration ---
export const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role, // Can be 'user', 'agent', or 'admin'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};


// --- User Login ---
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};


// --- Forgot Password ---
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token from user model method
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

        // In a real app, you would email this URL to the user
        console.log('Password Reset URL:', resetUrl);

        res.status(200).json({
            success: true,
            message: `An email has been sent to ${email} with password reset instructions.`,
        });
    } catch (error) {
        // Clear the token fields if there's an error
        req.user.resetPasswordToken = undefined;
        req.user.resetPasswordExpire = undefined;
        await req.user.save({ validateBeforeSave: false });
        next(error);
    }
};


// --- Reset Password ---
export const resetPassword = async (req, res, next) => {
    try {
        // Hash the token from the URL params
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token: generateToken(user._id), // Optionally log the user in
        });
    } catch (error) {
        next(error);
    }
};