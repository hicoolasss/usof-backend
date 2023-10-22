import mongoose from 'mongoose';

export const commentSchema = new mongoose.Schema({ // добавлено 'export'
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    publish_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;