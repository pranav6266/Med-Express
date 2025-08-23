import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const addressSchema = new mongoose.Schema({
    flatNo: { type: String, default: '' },
    road: { type: String, default: '' },
    locality: { type: String, default: '' },
    pincode: { type: String, default: '' },
    city: { type: String, default: 'Bangalore' },
    state: { type: String, default: 'Karnataka' },
}, { _id: false });


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user',
    },

    address: addressSchema,

    phone: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: '../public/avatars/default_profile_img.png'
    },
    cart: [
        {
            medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};


const User = mongoose.model('User', userSchema);
export default User;