import mongoose from 'mongoose';
const resetPasswordTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' }  // Это поле автоматически удаляет запись через 1 час
});

const ResetPasswordToken = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);

export default ResetPasswordToken;
