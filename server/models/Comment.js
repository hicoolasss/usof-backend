import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
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