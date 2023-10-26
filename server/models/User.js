import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    google_id: {
        type: String,
        unique: true,      // Убедитесь, что Google ID уникален
        required: false    // Не делайте его обязательным, так как не все пользователи регистрируются через Google
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
