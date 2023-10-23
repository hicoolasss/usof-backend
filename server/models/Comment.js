import mongoose from 'mongoose';
import Post from './Post.js';

export const commentSchema = new mongoose.Schema({ // добавлено 'export'
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    post: { // добавляем ссылку на пост
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
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