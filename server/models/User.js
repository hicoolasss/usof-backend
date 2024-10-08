import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password_hash: {
        type: String,
        required: true,
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
        default: "porshe911_2.jpg"
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

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model('User', userSchema);

export default User;
