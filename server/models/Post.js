import mongoose from 'mongoose';
import { commentSchema } from './Comment.js';

const postSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
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
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    categories: [{ // добавляем ссылки на категории
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
});

const Post = mongoose.model('Post', postSchema);

export default Post;