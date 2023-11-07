import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    google_id: {
        type: String,
        unique: true,
        default: () => uuidv4(), // Генерируем UUID если google_id не предоставлен
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    password_hash: {
        type: String,
        required: true,
        default: "GoogleAuth"
    },
    full_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    email_verification_token: String,
    is_email_verified: {
        type: Boolean,
        default: false
    },
    profile_picture_path: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

export default User;
