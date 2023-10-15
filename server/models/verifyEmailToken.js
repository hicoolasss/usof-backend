import mongoose from 'mongoose';
const verifyEmailTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' }  // Это поле автоматически удаляет запись через 1 час
});

const verifyEmailToken = mongoose.model('verifyEmailToken', verifyEmailTokenSchema);

export default verifyEmailToken;